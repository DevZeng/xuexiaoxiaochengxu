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
    select_school:null,
    select_worker:null,
    school_id:null,
    schools:null,
    workers:null,
    worker_id:null,
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
    this.getSchoolsList();
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
    wx.request({
      url: app.globalData.host+'/visitor',
      data:{
        'token':wx.getStorageSync('token')
      },
      method:"GET",
      success:(res)=>{
        console.log(res)
        if(res.statusCode==200){
          this.setData({
            worker:res.data.data.worker,
            school:res.data.data.school,
            details:res.data.data
          })
        }
      }
    })
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
  bindSchoolChange:function(e){
    let that = this;
    let school_id = this.data.schools[e.detail.value].id
    this.data.details.school_id = this.data.schools[e.detail.value].id
    this.setData({
      school_id:this.data.schools[e.detail.value].id,
      select_school:e.detail.value,
      details:this.data.details
      // u_info: this.u_info
    })
    this.getworkersList(school_id);
  },
  getworkersList:function(school_id){
    wx.request({
      url: app.globalData.host+'/workers?page=1&&limit=1000&&school_id='+school_id,
      method:'GET',
      success:(res)=>{
        if(res.statusCode==200){
          this.setData({
            workers:res.data.data.data
          })
        }
      }
    })
  },
  bindWorkerChange:function(e){
    let that = this;
    this.data.details.worker_id = this.data.workers[e.detail.value].id
    this.setData({
      select_worker:e.detail.value,
      worker_id:this.data.workers[e.detail.value].id,
      details:this.data.details
    })
    // this.getworkersList(school_id);
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
    this.data.details.name = e.detail.value;
  },
  // 电话输出
  iphoneInput: function (e) {
    this.data.details.phone = e.detail.value;
  },
  // 对接人输出
  visitnameInput: function(e) {
    visitor_butt = e.detail.value;
    this.details.visitor_butt = e.detail.value;
  },
  // 到访理由输出
  reasonInput: function(e) {
    this.data.details.reason = e.detail.value;
  },
  // 提交审核
  submission: function (e) {
    console.log('formID:' + e.detail.formId)
    let details = this.data.details;
    console.log(details)
    if(!details.name){
      wx.showToast({
        title: '请输入姓名！',
        icon: 'loading',
        duration: 1000
      })
      return ;
    }
    if(!details.phone){
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'loading',
        duration: 1000
      })
      return ;
    }
    if(!details.reason){
      wx.showToast({
        title: '请输入访客理由！',
        icon: 'loading',
        duration: 1000
      })
      return ;
    }
    if(!details.worker_id){
      wx.showToast({
        title: '请选择拜访人！',
        icon: 'loading',
        duration: 1000
      })
      return ;
    }
    wx.request({
      url: app.globalData.host + '/visitor',
      data: {
        form_id: e.detail.formId,
        token: wx.getStorageSync('token'),
        name: details.name,
        phone: details.phone,
        reason: details.reson,
        worker_id: details.worker_id,
        school_id:details.school_id,
        href:details.href
      },
      // header: {
      //   "content-type": "application/x-www-form-urlencoded"
      // },
      method: 'post',
      success: function (res) {
        console.log('申请访客返回')
        console.log(res)
        if (res.statusCode==200) {
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
              that.data.details.href = data.data
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