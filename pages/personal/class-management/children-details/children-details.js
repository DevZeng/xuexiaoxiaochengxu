
const app = getApp();
let num;
Page({
  data: {
    info: []
  },
  onLoad: function (options) {
    console.log(options.stu_number)
    this.getDateils(options.stu_number);
  },
  onShow: function () {
  
  },
 
  // 获取学生信息
  getDateils: function (stu_number){
    let that = this;
    wx.request({
      url: app.globalData.host + '/student',
      data: {
        id: stu_number
      },
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.statusCode==200) {
          that.info = res.data.data
          that.setData({
            info: res.data.data
          })
        }
      }
    });
  },
 
})