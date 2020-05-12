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
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // "original"原图，"compressed"压缩图，默认二者都有
      sourceType: ['album', 'camera'], // "album"从相册选图，"camera"使用相机，默认二者都有
      success: function(res) {
        console.log(res)
        wx.uploadFile({
          url: app.globalData.apihost + '/upload', 
          filePath: res.tempFilePaths[0],
          name: "file",
          success: function(res1) {
            console.log('头像上传成功返回')
            console.log(res1)
            wx.hideToast();
            
            console.log(res1)
            console.log(res1.data)
            let data = JSON.parse(res1.data)
            
            if (res1.statusCode==200) {
              that.data.info.cover = data.data
              that.setData({
                info:that.data.info
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
      }
    })
  },
  // 人脸图片上传校验
  UploadCheck: function(e) {
    this.setData({
      showCamera: true
    })
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
      duration: 100
    })
    console.log(stu_number)
    let that = this;
     // 获取学生信息
    wx.request({
      url: app.globalData.host + '/student?number='+stu_number+'&token='+wx.getStorageSync('token'),
      method: 'get',
      success: function(res) {
        console.log(res)
        if (res.statusCode==200) {
          that.info = res.data.data
          that.setData({
            info: res.data.data
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
  submit: function(e) {
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    let that = this;
    console.log(relation)
    let data = that.data.info;
    if(!data.number){
      wx.showToast({
        title: '学号不正确',
        icon: 'loading',
        duration: 100
      })
    }
    wx.request({
      url: app.globalData.host+'/child',
      method:"POST",
      data:{
        token:wx.getStorageSync('token'),
        number:data.number,
        remark: relation,
        cover:data.cover,
        face_image:data.face_image
      },
      success:(res)=>{
        console.log(res)
        wx.hideToast({})
        if(res.statusCode==200){
          that.data.info.state = 2;
          this.setData({
            info :that.data.info
          })
        }
       
      }
    })
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
          url: app.globalData.apihost + '/upload/face', 
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
              that.data.info.face_image = data.data
              that.setData({
                info:that.data.info,
                showCamera:false
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