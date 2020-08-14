// pages/personal/buy/bill/bill.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    school_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      school_id: options.school_id
    })
    this.getRecordList()
  },

  // 获取账单
  getRecordList() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/orders?token=' + wx.getStorageSync('token'),
      data: {
        school_id: app.globalData.school_id
      },
      method: 'GET',
      success: function (res) {
        if(res.statusCode == 200) {
          self.setData({
            recordList: res.data.data
          })
        }
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})