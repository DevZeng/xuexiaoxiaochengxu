//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    recordList: []
  },
  onLoad: function () {
    let that = this;
    // 获取账单明细
    wx.request({
      method: 'GET',
      url: app.globalData.https + '/order/select_user_order',
      data: {
        user_openid: app.globalData.opnID
      },
      success: function (res) {
        console.log('账单明细')
        console.log(res)

        if (res.statusCode == 200) {
          if (res.data.data) {
            that.recordList = res.data.data;
            that.setData({
              recordList: res.data.data
            })
          }
        }
      }
    });
  }
})
