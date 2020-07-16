// pages/campus-information/details/details.js
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
let details_id;
Page({

  data: {
    details:[]
  },
  onLoad: function (options) {
    details_id = options.details_id
    this.getDetails();
    // this.setView();
  },
  onShow: function () {
  
  },
  // 获取资讯详情
  getDetails: function () {
    wx.showToast({ title: '加载中', icon: 'loading', mask:true, duration: 10000 })
    let that = this;
    wx.request({
      url: app.globalData.host + '/document',
      data:{
        id: details_id
        // details_id: 65
      },
      method: 'get',
      success: function (res) {
        if (res.data) {
          console.log(res.data.data)
          wx.hideToast({ })
          WxParse.wxParse('article', 'html', res.data.data.detail, that, 2);
          that.details = res.data.data;
          console.log(111111,res.data.data.detail)
          that.setData({
            details: res.data.data
          })
        }
      }
    });
  },
  // // 设置浏览量
  // setView: function () {
  //   wx.request({
  //     url: app.globalData.https + '/famous/update_browse?details_id=' + details_id,
  //     method: 'put',
  //     success: function (res) {
  //       console.log('设置浏览量返回')
  //       console.log(res)
  //     }
  //   });
  // },
  // 分享转发
  onShareAppMessage: function () {
    let that = this;
    var path = '/pages/campus-information/details/details?details_id=' + details_id
    return {
      title: that.details.details_title,
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544850947628.jpg",
      path: path
    }
  }

})