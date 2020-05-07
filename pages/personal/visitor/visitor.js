const app = getApp();
let user_name,
  user_iphone,
  visitor_butt,
  visitor_head1,
  visitor_reason;
Page({
  data: {
    details: {},
    mask_disable: false,
    showCamera: false,
    cameraConfig: {
      flash: 'off',
      position: 'front'
    },
    schools:[{"id":39,"name":"panyuschool","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"a","out_group":"b","mode":1,"created_at":"2020-05-04 08:58:54","updated_at":"2020-05-04 08:58:54"},{"id":38,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:57:33","updated_at":"2020-05-04 08:57:33"},{"id":37,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:57:17","updated_at":"2020-05-04 08:57:17"},{"id":36,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:56:28","updated_at":"2020-05-04 08:56:28"},{"id":35,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:55:59","updated_at":"2020-05-04 08:55:59"},{"id":34,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:54:23","updated_at":"2020-05-04 08:54:23"},{"id":33,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:53:27","updated_at":"2020-05-04 08:53:27"},{"id":32,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:51:25","updated_at":"2020-05-04 08:51:25"},{"id":31,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:47:47","updated_at":"2020-05-04 08:47:47"},{"id":30,"name":"\u5965\u56ed","contact":null,"address":"\u5965\u56ed\u5e7f\u573a","in_group":"aa","out_group":"ss","mode":1,"created_at":"2020-05-04 08:44:31","updated_at":"2020-05-04 08:44:31"}]
  },
  onLoad: function(options) {
    this.details = {}
    this.mask_disable = false;
    this.showCamera = false //是否显示照相机
    this.cameraConfig = { //照相机参数配置
      flash: 'off',
      position: 'front'
    }
    let that = this
    // 获取访客信息
    this.getRecord();
  },
  onShow: function() {

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
  // 获取我的申请记录
  getRecord: function() {
    let that = this;
    app.getVisitor(function (data) {
      if (data) {
        console.log('返回')
        let info = JSON.parse(JSON.stringify(data));
        if (info.vistior_status == 0 || info.vistior_status == 1) { //申请中或申请成功
          console.log(info.visitor_time)
          that.details = info
          that.setData({
            details: info
          })
        }else{
          if (info.vistior_status){
            that.details.vistior_status = info.vistior_status
            that.setData({
              details: that.details
            })
          }
        }
      }
    })
  },
  // 人脸图片上传校验
  UploadCheck: function(e) {
    let that = this
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
            wx.hideToast();
            console.log(res)
            let data = JSON.parse(res.data)
            if (data.sucesss) {
              visitor_head1 = data.sucesss
              that.details.visitor_head1 = data.sucesss
              that.setData({
                details: that.details
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: data.error,
                showCancel: false,
                success: function(res) {}
              })
              console.log(data)
            }

          }
        })
      }
    })
  },
  // 姓名输出
  nameInput: function (e) {
    user_name = e.detail.value;
    this.details.user_name = e.detail.value;
  },
  // 电话输出
  iphoneInput: function (e) {
    user_iphone = e.detail.value;
    this.details.user_iphone = e.detail.value;
  },
  // 对接人输出
  visitnameInput: function(e) {
    visitor_butt = e.detail.value;
    this.details.visitor_butt = e.detail.value;
  },
  // 到访理由输出
  reasonInput: function(e) {
    visitor_reason = e.detail.value;
    this.details.visitor_reason = e.detail.value;
  },
  // 提交审核
  submission: function (e) {

    console.log('formID:' + e.detail.formId)

    let that = this;
    if (!user_name) {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!user_iphone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!visitor_butt) {
      wx.showToast({
        title: '请填写拜访人姓名',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!visitor_head1) {
      wx.showToast({
        title: '请上传人脸头像',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!visitor_reason) {
      wx.showToast({
        title: '请填写访客理由',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else{
      wx.request({
        url: app.globalData.https + '/visitor/insert_vistor',
        data: {
          form_id: e.detail.formId,
          user_openid: app.globalData.opnID,
          user_name: user_name,
          user_iphone: user_iphone,
          visitor_butt: visitor_butt,
          visitor_head1: visitor_head1,
          visitor_reason: visitor_reason
        },
        // header: {
        //   "content-type": "application/x-www-form-urlencoded"
        // },
        method: 'post',
        success: function (res) {
          console.log('申请访客返回')
          console.log(res)
          if (res.data.sucesss) {
            wx.showToast({
              title: '提交成功！',
              icon: 'success',
              duration: 1000
            })
            that.getRecord();
            setTimeout(function () {
              wx.navigateBack({})
            }, 1500)
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
              visitor_head1 = data.sucesss
              that.details.visitor_head1 = data.sucesss
              that.setData({
                details: that.details
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