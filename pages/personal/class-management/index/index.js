
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  // 跳转在校信息
  toManage: function () {
    wx.navigateTo({
      url: '../manage/manage'
    })
  },
  // 跳转家长审核
  toAudition: function () {
    wx.navigateTo({
      url: '../auditing/auditing'
    })
  },
})