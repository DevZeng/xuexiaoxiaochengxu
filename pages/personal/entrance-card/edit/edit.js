const app = getApp();
Page({
  data: {
    details: [],
    addStust: false
  },
  onLoad: function (options) {
    console.log(JSON.parse(options.details))
    let data = JSON.parse(options.details)
    this.details = {
      card_number: data.card_number,
      stu_number: data.stu_number
    }
    if (data.card_number) {//之前有绑定卡
      this.addStust = false
    } else {
      this.addStust = true
    }
    this.setData({
      details: this.details,
      addStust: this.addStust
    })
  },
  onShow: function () {

  },

  // 跳转门禁卡通行记录
  toRecord: function (e) {
    let that = this
    wx.navigateTo({
      url: '/pages/personal/entrance-card/record/record?details=' + JSON.stringify(that.details)
    })
  },

  // 卡号输出
  numInput: function (e) {
    this.details.card_number = e.detail.value;
    this.setData({
      details: this.details
    })
  },
  // 保存
  submission: function (e) {
      let that = this,
        details = this.details;
    if (!details.card_number) {
        wx.showToast({
          title: '请输入卡号',
          icon: 'loading',
          duration: 1000
        })
        return;
      } else {
        if (that.addStust) { //添加卡号
          console.log('添加卡号')
          wx.request({
            url: app.globalData.https + '/cardNumber/postCardNumber',
            data: details,
            method: 'post',
            success: function (res) {
              console.log(res)
              if (res.data.code == 200) {
                wx.showToast({
                  title: '保存成功！',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 1000)
              } else {
                wx.showModal({ title: '提示', content: res.data.msg, showCancel: false, success: function (res) { } })
              }
            }
          });
        } else{ //编辑卡号
          console.log('编辑卡号')
          console.log(details)
          wx.request({
            url: app.globalData.https + '/cardNumber/putCardNumber',
            data: details,
            method: 'put',
            success: function (res) {
              console.log(res)
              if (res.data.code == 200) {
                wx.showToast({
                  title: '保存成功！',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 1000)
              } else {
                wx.showModal({ title: '提示', content: res.data.msg, showCancel: false, success: function (res) { } })
              }
            }
          });
        }
      }
  },
})