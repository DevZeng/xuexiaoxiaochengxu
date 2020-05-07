//index.js
//获取应用实例
const app = getApp();
let lock = true, num, totle;
Page({
  data: {
    banner: [], //轮播图
    classFication: [], //分类列表
    information: [], //资讯列表
  },
  onLoad: function () {
    wx.showToast({ title: '加载中', icon: 'loading', mask: true, duration: 10000 })
    this.information = []
    this.getBanner();
    this.getClassFication();
    
    
  },
  onShow: function () {
    
    lock = true;
    this.information = []
    this.getInformation();
  },
  //滚动监听
  scroll: function (e) {
    // if (lock) {
    //   lock = !lock;
    //   wx.showToast({ title: '加载中', icon: 'loading' })
      this.getInformation();
    // }
  },
  // 获取轮播图
  getBanner: function() {
    let that = this;
    wx.request({
      url: app.globalData.host + '/banners',
      method: 'get',
      success: function (res) {
        console.log('首页轮播图列表')
        if (res.data) {
          that.banner = res.data.data.data;
          that.setData({
            banner: res.data.data.data
          })
        }
      }
    });
  },
  // 获取资讯分类
  getClassFication: function() {
    let that = this;
    wx.request({
      url: app.globalData.host + '/document/types',
      method: 'get',
      success: function(res) {
        console.log(res)
        if (res.data) {
          that.classFication = res.data.data.data;
          that.setData({
            classFication: res.data.data.data
          })
        }
      }
    });
  },
  // 获取资讯列表
  getInformation: function () {
    wx.showToast({ title: '加载中', icon: 'loading' })
    let that = this,
      num = 1;
    if (that.information) {
      num = Math.ceil(that.information.length / 10) + 1
      console.log(that.information.length)
    }
    console.log('去获取资讯')
    console.log('页码' + num)
    wx.request({
      url: app.globalData.host + '/documents',
      data:{
        page: num
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log('资讯列表返回')
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data.data;
          console.log('test')
          console.log(data)
            that.setData({
              information: data
            })
        }
      }
    });
  },
  // 去提交formID
  getFormID: function(e){
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },

  // 跳转分类
  openClassification: function(e) {
    console.log(e)
    setTimeout(function(){
      wx.navigateTo({
        url: '../campus-information/classification/classification?class_id=' + e.currentTarget.dataset.id
      })
    },100)
  },
  // 跳转资讯详情
  openDetals: function (e) {
    // 静态设置浏览量
    let index = e.currentTarget.dataset.index,
      data = this.information
    //data[index].details_browse = Number(data[index].details_browse) + 1
    // data[index].details_browse = 1
    console.log(e.currentTarget.dataset.id)
    this.information = data
    this.setData({
      information: data
    })
    wx.navigateTo({
      url: '../campus-information/details/details?details_id=' + e.currentTarget.dataset.id
    })
  },
  // 分享转发
  onShareAppMessage: function () {
    return {
      title: "图巴诺校园风采",
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544844868129.jpg"
    }
  }
})