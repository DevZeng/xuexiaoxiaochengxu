const app = getApp();
let num, relation = '';
Page({
  data: {
    showFace:false,
    info: [],
    open_type: 3, // 0:添加默认家长 1：编辑孩子信息（默认家长） 2：添加绑定孩子 3：不能进行任何操作（审核中） 4：不能进行任何操作（普通监护人）
    mask_disable: false,//授权弹窗
    showCamera: false,
    cameraConfig: {
      flash: 'off',
      position: 'front'
    }
  },
  onLoad: function(options) {
    this.mask_disable = false;
    this.showCamera = false //是否显示照相机
    this.cameraConfig = { //照相机参数配置
      flash: 'off',
      position: 'front'
    }
    this.setData({
     
      showFace :wx.getStorageSync('openFace')
      // showFace = app.globalData.openFace
    })
    console.log(options.stu_number)
    this.search(options.stu_number);
  },
  onShow: function() {

  },

  // 跳转门禁卡设置
  toEntranceCard: function (e) {
    let that = this
    wx.navigateTo({
      url: '/pages/personal/entrance-card/edit/edit?details=' + JSON.stringify(that.info)
    })
  },
  // 显示隐藏设置授权弹窗
  display: function () {
    this.mask_disable = !this.mask_disable;
    this.setData({
      mask_disable: this.mask_disable
    })
    console.log(this.mask_disable)
  },
  // 授权返回
  authorization: function (e) {
    this.display()
  },
  // 上传图片
  upload: function(e) {
    let that = this;
    if (that.open_type == 0 || that.open_type == 1) { //只有添加默认家长和编辑孩子信息是才能更改图片
      wx.chooseImage({
        count: 1, //最多可以选择的图片总数  
        sizeType: ['compressed'], // "original"原图，"compressed"压缩图，默认二者都有
        sourceType: ['album', 'camera'], // "album"从相册选图，"camera"使用相机，默认二者都有
        success: function(res) {
          wx.showToast({
            title: '头像上传中',
            icon: 'loading',
            duration: 10000
          })
          wx.uploadFile({
            url: app.globalData.https + '/txUpload_t', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: "file",
            formData: {
              "user": "test"
            },
            success: function(res) {
              wx.hideToast();
              that.info.stu_head = JSON.parse(res.data).sucesss
              that.setData({
                info: that.info
              })
              console.log(that.info.stu_head)
            }
          })
        }
      })
    }
  },
  // 人脸图片上传校验
  UploadCheck: function(e) {
    let that = this,
      type_ = e.currentTarget.dataset.type;
    if (that.open_type == 0 || that.open_type == 1) { //只有添加默认家长和编辑孩子信息是才能更改图片
      that.cameraDisable();
    }
  },
  // 学号输出
  numInput: function(e) {
    num = e.detail.value;
  },
  // 备注输入
  relationInput: function (e) {
    relation = e.detail.value;
  },
  toSearch: function() {
    if (num) {
      this.search(num);
    }
  },
  // 搜索学生信息
  search: function(stu_number) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    console.log(stu_number)
    let that = this;
     // 获取学生信息
    wx.request({
      url: app.globalData.https + '/class_m/select_message',
      data: {
        stu_number: stu_number
      },
      method: 'get',
      success: function(res) {
        console.log(res)
        if (res.data.result) {
          if (res.data.result.stu_head) { //有默认家长（有图片肯定有默认家长）

            // 获取孩子的家庭成员
            wx.request({
              url: app.globalData.https + '/parent/select_parent',
              data: {
                stu_number: stu_number
              },
              method: 'get',
              success: function (res) {
                console.log('家庭成员列表返回')
                console.log(res)
                if (res.data.data) {
                  let family_list = res.data.data,
                    parentState = false;
                  for (let i = 0; i < family_list.length; i++) {
                    console.log(family_list[i].user_openid)
                    console.log(app.globalData.userInfo.user_openid)
                    if (family_list[i].user_openid == app.globalData.userInfo.user_openid) {//孩子和我是有关系的，具体是什么关系让我们一探究竟吧
                      parentState = true;
                      if (family_list[i].parent_status == 0) { //0审核中，什么也干不了
                        console.log('审核中')
                        that.open_type = 3;
                      } else if (family_list[i].parent_status == 1) { //1审核通过，我是家长（牛逼）
                        if (family_list[i].user_status == 0) {//0普通家庭成员，也是什么也干不了（苦逼）
                          console.log('审核已通过（普通监护人）')
                          that.open_type = 4;
                        } else {//1默认家长（加粗、放大）
                          console.log('审核已通过（默认家长）')
                          that.open_type = 1;
                        }
                      } else { //2审核不通过，苦逼，只能重新提交审核
                        console.log('审核不通过')
                        that.open_type = 2;
                      }
                      break;
                    }
                  }
                  if (!parentState) { //我和孩子没关系，但为了早日为所欲为，只能添加绑定家长了
                    console.log('我和学生没有绑定任何关系')
                    that.open_type = 2;
                  }
                  wx.hideToast({})
                  that.setData({
                    open_type: that.open_type
                  })
                }
              }
            });

          } else { //无默认家长，那就去添加绑定默认家长吧
            console.log('该学生没有绑定监护人')
            wx.hideToast({})
            that.open_type = 0;
            that.setData({
              open_type: that.open_type
            })
          }
          that.info = res.data.result
          that.setData({
            info: res.data.result
          })
        } else {
          wx.showToast({
            title: '学号不正确',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    });
  },
  // 提交审核
  submission: function(e) {
    console.log('formID:' + e.detail.formId)

    let that = this,
      info = this.info;
    if (!info.stu_number) {
      wx.showToast({
        title: '请输入学号',
        icon: 'loading',
        duration: 1000
      })
      return;
    } 
    else{
      if (that.open_type == 0) { //绑定默认家长
        console.log('绑定默认家长')
        wx.request({
          url: app.globalData.https + '/stu/insert_student',
          data: {
            form_id: e.detail.formId,
            user_openid: app.globalData.opnID,
            stu_number: info.stu_number,
            stu_images1: info.stu_images1,
            stu_images2: "1",
            stu_images3: "1",
            stu_head: info.stu_head,
            relation: relation
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            if (res.data.sucesss) {
              wx.showToast({
                title: '提交成功！',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
            } else {
              wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) { } })
              // wx.showToast({
              //   title: res.data.error,
              //   icon: 'loading',
              //   duration: 1000
              // })
            }
          }
        });
      } else if (that.open_type == 1) { //编辑孩子信息
        console.log('编辑孩子信息')
        console.log(info.stu_number)
        console.log(info.stu_images1)
        console.log(info.stu_head)
        console.log(app.globalData.opnID)
        wx.request({
          url: app.globalData.https + '/stu/update_images',
          data: {
            // form_id: e.detail.formId,
            user_openid: app.globalData.opnID,
            stu_number: info.stu_number,
            stu_images1: info.stu_images1,
            stu_images2: '1',
            stu_images3: '1',
            stu_head: info.stu_head
          },
          method: 'put',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res)
            if (res.data.sucesss) {
              wx.showToast({
                title: '保存成功！',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
            } else {
              wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) { } })
            }
          }
        });
      } else { //绑定家庭成员
        console.log('绑定家庭成员')
        console.log(app.globalData.opnID)
        console.log(info.stu_number)
        wx.request({
          url: app.globalData.https + '/parent/insert_parent',
          data: {
            form_id: e.detail.formId,
            user_openid: app.globalData.opnID,
            stu_number: info.stu_number,
            relation: relation
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'post',
          success: function (res) {
            console.log('绑定家庭成员返回')
            console.log(res)
            if (res.data.sucesss) {
              wx.showToast({
                title: '提交成功！',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
            } else {
              wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) { } })
              // wx.showToast({
              //   title: res.data.error,
              //   icon: 'loading',
              //   duration: 1000
              // })
            }
          }
        });
      }
    }
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
          url: app.globalData.https + '/txUpload',
          filePath: res.tempImagePath,
          name: "file",
          formData: {
            "user": "test"
          },
          success: function (res1) {
            console.log('头像上传成功返回')
            console.log(res1)
            wx.hideToast();
            let data = JSON.parse(res1.data)
            if (data.sucesss) {
              that.info.stu_images1 = data.sucesss
              that.setData({
                info: that.info
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: data.error,
                showCancel: false,
                success: function (res) { }
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