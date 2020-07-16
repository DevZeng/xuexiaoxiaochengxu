var class_id
Page({
  data: {
    class_id: ''
  },
  onLoad: function (options) {
    var self = this;
    self.class_id = options.class_id
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

  // 跳转发布公告
  toNotice() {
    var self = this;
    wx.navigateTo({
      url: '../notice/notice?classid=' + self.class_id
    })
  },

  // 跳转公告管理
  toManageNotice() {
    var self = this;
    wx.navigateTo({
      url: '../../class-management/notice/notice-list/notice-list?classid=' + self.class_id + '&btn_del=' + 'true' 
    })
  }
})