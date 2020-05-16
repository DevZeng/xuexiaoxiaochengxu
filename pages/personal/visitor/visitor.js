
const qiniuUploader = require("../../../utils/qiniuUploader");

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

var utils = require('../../../utils/util.js')
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
    date:null,

multiArray: [['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
 
['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',

  '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',

  '25', '26', '27', '28', '29', '30', '31'

]],

multiIndex: [0, 0],

  },
  onLoad: function(options) {
   
    // this.date = new Date();
    this.details = {}
    this.mask_disable = false;
    this.showCamera = false //是否显示照相机
    this.cameraConfig = { //照相机参数配置
      flash: 'off',
      position: 'front',
    }
    this.setData({
      multiIndex : [new Date().getMonth(),new Date().getDate()-1]
    })
    console.log(this.data.multiIndex);
    let that = this
    // 获取访客信息
    this.getRecord();
    this.getSchoolsList();
  },
  onShow: function() {
    this.setData({
      // userInfo: info,
      showFace :wx.getStorageSync('openFace')
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
          if(res.data.data){
            this.setData({
              worker:res.data.data.worker,
              school:res.data.data.school,
              details:res.data.data
            })
          }
        }
        if(res.statusCode==403){
          wx.showToast({
            title: '请先登陆！',
            icon: 'loading',
            mask: true,
            duration: 1000,
            
          })
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateBack()
           }, 1000) //
          console.log('go')
         
        }
        if(res.statusCode==401){
          wx.showToast({
            title: '请先登陆！',
            icon: 'loading',
            mask: true,
            duration: 1000,
            
          })
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateBack()
           }, 1000) //
          console.log('go')
         
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
    let that  = this;
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
    if(!details.href){
      wx.showToast({
        title: '请先上传照片！',
        icon: 'loading',
        duration: 1000
      })
      return ;
    }
    if(that.data.multiIndex[0]<=new Date().getMonth()&&that.data.multiIndex[1]<new Date().getDate()-1){
      console.log(that.data.multiIndex[0])
      console.log(new Date().getMonth())
      console.log(that.data.multiIndex[1])
      console.log(new Date().getDate())
      wx.showModal({
        title: '提示',
        content: '来访日期不正确！',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return ;
    }
    wx.requestSubscribeMessage({
      tmplIds: ['WzOYkFYMmW67J3wxeLzcrlSJEyngFP1uIpxI9W4tbEQ'],
      success(res){
        // if(res.WzOYkFYMmW67J3wxeLzcrlSJEyngFP1uIpxI9W4tbEQ)
      },fail(res){
        console.log(res)
      }
    })
    wx.request({
      url: app.globalData.host + '/visitor',
      data: {
        form_id: e.detail.formId,
        token: wx.getStorageSync('token'),
        name: details.name,
        phone: details.phone,
        reason: details.reason,
        worker_id: details.worker_id,
        school_id:details.school_id,
        href:details.href,
        date:new Date().getFullYear()+'-'+(that.data.multiIndex[0]+1)+'-'+(that.data.multiIndex[1]+1)
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
    initQiniu();
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
        qiniuUploader.upload(res.tempImagePath, (res) => {
          // console.log(res)
          // that.setData({
          //     'imageObject': res
          // });
          wx.request({
            url: app.globalData.apihost+'/check/face',
            method:'POST',
            data:{
              href:res.fileURL
            },success:(checkres)=>{
              wx.hideToast();
              if(checkres.statusCode==200){
                           that.data.details.href = res.fileURL
              that.setData({
                details: that.data.details
              })
              }else{
                wx.showModal({
                  title: '检测失败',
                  content: checkres.data.msg,
                  success (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            }
          })
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
      },
      // 此项为qiniuUploader.upload的第四个参数options。若想在单个方法中变更七牛云相关配置，可以使用上述参数。如果不需要在单个方法中变更七牛云相关配置，则可使用 null 作为参数占位符。推荐填写initQiniu()中的七牛云相关参数，然后此处使用null做占位符。
      // 若想自定义上传key，请把自定义key写入此处options的key值。如果在使用自定义key后，其它七牛云配置参数想维持全局配置，请把此处options除key以外的属性值置空。
      // 启用options参数请记得删除null占位符
      // {
      //   region: 'NCN', // 华北区
      //   uptokenURL: 'https://[yourserver.com]/api/uptoken',
      //   domain: 'http://[yourBucketId].bkt.clouddn.com',
      //   shouldUseQiniuFileName: false,
      //   key: 'testKeyNameLSAKDKASJDHKAS',
      //   uptokenURL: 'myServer.com/api/uptoken'
      // },
      null,
      (progress) => {
          // that.setData({
          //     'imageProgress': progress
          // });
          console.log('上传进度', progress.progress);
          console.log('已经上传的数据长度', progress.totalBytesSent);
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend);
      }, cancelTask => {}
      );
        // wx.uploadFile({
        //   url: app.globalData.apihost + '/upload/face', 
        //   filePath: res.tempImagePath,
        //   name: "file",
        //   success: function(res1) {
        //     console.log('头像上传成功返回')
        //     console.log(res1)
        //     wx.hideToast();
            
        //     console.log(res1)
        //     console.log(res1.data)
        //     let data = JSON.parse(res1.data)
        //     if (res1.statusCode==200) {
        //       that.data.details.href = data.data
        //       that.setData({
        //         details:that.data.userInfo
        //       })
        //     } else {
        //       wx.showModal({
        //         title: '错误提示',
        //         content: data.msg,
        //         showCancel: false,
        //         success: function(res) {}
        //       })
        //     }
        //   }, fail: function (err) {
        //     console.log('头像上传失败返回')
        //     console.log(err)
        //   }
        // })
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
  },
  bindMultiPickerColumnChange: function (e) {

    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
     
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
     
    data.multiIndex[e.detail.column] = e.detail.value;
     
    switch (e.detail.column){
      case 0:
        switch (data.multiIndex[0]) {
          case 1:
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
     
              '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
     
              '25', '26', '27', '28', '29'
     
            ];
            break;
          default:
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
     
              '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
     
              '25', '26', '27', '28', '29', '30', '31'
     
            ];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
    }
     
    this.setData(data);
    }
})