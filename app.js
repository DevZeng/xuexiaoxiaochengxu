//app.js

let num = 5;
App({
  onShow:function(){
    this.getConfig();
  },
  onLaunch: function() {
    let that = this;
    that.getUserinfo();
    
    // that.getConfig();
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    };
    
    // that.checkNotify();
    setInterval(function() {
      console.log('两个小时登录一次')
      // that.getopenID();
    }, 2 * 60 * 60 * 1000) //两个小时登录一次
    // console.log(that.globalData.userInfo)
  },

  // -------------------------------------------------------------------------数据获取----------------------------------------------------------
  // 获取openID
  getopenID: function (cb) {
    let app = this;
    wx.login({
      success: res => {
        console.log(res.code)
        // return true;
        wx.request({
          url: app.globalData.https + '/login/wx_login?js_code=' + res.code,
          method: 'POST',
          success: function(res) {
            console.log(res)
            app.globalData.opnID = res.data.awen;
            console.log('这是openID---' + app.globalData.opnID)
            app.getUserinfo();
            typeof cb == "function" && cb(app.globalData.opnID)
          }
        });
      }
    })
  },
  checkNotify:function(cb){
    let app = this;
    console.log('CheckNotify');
    console.log(app.globalData.userInfo)
  },
  getConfig:function(cb){
    let app = this;
    console.log('getXConfig');
    wx.request({
      url: 'https://gong.fengniaotuangou.cn/api/user/config?school=all&version=889',
      method:'GET',
      success:function(res){
        console.log(res.data.data);
        let data = res.data.data;
        if(data.key=='open'){
          app.globalData.openFace = data.value==1?true:false;
          wx.setStorage({
            data: data.value==1?true:false,
            key: 'openFace',
            complete: (res) => {
              
            },
            fail: (res) => {},
            success: (res) => {
              console.log('setStorageSuccess')
            },
          })
          console.log("app.globalData.openFace"+app.globalData.openFace);
        }else{
          wx.setStorage({
            data: false,
            key: 'openFace',
          })
        }
      },fail:function(){
        console.log('request fail')
        wx.setStorage({
          data: false,
          key: 'openFace',
        })
      }
    })
  },
  // 从后台获取普通用户信息(先判别有没有openID)
  getUserinfo: function(cb) {
    let app = this;
    let token = wx.getStorageSync('token');
    
    if (token){
      wx.request({
        url: app.globalData.host+'/user/info?token='+token,
        method:'GET',
        success:(res)=>{
          app.globalData.userInfo = res.data.data;
        }
      })
    }
  },
  // 从后台获取普通用户信息
  getinfo: function (cb) {
    let app = this,
      num = 0;
    wx.request({
      url: app.globalData.https + '/user/select_user',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'GET',
      success: function (res) {
        console.log('普通用户获取用户信息返回')
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.result) {
            app.globalData.userInfo = res.data.result;
            let open_id = res.data.result.user_openid;
            if(res.data.result.notify===0){
              
              wx.showModal({
                cancelColor: 'cancelColor',
                title:'是否接收订阅消息？',
                success(res){
                  if(res.confirm){
                    let link = '/pages/showh5/showh5?link=https://xiao.fengniaotuangou.cn&state=empty&school=all&user_id='+open_id
                    console.log(link)
                    wx.navigateTo({
                      url: link
                    })
                  }
                }
              })
              // webb
              // wx.showModal({
              //   cancelColor: 'cancelColor',
              //   title:'是否接收订阅消息？',
              //   success(res){
              //     if(res.confirm){
              //       wx.requestSubscribeMessage({
              //         tmplIds: [
              //           'cMY51hC1INFQqnZBSMAOGivVU5ZyPrh6nFKbbFqhsLI'
              //         ],
              //         success:(res)=>{
              //           console.log(res)
              //           if(res['cMY51hC1INFQqnZBSMAOGivVU5ZyPrh6nFKbbFqhsLI']==='accept'){
              //             console.log('setNotify')
              //             wx.request({
              //               url: 'https://gong.fengniaotuangou.cn/api/notify',
              //               data: {
              //                 open_id: open_id
              //               },
              //               method: 'GET',
              //             })
              //           }
              //         }
              //       })
              //     }
              //   }
              // })
            }
            // app.globalData.user_openid = res.data.result.user_openid
            app.getMemberTime();
            if (app.globalData.userInfo.teacher == 1) { //有教师资料
              num++;
              //获取老师信息
              wx.request({
                url: app.globalData.https + '/user/select_teacher_apply',
                data: {
                  user_openid: app.globalData.opnID
                },
                method: 'GET',
                success: function (ret) {
                  console.log('教师用户获取用户信息返回')
                  console.log(ret)
                  if (ret.statusCode == 200) {

                    if (ret.data.result) {
                      app.globalData.userInfo.teacher = 1
                      app.globalData.userInfo.user_word = ret.data.result.user_word
                      app.globalData.userInfo.whether = ret.data.result.whether
                      app.globalData.userInfo.class_grade = ret.data.result.class_grade
                      app.globalData.userInfo.class_name = ret.data.result.class_name
                      app.globalData.userInfo.work_number = ret.data.result.work_number
                      app.globalData.userInfo.subjects = ret.data.result.subjects
                      app.globalData.userInfo.status = ret.data.result.status
                      app.globalData.userInfo.class_id = ret.data.result.class_id
                      app.globalData.userInfo.user_head1 = ret.data.result.user_head1
                      app.globalData.userInfo.user_head2 = ret.data.result.user_head2
                    }
                  }
                  num--;
                  if (num == 0) {
                    typeof cb == "function" && cb(app.globalData.userInfo)
                  }
                }
              });
            }
            if (app.globalData.userInfo.staff_status == 0 || app.globalData.userInfo.staff_status == 1 || app.globalData.userInfo.staff_status == 2) { //有职工资料
              num++;
              // 获取职工信息
              wx.request({
                url: app.globalData.https + '/staff/select_staff',
                data: {
                  user_openid: app.globalData.opnID
                },
                method: 'get',
                success: function (ret) {
                  console.log('获取教职工信息返回')
                  console.log(ret)
                  if (res.data.result) {
                    app.globalData.userInfo.staff_Status = app.globalData.userInfo.staff_status
                    app.globalData.userInfo.staff_id = ret.data.result.staff_id
                    app.globalData.userInfo.user_head1 = ret.data.result.user_images1
                    app.globalData.userInfo.user_head2 = ret.data.result.user_images2
                    app.globalData.userInfo.department = ret.data.result.date1
                    app.globalData.userInfo.positions = ret.data.result.positions
                  }
                  num--;
                  if (num == 0) {
                    typeof cb == "function" && cb(app.globalData.userInfo)
                  }
                }
              });
            }
            if (app.globalData.userInfo.teacher == 0 && app.globalData.userInfo.staff_status == 3) {
              //获取教职工信息
              // app.getStaff();
              // 获取访客信息
              app.getVisitor();
              typeof cb == "function" && cb(app.globalData.userInfo)

            }
          }
        }
      }
    });
  },
  // 获取教职工信息
  getStaff: function(cb) {
    let app = this;
    console.log(app.globalData.opnID)
    wx.request({
      url: app.globalData.https + '/staff/select_staff',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function(res) {
        console.log('获取教职工信息返回')
        console.log(res)
        if (res.data.result) {
          app.globalData.staffInfo = res.data.result;
          typeof cb == "function" && cb(res.data.result)
        } else {
          app.globalData.staffInfo = null;
          typeof cb == "function" && cb(false)
        }
      }
    });
  },
  // 获取访客信息
  getVisitor: function(cb) {
    let app = this;
    wx.request({
      url: app.globalData.https + '/visitor/select_u_visitor',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function(res) {
        console.log('我的访客申请记录')
        console.log(res)
        if (res.data.data.length > 0) {
          app.globalData.visitorInfo = res.data.data[0];
          typeof cb == "function" && cb(res.data.data[0])
        } else {
          app.globalData.visitorInfo = null;
          typeof cb == "function" && cb(false)
        }
      }
    });
  }, // 获取会员信息
  getMemberTime: function(cb) {
    let app = this;
    wx.request({
      url: app.globalData.https + '/member/select_member',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function(res) {
        console.log('获取会员信息返回')
        console.log(res)
        if (res.data.result) {
          app.globalData.memberInfo = res.data.result;
          typeof cb == "function" && cb(res.data.result)
        } else {
          app.globalData.memberInfo = null;
          typeof cb == "function" && cb(false)
        }
      }
    });
  },

  // -------------------------------------------------------------------------数据扩展----------------------------------------------------------
  // 获取当前日期和时间
  getTime: function() {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    return (year + "-" + month + "-" + date + ' ' + hours + ":" + minutes + ":" + seconds); //例：2018-12-5 12：00：00
  },
  // 获取当前日期
  getDate: function() {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    return (year + "-" + month + "-" + date); //例：2018-12-5
  },
  // 转换日期格式
  conversionDate: function(num) {
    let time = new Date(num * 1000);
    let month = time.getMonth() + 1;
    let date = time.getDate();
    // return month + "-" + date
    return (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
  },
  // 转换时间格式
  conversionTime: function(num) {
    let time = new Date(num * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let h = time.getHours();
    let m = time.getMinutes();
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
  },
  // 判断登录状态（就是判断有没有个人信息）
  getLogintype: function(cb) {
    let user_info = this.globalData.userInfo;
    if (!user_info) {
      wx.showToast({
        title: '请登录',
        icon: 'loading',
        duration: 1000
      })
      typeof cb == "function" && cb(false)
    } else {
      typeof cb == "function" && cb(user_info)
    }
  },
  // 提交保存formID
  submitFormID: function (formId) {
    let app = this;
    console.log('传过来的' + formId)
    wx.request({
      url: app.globalData.https + '/form/inser_FormID',
      method: 'post',
      data:{
        user_openid: app.globalData.opnID,
        form_id: formId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('保存formID返回')
        console.log(res)
      }
    });
  },
  
  // -------------------------------------------------------------------------信息保存----------------------------------------------------------
  // 信息
  globalData: {
    userInfo: null, //用户信息
    memberInfo: null, //会员信息
    staffInfo: null, //教职工信息
    visitorInfo: null, //访客信息
    opnID: null, //用户openID
    openFace:false,
    token:null,
    https: 'https://huan.fengniaotuangou.cn', //线上接口地址
    // https: 'http://192.168.1.105:8082',//本地接口地址
    https1: 'https://huan.fengniaotuangou.cn', //总控线上接口地址
    // https1: 'http://192.168.1.105:8085',//总控本地接口地址
    mapKey: '33UBZ-ICQKP-W6FDW-V54Q6-OY542-IZFJ4', //腾讯地图位置服务key
    host: 'https://school.fengniaotuangou.cn/api',
    apihost: 'https://api.fengniaotuangou.cn/api',
  }
})