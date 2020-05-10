// pages/personal/help-document/help-document.js
const app = getApp()
Page({
  data: {
    documentList:null
  },
  onLoad: function (options) {
    wx.showToast({ title: '加载中', icon: 'loading', mask: true, duration: 10000 })
    this.getDocumentList();
  },
  onShow: function () {
  
  },
  // 获取帮助文档列表
  getDocumentList: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/help/docs',
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log(res.data.data)
        if (res.data.data) {
          that.documentList = res.data.data.data;
          that.setData({
            documentList: res.data.data.data
          })
        }
      }
    });
  },
  // 打开文档
  openDocument: function(e){
console.log(e)
    wx.navigateTo({
      url: '../details/details?help_id=' + e.currentTarget.dataset.value
    })
  }
})