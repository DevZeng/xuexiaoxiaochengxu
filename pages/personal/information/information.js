// pages/personal/information/information.js
const app = getApp(),
  mail_reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$'), //邮箱正则
  iphone_reg = /^[1][3,4,5,7,8][0-9]{9}$/, //手机号码正则
  regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig; //匹配emoji表情正则
let register_type = true, //true:注册 false:修改
  user_info;//用户提交的数据
Page({
  data: {
    userInfo:{
      nickname:'',
      name:'',
      sex:1,
      phone:'',
      id_card:'',
      address:'',
      worker:0,
      school_id:0,
      class_id:0,
      href:'',
    },
    u_info: {
      school_id:0
    }, //个人信息
    select_school:null,
    select_grade:null,
    select_class:null,
    showFace:false,
    isteacher: false, //是否是本校老师
    isworkers: false, //是否为本校职工
    grades: [], //年级列表
    grade_index: 0,
    classes: [], //班级列表
    class_index: 0,
    classId_list: [],
    mask_disable: false,
    showCamera: false,
    cameraConfig: {
      flash: 'off',
      position: 'front'
    },
    workers:[{
      'name':'普通教职工','type':1
    },{
      'name':'班主任','type':2
    },{
      'name':'安保员','type':3
    }],
    schools:[],
    type:null
  },

  onLoad: function(options) {
    console.log('data');
    // 初始化
    // console.log('openFace'+app.globalData.openFace);
    register_type = true;
    let info = app.globalData.userInfo;
    this.showCamera = false //是否显示照相机
    this.cameraConfig = { //照相机参数配置
      flash: 'off',
      position: 'front'
    }
    let isworker = info.worker ==0?false:true;
    this.setData({
      isteacher: false,
      isworkers: isworker,
      mask_disable: false,
      userInfo: info,
      showFace :wx.getStorageSync('openFace')
    })
    // wx.showToast({title: '加载中',icon: 'loading', mask: true,duration: 10000})
  },

  onShow: function() {
    this.getSchoolsList();
    this.setData({
      showFace :wx.getStorageSync('openFace')
      // showFace = app.globalData.openFace
    })
    // console.log("this.showFace".this.showFace);
    // console.log()
    // this.showFace = app.globalData.openFace==1?true:false;
  },
  onHide: function() {

  },
  getSchoolsList:function(){
    wx.request({
      url: app.globalData.host+'/schools?page=1&&limit=1000',
      method:'GET',
      success:(res)=>{
        if(res.statusCode==200){
          this.setData({
            schools:res.data.data.data
          })
        }
      }
    })
  },
  getGradeList:function(select_school){
    let that = this;
    console.log(that.data.schools)
    wx.request({
      url: app.globalData.host+'/grades?page=1&&limit=1000&&school_id='+that.data.schools[select_school].id,
      method:'GET',
      success:(res)=>{
        if(res.statusCode==200){
          this.setData({
            grades:res.data.data.data
          })
        }
      }
    })
  },
  
  // 设置显示个人信息
  bindPickerChange: function(e) {
    // console.log(this.workers)
    // let workers = this.workers;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // console.log('picker发送选择改变，携带值为', this.workers[e.detail.value].type)
    this.data.userInfo.worker = this.data.workers[e.detail.value].type
    this.setData({
      select_school: e.detail.value,
      
      // u_info: this.u_info
    })
    this.setData({
      type: e.detail.value,
      userInfo:this.data.userInfo
      // typeString : workers[e.detail.value].name
    })
    // this.setData({
    //   index: e.detail.value
    // })
  },

  bindSchoolChange:function(e){
    let that = this;
    console.log(that.data.schools);
    this.data.userInfo.school_id = this.data.schools[e.detail.value].id
    this.setData({
      select_school: e.detail.value,
      userInfo:this.data.userInfo
      // u_info: this.u_info
    })
    this.getGradeList(e.detail.value);
  },


  setInfo: function(info) {
    console.log('显示信息')
    wx.hideToast()
    info.user_openid = app.globalData.opnID
    if (info.teacher == 1) {//有教师信息
      console.log('显示教师资料')
      info.class_grade = info.class_grade + '年级'
      this.isteacher = true;
      this.isworkers = false;
    } else if (info.staff_status == 0 || info.staff_status == 1 || info.staff_status == 2) {//有职工信息
      console.log('显示职工资料')
      this.isworkers = true;
      this.isteacher = false;
    } else {
      this.isteacher = false;
      this.isworkers = false;
      console.log('显示普通用户资料')
    }
    this.u_info = info
    this.isteacher = this.isteacher
    this.isworkers = this.isworkers
    this.setData({
      u_info: this.u_info,
      isteacher: this.isteacher,
      isworkers: this.isworkers
    })
    console.log(this.u_info)
    // 获取年级列表
    this.getGradeList();
  },
  // 显示隐藏设置授权弹窗
  display: function() {
    this.mask_disable = !this.mask_disable;
    this.setData({
      mask_disable: this.mask_disable
    })
    console.log(this.mask_disable)
  },
  // 姓名输入
  nameInput: function(e) {
    this.data.userInfo.name = e.detail.value;
  },

  // 性别输入
  user_sex: function(e) {
    this.data.userInfo.sex = e.detail.value;
  },

  // 年龄输出
  ageInput: function(e) {
    this.data.userInfo.age = Number(e.detail.value);
  },

  // 手机输入
  iphoneInput: function(e) {
    this.data.userInfo.phone = Number(e.detail.value);
  },

  // 邮箱输入
  mailInput: function(e) {
    this.u_info.user_mail = e.detail.value;
  },

  // 身份证输入
  cardInput: function(e) {
    this.data.userInfo.id_card = e.detail.value;
  },

  // 地址输入
  addressInput: function(e) {
    this.data.userInfo.address = e.detail.value;
  },

  // 地点输入监听
  map: function(e) {
    let that = this;
    // return;
    wx.chooseLocation({
      success: function(res) {
        console.log('选择的地址')
        console.log(res.address)
        that.data.userInfo.address = res.address
          that.setData({
            userInfo: that.data.userInfo
          })
      },
      fail: function(err) {
        console.log(err)
        wx.getSetting({
          success: (res) => {
            console.log(res)
            if (res.authSetting['scope.userLocation'] === false) {
              console.log('用户没有授权地理信息')
              that.display()
            }
          }
        })
      }
    })
  },
  // 授权返回
  authorization: function(e) {
    this.display()
    // let that = this
    // console.log(e.detail.authSetting['scope.userLocation'])
    // if (e.detail.authSetting['scope.userLocation']) {
    //   wx.chooseLocation({
    //     success: function(res) {
    //       console.log('选择的地址')
    //       console.log(res.address)
    //       that.u_info.user_address = res.address
    //       that.setData({
    //         u_info: that.u_info
    //       })
    //     }
    //   })
    // }
  },
  // 工作单位输入
  wordInput: function(e) {
    this.u_info.user_word = e.detail.value;
  },

  // 老师工号输入
  work_numberInput: function(e) {
    this.u_info.work_number = e.detail.value;
  },

  // 学科输入
  subjectsInput: function(e) {
    this.u_info.subjects = e.detail.value;
  },

  // 部门输入
  departmentInput: function(e) {
    this.u_info.department = e.detail.value;
  },

  // 职位输入
  positionsInput: function(e) {
    this.u_info.positions = e.detail.value;
  },

  // 监听是否为本校职工
  switchChange: function (e) {
    console.log(e.detail.value)
    this.isworkers = e.detail.value;
    if (e.detail.value){
      this.isteacher = !e.detail.value
    }
    this.setData({
      isworkers: e.detail.value,
      // isteacher: this.isteacher,
      // u_info: this.u_info
    })
  },

  // 监听是否为教师
  switchChange1: function(e) {
    let that = this;
    
    if (e.detail.value) {//如果是教师
      if(e.detail.value==false){
        that.data.userInfo.worker = 0;
      this.setData({
        userInfo:that.data.userInfo
      })
      }
      console.log('选择了教师身份')
      if (!this.u_info.class_grade) {//有没有年级信息
        this.u_info.class_grade = '请选择年级'
        this.u_info.class_name = '请选择班级'
      }
    }
    console.log(this.u_info)
    if (!this.isteacher) {
      this.isworkers = !e.detail.value;
    }
    this.isteacher = e.detail.value;
    console.log(this.u_info)
    // if (!this.u_info.class_grade) {//有没有年级信息
    //   this.u_info.class_grade = '请选择年级'
    //   this.u_info.class_name = '请选择班级'
    // } else {
    //   this.u_info.class_grade = this.u_info.class_grade + '年级'
    // }
    this.setData({
      isteacher: e.detail.value,
      isworkers: this.isworkers,
      u_info: this.u_info
    })
  },

  // 监听是否为班主任
  switchChange2: function(e) {
    console.log(e.detail.value)
    if (e.detail.value) { //是
      this.u_info.whether = 1;
    } else { //不是
      this.u_info.whether = 0;
    }
  },


  // 年级选择
  gradeChange: function(e) {
    let that = this;

    // console.log(that.grade_array[e.detail.value])
    that.u_info.grade_id = that.data.grades[e.detail.value].id
    // that.u_info.class_name = '请选择班级'
    that.setData({
      u_info: that.u_info,
      select_grade:e.detail.value
    })
    that.getClassList(e.detail.value);
    console.log(e.detail.value)
    // console.log(that.grade_array)
    // 获取班级列表
    // that.getClassList(that.grade_array[e.detail.value][0]);
    // that.getClassList(that.grade_array[e.detail.value].replace(/[年级]/g, ''));

  },
  

  // 班级选择
  classChange: function(e) {
    console.log('班级选择')
    this.data.userInfo.class_id = this.data.classes[e.detail.value].id
    this.setData({
      select_class: e.detail.value,
      userInfo:this.data.userInfo
      // u_info: this.u_info
    })
  },
  // 人脸图片上传校验
  UploadCheck: function(e) {
    let that = this;
    let type_ = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // "original"原图，"compressed"压缩图，默认二者都有
      sourceType: ['camera'], // "album"从相册选图，"camera"使用相机，默认二者都有
      success: function(res) {
        wx.showToast({
          title: '头像上传中',
          icon: 'loading',
          duration: 10000
        })
        wx.uploadFile({
          url: app.globalData.https + '/txUpload', //仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: "file",
          formData: {
            "user": "test"
          },
          success: function(res) {
            console.log('头像上传成功返回')
            console.log(res)
            wx.hideToast();
            let data = JSON.parse(res.data)
            if (data.sucesss) {
              if (type_ == 1) {
                that.u_info.user_head1 = data.sucesss
              } else {
                that.u_info.user_head2 = data.sucesss
              }
              that.setData({
                u_info: that.u_info
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: data.error,
                showCancel: false,
                success: function(res) {}
              })
            }
          }, fail: function (err) {
            console.log('头像上传失败返回')
            console.log(err)
          }
        })
      }
    })
  },
  // 获取年级列表
  // getGradeList: function() {
  //   let that = this;
  //   wx.request({
  //     url: app.globalData.https + '/class/select_grade',
  //     method: 'get',
  //     success: function(res) {
  //       console.log('年级列表')
  //       console.log(res)
  //       if (res.data.data) {
  //         let grade_list = [];
  //         for (let i = 0; i < res.data.data.length; i++) {
  //           grade_list[i] = res.data.data[i].class_grade + "年级"
  //         }
  //         that.grade_array = grade_list;
  //         that.setData({
  //           grade_array: grade_list
  //         })
  //       }
  //     }
  //   });
  // },

  // 根据年级获取班级列表
  getClassList: function (num) {
    console.log(num)
    let that = this;
    wx.request({
      url: app.globalData.host + '/classes?page=1&&limit=1000&&grade_id='+that.data.grades[num].id,
      method: 'get',
      success: function(res) {
        console.log(res)
        // app.globalData.userInfo = u_info;
        if (res.statusCode==200) {
          console.log(res.data.data.data)
          that.setData({
            classes: res.data.data.data
          })
        }
      }
    });
  },

  //老师提交审核
  Submission: function(e) {

console.log("SUBmittison")
console.log(this.u_info)
    console.log('formID:' + e.detail.formId)
    let that = this;
    user_info = this.u_info;
    if (!user_info.user_name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'loading',
        duration: 1000
      })
    } else if (!user_info.user_iphone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'loading',
        duration: 1000
      })
    } 
    else if (!user_info.user_card) {
      wx.showToast({
        title: '请输入身份证',
        icon: 'loading',
        duration: 1000
      })
    } else if (!user_info.user_address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'loading',
        duration: 1000
      })
    } else if (!user_info.work_number) {
      wx.showToast({
        title: '请输入工号',
        icon: 'loading',
        duration: 1000
      })
    } else if (user_info.class_grade == "请选择年级" || !user_info.class_grade) {
      wx.showToast({
        title: '请选择年级',
        icon: 'loading',
        duration: 1000
      })
    } else if (user_info.class_name == "请选择班级" || !user_info.class_name) {
      wx.showToast({
        title: '请选择班级',
        icon: 'loading',
        duration: 1000
      })
    } else if (!user_info.subjects) {
      wx.showToast({
        title: '请输入学科',
        icon: 'loading',
        duration: 1000
      })
    } else if (!user_info.user_head1) {
      wx.showToast({
        title: '请上传人像',
        icon: 'loading',
        duration: 1000
      })
    } else {
      console.log('老师提交')
      console.log(user_info)
      console.log('昵称过滤前：' + user_info.user_alias)
      user_info.user_alias = user_info.user_alias.replace(regStr, ""); //过滤emoji表情
      console.log('昵称过滤后：' + user_info.user_alias)
      if (!user_info.whether) {
        user_info.whether = 0;
      }
      user_info.class_grade = user_info.class_grade[0]
      if (!iphone_reg.test(user_info.user_iphone)) {
        wx.showToast({
          title: '手机不正确！',
          icon: 'loading',
          duration: 1000
        })
      } else {
        user_info.form_id = e.detail.formId
        user_info.user_id = Number(user_info.user_id)
        user_info.user_head2 = '1'//弃用头像2
        user_info.user_mail = '1'//弃用邮箱
        user_info.user_openid = app.globalData.opnID
        console.log('提交的信息')
        console.log(user_info)
        if (register_type) { //注册 ----- 先注册用户再提交老师注册
          that.ordinaryRegister(function(cb) {
            if (cb) {
              that.teacherRegister();
            } else {
              wx.showToast({
                title: '提交失败！',
                icon: 'loading',
                duration: 1000
              })
            }
          })
        } else { //修改信息 ----- 先修改用户再修改老师
          if (user_info.teacher == 1) {
            that.ordinaryModify(function(cb) {
              if (cb) {
                that.teacherModify();
              } else {
                wx.showToast({
                  title: '提交失败！',
                  icon: 'loading',
                  duration: 1000
                })
              }
            })
          } else { //用户转老师注册
            that.ordinaryModify(function(cb) {
              if (cb) {
                that.teacherRegister();
              } else {
                wx.showToast({
                  title: '提交失败！',
                  icon: 'loading',
                  duration: 1000
                })
              }
            })
          }
        }
      }
    }
  },
  //职工提交审核
  Submission2: function(e) {
    console.log("SUBmittiso2n")
    console.log('formID:' + e.detail.formId)
    
    let that = this;
    let info = that.data.userInfo;
    console.log(info)
    if (!info.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!info.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!info.id_card) {
      wx.showToast({
        title: '请输入身份证',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!info.address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'loading',
        duration: 1000
      })
      return;
    }  else {
      // console.log('职工提交')
      // console.log(user_info)
      // console.log('昵称过滤前：' + user_info.user_alias)
      // user_info.user_alias = user_info.user_alias.replace(regStr, ""); //过滤emoji表情
      // console.log('昵称过滤后：' + user_info.user_alias)

      if (!iphone_reg.test(info.phone)) {
        wx.showToast({
          title: '手机不正确！',
          icon: 'loading',
          duration: 1000
        })
      } else {
        if(that.data.isworkers&&that.data.select_school==null){
          wx.showToast({
            title: '请先选择学校！',
            icon: 'loading',
            duration: 1000
          })
        }
        if(that.data.isworkers&&info.href==null){
          wx.showToast({
            title: '请录入人脸数据！',
            icon: 'loading',
            duration: 1000
          })
        }
        if(that.data.type==1&&info.class_id==0){
          wx.showToast({
            title: '请先选择班级！',
            icon: 'loading',
            duration: 1000
          })
        }
        let data  ={};
        data.token = wx.getStorageSync('token');
        data.school_id = info.school_id?info.school_id:0;
        data.worker = info.worker;
        data.address = info.address;
        data.name = info.name;
        data.phone = info.phone;
        data.id_card = info.id_card;
        data.sex = info.sex;
        data.class_id = info.class_id?info.class_id:0;
        data.href = info.href;
        wx.request({
          url: app.globalData.host+'/user/info',
          data:data,
          method:'POST',
          success:(res)=>{
            console.log(res)
          }
        })
        console.log(data)
      }
    }
  },
  // 用户注册
  Submission1: function() {
    let that = this;
    user_info = this.u_info;
    if (!user_info.user_name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'loading',
        duration: 1000
      })
      return;
    } 
    // else if (!user_info.user_iphone) {
    //   wx.showToast({
    //     title: '请输入手机号',
    //     icon: 'loading',
    //     duration: 1000
    //   })
    //   return;
    // } 
    // else if (!user_info.user_card) {
    //   wx.showToast({
    //     title: '请输入身份证',
    //     icon: 'loading',
    //     duration: 1000
    //   })
    //   return;
    // }
     else if (!user_info.user_address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else {
      console.log('普通用户或教职工提交')
      if (user_info.user_iphone&&!iphone_reg.test(user_info.user_iphone)) {
        wx.showToast({
          title: '手机不正确！',
          icon: 'loading',
          duration: 1000
        })
      } else {
        console.log('过滤前：' + user_info.user_alias)
        user_info.user_alias = user_info.user_alias.replace(regStr, ""); //过滤emoji表情
        console.log('过滤后：' + user_info.user_alias)

        user_info.user_id = Number(user_info.user_id)
        user_info.user_openid = app.globalData.opnID

        user_info.user_images1 = user_info.user_head1;
        // user_info.user_images2 = user_info.user_head2;
        user_info.user_images2 = '1';//弃用头像2
        user_info.user_mail = '1'//弃用邮箱
        user_info.date1 = user_info.department;
        user_info.positions = user_info.positions;

        console.log('提交的信息')
        console.log(user_info)
        if (register_type) { //注册信息
          that.ordinaryRegister(function(cb) {
            if (cb) {
              app.getUserinfo(function(cbType) {
                if (cbType) {
                  wx.showToast({
                    title: '注册成功！',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(function() {
                    wx.navigateBack({})
                  }, 1500)
                }
              })
            } else {
              wx.showToast({
                title: '注册失败！',
                icon: 'loading',
                duration: 1000
              })
            }
          })
        } else { //修改信息
          that.ordinaryModify(function(cb) { //普通用户修改信息
            if (cb) {
              if (that.isworkers) { //修改教职工信息
                that.staffModify(function (cb) {
                  app.getUserinfo(function (cbType) {//获取最新的内容
                    if (cbType) {
                      wx.showToast({
                        title: '修改成功！',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(function () {
                        wx.navigateBack({})
                      }, 1500)
                    }
                  })
                });
              }else{
                app.getUserinfo(function (cbType) {//获取最新的内容
                  if (cbType) {
                    wx.showToast({
                      title: '修改成功！',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      wx.navigateBack({})
                    }, 1500)
                  }
                })
              }
            } else {
              wx.showToast({
                title: '修改失败！',
                icon: 'loading',
                duration: 1000
              })
            }
          })
        }
      }
    }
  },

  // 老师注册
  teacherRegister: function() {
    console.log(user_info)
    let that = this;
    wx.request({
      url: app.globalData.https + '/user/insert_teacher_apply',
      data: user_info,
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log('老师注册返回')
        console.log(res)
        if (res.data.sucesss) {
          app.getUserinfo(function(cbType) {
            if (cbType) {
              wx.showToast({
                title: '提交成功！',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function() {
                wx.navigateBack({})
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.data.error,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    });
  },
  // 老师修改
  teacherModify: function() {
    let that = this;
    wx.request({
      url: app.globalData.https + '/user/update_teacher_apply',
      data: user_info,
      method: 'put',
      success: function(res) {
        console.log('老师修改返回')
        console.log(res)
        if (res.data.sucesss) {
          app.getUserinfo(function(cbType) {
            if (cbType) {
              wx.showToast({
                title: '提交成功！',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function() {
                wx.navigateBack({})
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.data.error,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    });
  },
  // 普通注册
  ordinaryRegister: function(cb) {
    console.log(JSON.stringify(user_info))
    let that = this;
    wx.request({
      url: app.globalData.https + '/user/insert_user',
      data: user_info,
      method: 'post',
      success: function(res) {
        console.log('普通注册返回')
        console.log(res)
        if (res.data.sucesss) {
          typeof cb == "function" && cb(true)
        } else {
          typeof cb == "function" && cb(false)
        }
      }
    });
  },
  // 普通修改
  ordinaryModify: function(cb) {
    let that = this;
    wx.request({
      url: app.globalData.https + '/user/update_user',
      data: user_info,
      method: 'put',
      success: function(res) {
        console.log('普通修改返回')
        console.log(res)
        if (res.data.sucesss) {
          typeof cb == "function" && cb(true)
        } else {
          typeof cb == "function" && cb(false)
        }
      }
    });
  },
  // 职工注册
  staffRegister: function(cb) {
    let that = this;
    wx.request({
      url: app.globalData.https + '/staff/insert_staff',
      data: user_info,
      method: 'post',
      success: function(res) {
        console.log('注册教职工返回')
        console.log(res)
        if (res.data.sucesss) {
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            wx.navigateBack({})
          }, 1500)
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.error,
            showCancel: false,
            success: function(res) {}
          })
        }
      }
    });
  },
  // 职工修改
  staffModify: function(cb) {
    let that = this;
    wx.request({
      url: app.globalData.https + '/staff/update_staff',
      data: user_info,
      method: 'put',
      success: function(res) {
        console.log('修改教职工信息返回')
        console.log(res)
        if (res.data.sucesss) {
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 1500)
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.error,
            showCancel: false,
            success: function (res) { }
          })
        }
      }
    });
  },


  // 显示隐藏相机
  cameraDisable: function () {
    this.showCamera = !this.showCamera;
    this.setData({
      showCamera: this.showCamera
    })
  },
  // 拍照
  takePhoto: function (e) {
    console.log('点击拍照')
    let that = this
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'normal',
      success: (res) => {
        console.log(res)
        that.cameraDisable();
        console.log(res.tempImagePath)
        wx.showToast({
          title: '上传中...',
          icon: 'loading',
          duration: 10000
        })
        wx.uploadFile({
          url: app.globalData.apihost + '/upload', 
          filePath: res.tempImagePath,
          name: "file",
          success: function(res1) {
            console.log('头像上传成功返回')
            console.log(res1)
            wx.hideToast();
            
            console.log(res1)
            console.log(res1.data)
            let data = JSON.parse(res1.data)
            
            if (res1.statusCode==200) {
              that.data.userInfo.href = data.data
              that.setData({
                userInfo:that.data.userInfo
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: data.msg,
                showCancel: false,
                success: function(res) {}
              })
            }
          }, fail: function (err) {
            console.log('头像上传失败返回')
            console.log(err)
          }
        })
      }, fail: (err) => {
        console.log('拍照错误')
        console.log(err)
        app.showNone('拍照错误')
      }, complete: (data) => {
        console.log('拍照返回')
        console.log(data)
      }
    })
  },

  // 照相机停止运行
  cameraStop: function (e) {
    console.log('相机停止运行')
    console.log(e)
    this.cameraDisable();
    app.showNone('相机停止运行')
  },
  // 照相机没授权
  cameraError: function (e) {
    console.log(e)
    // app.showTip('相机错误')
    this.cameraDisable();//隐藏相机
    this.display();//显示授权设置弹窗
  },
  // 切换闪光灯状态
  flashChange: function () {
    switch (this.cameraConfig.flash) {
      case 'off': this.cameraConfig.flash = 'on'; break;
      case 'on': this.cameraConfig.flash = 'auto'; break;
      case 'auto': this.cameraConfig.flash = 'off'; break;
    }
    this.setData({
      cameraConfig: this.cameraConfig
    })
  },
  // 切换前后置摄像头
  positionChange: function () {
    switch (this.cameraConfig.position) {
      case 'front': this.cameraConfig.position = 'back'; break;
      case 'back': this.cameraConfig.position = 'front'; break;
    }
    this.setData({
      cameraConfig: this.cameraConfig
    })
  }
})