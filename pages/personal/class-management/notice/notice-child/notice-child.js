const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_childList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNoticeChild();
  },
  getNoticeChild() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/user/student?token=' + wx.getStorageSync('token'),
      data: {
        mode: 2
      },
      method: 'GET',
      success: function (res) {
        self.setData({
          notice_childList: res.data.data
        })
      }
    })
  },

  toNotice(e) {
    console.log(e)
    var self = this;
    wx.request({
      url: app.globalData.host + '/class/notice',
      method: 'GET',
      data: {
        token: wx.getStorageSync('token'),
        class_id: e.currentTarget.dataset.classid,
        student_id: e.currentTarget.dataset.studentid
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.navigateTo({
            url: '../notice-list/notice-list?classid=' + e.currentTarget.dataset.classid + '&studentid=' + e.currentTarget.dataset.studentid,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }

      }
    })

  }

})