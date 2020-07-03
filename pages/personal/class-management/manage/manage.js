// pages/personal/class-management/manage/manage.js
const app = getApp()
Page({
  data: {
    childrenList: []
  },
  onLoad: function (options) {
    this.getChildrenList();
  },

  onShow: function () {

  },
  // 获取学生在校列表
  getChildrenList: function () {
    let that = this;
    wx.showToast({
      icon: 'loading',
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host + '/class/students?token=' + wx.getStorageSync('token'),
      method: 'get',
      success: function (res) {
        console.log('班级学生在校列表')
        console.log(res)
        if (res.data.data) {
          that.setData({
            childrenList: res.data.data
          })
        }
      }
    });
  }

})