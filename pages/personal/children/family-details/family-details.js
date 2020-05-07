
const app = getApp();
let user_openid,stu_number;
Page({
  data: {
    info:[]
  },
  onLoad: function (options) {
    this.info = JSON.parse(options.data);
    this.setData({
      info: JSON.parse(options.data)
    })
    stu_number = options.stu_number;
  },
  onShow: function () {

  },
  // 通过家长审核
  through: function () {
    let that = this
    console.log(app.globalData.opnID)
    console.log(stu_number)
    console.log(that.info.parent_id)
    wx.request({
      url: app.globalData.https + '/parent/update_status1',
      data: {
        user_openid1: app.globalData.opnID,
        stu_number: stu_number,
        parent_id: Number(that.info.parent_id)
      },
      method: 'put',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('通过审核返回')
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.sucesss) {
            wx.showToast({ title: '审核完成！', icon: 'success', duration: 1000 })
            setTimeout(function () { wx.navigateBack({}) }, 1000)
          }else{
            wx.showModal({
              title: '错误提示', content: res.data.error, showCancel: false, success: function (res) { }
            })
          }
        }
      }
    });
  },
// 不通过家长审核
  not_through: function(){
    let that = this;
    console.log(app.globalData.opnID)
    console.log(stu_number)
    console.log(that.info.parent_id)
    wx.request({
      url: app.globalData.https + '/parent/update_status2',
      data: {
        user_openid1: app.globalData.opnID,
        stu_number: stu_number,
        parent_id: Number(that.info.parent_id)
      },
      method: 'put',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('不通过审核返回')
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.sucesss) {
            wx.showToast({ title: '审核完成！', icon: 'success', duration: 1000 })
            setTimeout(function () { wx.navigateBack({}) }, 1000)
          } else {
            wx.showModal({
              title: '错误提示', content: res.data.error, showCancel: false, success: function (res) { }
            })
          }
        }
      }
    });
  }
})