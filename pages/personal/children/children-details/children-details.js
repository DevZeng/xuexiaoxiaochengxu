const qiniuUploader = require("../../../../utils/qiniuUploader");

function initQiniu() {
  var options = {
      // bucket所在区域，这里是华北区。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
      region: 'SCN',

      // 获取uptoken方法三选一即可，执行优先级为：uptoken > uptokenURL > uptokenFunc。三选一，剩下两个置空。推荐使用uptokenURL，详情请见 README.md
      // 由其他程序生成七牛云uptoken，然后直接写入uptoken
      uptoken: '',
      // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
      uptokenURL: 'https://api.fengniaotuangou.cn/api/upload/token',
      // uptokenFunc 这个属性的值可以是一个用来生成uptoken的函数，详情请见 README.md
      uptokenFunc: function () { },

      // bucket 外链域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 fileURL 字段。否则需要自己拼接
      domain: 'https://tu.fengniaotuangou.cn',
      // qiniuShouldUseQiniuFileName 如果是 true，则文件的 key 由 qiniu 服务器分配（全局去重）。如果是 false，则文件的 key 使用微信自动生成的 filename。出于初代sdk用户升级后兼容问题的考虑，默认是 false。
      // 微信自动生成的 filename较长，导致fileURL较长。推荐使用{qiniuShouldUseQiniuFileName: true} + "通过fileURL下载文件时，自定义下载名" 的组合方式。
      // 自定义上传key 需要两个条件：1. 此处shouldUseQiniuFileName值为false。 2. 通过修改qiniuUploader.upload方法传入的options参数，可以进行自定义key。（请不要直接在sdk中修改options参数，修改方法请见demo的index.js）
      // 通过fileURL下载文件时，自定义下载名，请参考：七牛云“对象存储 > 产品手册 > 下载资源 > 下载设置 > 自定义资源下载名”（https://developer.qiniu.com/kodo/manual/1659/download-setting）。本sdk在README.md的"常见问题"板块中，有"通过fileURL下载文件时，自定义下载名"使用样例。
      shouldUseQiniuFileName: false
  };
  // 将七牛云相关配置初始化进本sdk
  qiniuUploader.init(options);
}


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
    },
    onlyIn:false
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
  switchChange:function(e){
    this.setData({
      onlyIn: e.detail.value,
      // isteacher: this.isteacher,
      // u_info: this.u_info
    })
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
      url: app.globalData.host + '/student?id='+stu_number+'&token='+wx.getStorageSync('token'),
      method: 'get',
      success: function(res) {
        console.log(res)
        if (res.statusCode==200) {
          that.info = res.data.data
          that.setData({
            info: res.data.data,
            onlyIn:res.data.data.only_in==1?true:false
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
      title: '正在提交。。。',
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
        duration: 1000
      })
      return ;
    }
    if(!data.face_image){
      wx.showToast({
        title: '请先录入人脸',
        icon: 'loading',
        duration: 1000
      })
      return ;
    }
    if(that.data.info.state!=2){
      wx.requestSubscribeMessage({
        tmplIds: ['WzOYkFYMmW67J3wxeLzcrlSJEyngFP1uIpxI9W4tbEQ'],
        success(res){
          // if(res.WzOYkFYMmW67J3wxeLzcrlSJEyngFP1uIpxI9W4tbEQ)
        },fail(res){
          console.log(res)
        },
        complete(res){
          
        }
      })
      wx.request({
        url: app.globalData.host+'/child',
        method:"POST",
        data:{
          token:wx.getStorageSync('token'),
          number:data.number,
          remark: relation,
          cover:data.cover,
          face_image:data.face_image,
          only_in:that.data.onlyIn==true?1:2,
          id:data.id
        },
        success:(res)=>{
          console.log(res)
          wx.hideToast({})
          if(res.statusCode==200){
            that.data.info.state = 2;
            that.data.info.remark = relation;
            that.setData({
              info :that.data.info
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              duration: 1000
            })
          }
         
        }
      })
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
    initQiniu();
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
        });
        qiniuUploader.upload(res.tempImagePath,(res) => {
          console.log(res.fileURL)
          // that.setData({
          //     'imageObject': res
          // });
          wx.hideToast();
          that.data.info.face_image = res.fileURL
              that.setData({
                info:that.data.info,
                showCamera:false
              })
          console.log('checkFace');
          // wx.request({
          //   url: app.globalData.apihost+'/check/face',
          //   method:'POST',
          //   data:{
          //     href:res.fileURL
          //   }
          //   ,success:(checkres)=>{
          //     console.log(checkres)
          //     wx.hideToast();
          //     if(checkres.statusCode==200){
          //             that.data.info.face_image = res.fileURL
          //     that.setData({
          //       info:that.data.info,
          //       showCamera:false
          //     })
          //     }else{
          //       console.log(checkres)
          //       wx.showModal({
          //         title: '检测失败',
          //         content: checkres.data.msg,
          //         success (res) {
          //           if (res.confirm) {
          //             console.log('用户点击确定')
          //           } else if (res.cancel) {
          //             console.log('用户点击取消')
          //           }
          //         }
          //       })
          //     }
          //   }
          //   ,fail:(res)=>{
          //     console.log(res)
          //     wx.showModal({
          //       title: '错误提示',
          //       content: checkres.msg,
          //       showCancel: false,
          //       success: function(res) {}
          //     })
          //   },complete:(res)=>{
          //     console.log(res)
          //   }
          // })
          console.log('提示: wx.chooseImage 目前微信官方尚未开放获取原图片名功能(2020.4.22)');
          console.log('file url is: ' + res.fileURL);
      }, (error) => {
        wx.showModal({
                  title: '错误提示',
                  content: '上传失败！',
                  showCancel: false,
                  success: function(res) {}
                })
          console.error('error: ' + JSON.stringify(error));
      },null,(progress) => {
        // that.setData({
        //     'imageProgress': progress
        // });
        console.log('上传进度', progress.progress);
        console.log('已经上传的数据长度', progress.totalBytesSent);
        console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend);
    }, cancelTask => {})
      }, fail: (err) => {
        console.log('拍照错误')
        console.log(err)
        app.showNone('拍照错误')
      }, complete: (data) => {
        console.log('拍照返回')
        // console.log(data)
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