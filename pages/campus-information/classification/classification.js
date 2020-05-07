// pages/campus-information/classification/classification.js
const app = getApp();
let lock = true,
  class_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classFication: [], //分类列表
    information: [], //资讯列表
    num: 0 //头部导航下标
  },
  onLoad: function(options) {
    this.information = []
    console.log(options.class_id)
    class_id = options.class_id
    this.getClassFication(options.class_id);
  },
  onShow: function() {

  },
  // 获取资讯分类
  getClassFication: function(class_id) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/document/types',
      method: 'get',
      success: function(res) {
        console.log(res)
        if (res.data.data.data) {
          let num = 0;
          for (let i = 0; i < res.data.data.data.length; i++) {
            if (res.data.data.data[i].id == class_id) {
              num = i;
            }
          }
          that.classFication = res.data.data.data;
          that.num = num;
          that.setData({
            classFication: res.data.data.data,
            num: num
          })
          that.getInformation();
        }
      }
    });
  },

  //滚动到底监听
  scroll: function (e) {
    this.getInformation();
  },
  // 通过分类获取资讯
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
  // 头部导航
  nav: function(e) {
    let list = this.classFication
    for (let i = 0; i < list.length; i++) {
      list[i].state = false;
    }
    list[e.currentTarget.dataset.index].state = true;
    this.classFication = list;
    this.num = e.currentTarget.dataset.index;
    this.information = []
    this.setData({
      classFication: list,
      information: [],
      num: e.currentTarget.dataset.index
    })
    this.getInformation();
  },
  // 去提交formID
  getFormID: function(e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },
  // 跳转资讯详情
  openDetals: function(e) {
    wx.navigateTo({
      url: '../details/details?details_id=' + e.currentTarget.dataset.id
    })
  },
  // 分享转发
  onShareAppMessage: function() {
    return {
      title: "图巴诺校园风采",
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544844868129.jpg"
    }
  }
})