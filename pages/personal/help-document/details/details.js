// pages/personal/help-document/details/details.js

const app = getApp()
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
  data: {

  },
  onLoad: function (options) {
    wx.showToast({ title: '加载中', icon: 'loading', mask: true, duration: 10000 })
    this.getHelpDocument(options.help_id)
  },
  onShow: function() {

  },

  // 获取文档内容
  getHelpDocument: function(help_id) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/help/doc',
      data: {
        id: help_id
      },
      method: 'get',
      success: function(res) {
        if (res.statusCode==200) {
          wx.hideToast()
          WxParse.wxParse('article', 'html', res.data.data.detail, that, 5);
          wx.setNavigationBarTitle({
            title: res.data.data.title //页面标题为路由参数
          })
        }
      }
    });
  }
})