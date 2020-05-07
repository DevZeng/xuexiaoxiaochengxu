
const app = getApp()
let content, images = [], classFication;
Page({
  data: {
    imageArray: [],//图片列表
    class_array: ['体育资讯', '校园资讯', '班级活动', '个人风采'],
    class_index: 0,
    address:'所在位置',
    mask_disable:false//地址授权弹窗
  },
  onLoad: function (options) {
    // 初始化
    content = '', images = [];
    this.imageArray = []
    this.class_index = 0
    this.address = '所在位置'

    this.getClassFication();
  },
  onShow: function () {

  },
  // 获取帖子分类
  getClassFication: function () {
    let that = this;
    wx.request({
      url: app.globalData.https + '/aummi/select_all_class',
      method: 'get',
      success: function (res) {
        console.log('帖子分类列表')
        console.log(res)
        if (res.data.code == 200) {
          classFication = res.data.data;
          let data = [];
          for(let i = 0; i < res.data.data.length; i++){
            data[data.length] = res.data.data[i].aumni_name
          }
          that.class_array = data;
          that.setData({
            class_array: data
          })
        }
      }
    });
  },
  // 分类选择
  classChange: function (e) {
    this.class_index = e.detail.value
    this.setData({
      class_index: e.detail.value
    })
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
  // 显示隐藏设置授权弹窗
  display: function () {
    this.mask_disable = !this.mask_disable;
    this.setData({
      mask_disable: this.mask_disable
    })
    console.log(this.mask_disable)
  },
  // 地点选择监听
  map: function (e) {
    let that = this;
    // return;
    wx.chooseLocation({
      success: function (res) {
        console.log('选择的地址')
        console.log(res)
        console.log(res.name)
        that.address = res.name
        that.setData({
          address: that.address
        })
      },
      fail: function (err) {
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
  map1: function (e) {
    let that = this
    that.display()
    console.log(e.detail.authSetting['scope.userLocation'])
    if (e.detail.authSetting['scope.userLocation']) {
      wx.chooseLocation({
        success: function (res) {
          console.log('选择的地址')
          console.log(res)
          console.log(res.name)
          that.address = res.name
          that.setData({
            address: that.address
          })
        }
      })
    }
  },
  // 发布
  release: function () {
    // return;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (images.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (this.address == '所在位置') {
      wx.showToast({
        title: '请输入地址',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else {
      let imagelist;
      for (let i = 0; i < images.length; i++) {
        if (imagelist) {
          imagelist = imagelist + ',' + images[i];
        }else {
          imagelist = images[i]
        }
      }
      let data = {
        user_openid: app.globalData.opnID,
        aumni_id: classFication[this.class_index].aumni_id,
        content: content,
        images: imagelist,
        positions: this.address
      }
      console.log('请求的数据')
      console.log(data)
      wx.request({
        url: app.globalData.https + '/aummi/insert_aumni',
        data: data,
        header: {
          // "content-type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({ title: '发布成功！', icon: 'success', duration: 1000 })
            setTimeout(function () { wx.navigateBack({}) }, 1000)
          } else {
            console.log(res.data.msg)
          }
        }
      });
    }

  }
})