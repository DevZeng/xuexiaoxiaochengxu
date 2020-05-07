const app = getApp();
Page({
  data: {
    details: [],
    recordList:[]
  },
  onLoad: function (options) {
    console.log(JSON.parse(options.details))
    this.details = JSON.parse(options.details)
    this.setData({
      details: this.details
    })
    this.getRecord();
  },
  onShow: function () {

  },


  // 获取通行记录
  getRecord: function (e) {
    let that = this

    wx.request({
      url: app.globalData.https + '/cardNumber/getRecord',
      data: {
        card_number: that.details.card_number
      },
      method: 'get',
      success: function (res) {
        console.log('门禁卡通行记录')
        console.log(res)
        if (res.data.code == 200) {
          that.recordList = res.data.data
          that.setData({
            recordList: that.recordList
          })
        } else {
          wx.showModal({ title: '提示', content: res.data.msg, showCancel: false, success: function (res) { } })
        }
      }
    });

  },
})