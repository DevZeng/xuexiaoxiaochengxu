
const app = getApp()
let title,content,images = [];
Page({
  data: {
    imageArray: [],//图片列表
  },
  onLoad: function (options) {
    // 初始化
    title = '', content = '', images = [];
    this.imageArray = []
  },
  onShow: function () {

  },
  // 标题输出
  titleInput: function (e) {
    title = e.detail.value;
  },
  // 内容输出
  contentInput: function (e) {
    content = e.detail.value;
  },
  // 上传图片
  upload_img: function () {
    let that = this,
      imageArray_length = this.imageArray.length;
    console.log(imageArray_length)
    if (9 - imageArray_length > 0) {
      wx.chooseImage({
        count: 9 - imageArray_length,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // "original"原图，"compressed"压缩图，默认二者都有
        sourceType: ['album', 'camera'], // "album"从相册选图，"camera"使用相机，默认二者都由
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          let imageArray = that.imageArray
          let tempFilePaths = res.tempFilePaths;
          wx.showToast({ title: '正在上传...', icon: 'loading', mask: true, duration: 10000 })
          var uploadImgCount = 0;
          for (var i = 0, h = tempFilePaths.length; i < h; i++) {
            let filePath = res.tempFilePaths[i];
            wx.uploadFile({
              url: app.globalData.https + '/txUpload_t',
              filePath: res.tempFilePaths[i],
              name: "file",
              formData: {
                "user": "test"
              },
              success: function (res) {
                uploadImgCount++;
                // 已经上传最后一张，隐藏提示
                if (uploadImgCount == tempFilePaths.length) {
                  wx.hideToast();
                }
                // 显示（临时路径-如果看不到图片，请重新打开小程序）
                imageArray[imageArray.length] = filePath;

                //保存（上传后返回的图片路径）
                images[images.length] = JSON.parse(res.data).sucesss;
                // if (images) {
                //   images = images + ',' + JSON.parse(res.data).sucesss;
                // } else {
                //   images = JSON.parse(res.data).sucesss;
                // }
                that.imageArray = imageArray
                that.setData({
                  imageArray: imageArray
                })
                console.log(imageArray)
              }
            })
          }

        }
      });
    } else {
      wx.showToast({ title: '只能上传九张图片', icon: 'loading', duration: 1000 })
    }
    
  },
  // 删除图片
  deleteImg: function (e) {
    images.splice(e.currentTarget.dataset.index, 1);
    this.imageArray.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imageArray: this.imageArray
    })
  },
  // 图片展示
  previewImage: function (e) {
    console.log(images)
    wx.previewImage({
      current: images[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },
  // 发布
  release: function(){
    console.log(title)
    console.log(content)
    console.log(images)
    if (title && content){
      let imagelist;
      let data = {
        user_openid: app.globalData.opnID,
        notice_title: title,
        notice_content: content
      }
      if (images.length > 0){
        for (let i = 0; i < images.length; i++) {
          if (imagelist) {
            imagelist = imagelist + ',' + images[i];
          }
          else {
            imagelist = images[i]
          }
        }
        data.notice_image = imagelist
      }
      wx.request({
        url: app.globalData.https + '/notice/insert_notice',
        data: data, 
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
          console.log(res)
         if(res.data.sucesss){
           wx.showToast({ title: '发布成功！', icon: 'success', duration: 1000 })
           setTimeout(function () { wx.navigateBack({}) }, 1000)
         }else{
           console.log(res.data.error)
         }
        }
      });
    } else {
      wx.showToast({title: '请完善信息',icon: 'loading',duration: 1000 })
    }
    
  }
})