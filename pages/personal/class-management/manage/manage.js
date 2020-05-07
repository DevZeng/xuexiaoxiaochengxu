// pages/personal/class-management/manage/manage.js
const app = getApp()
Page({
  data: {
  childrenList:[]
  },
  onLoad: function (options) {
    this.getChildrenList();
  },

  onShow: function () {
  
  },
  // 获取学生在校列表
  getChildrenList: function(){
    let that = this;
    wx.request({
      url: app.globalData.https + '/stu/at_school?user_openid=' + app.globalData.opnID,
      method: 'get',
      success: function (res) {
        console.log('班级学生在校列表')
        console.log(res)
        if (res.data.data) {
          
          that.childrenList = res.data.data;
          that.setData({
            childrenList: res.data.data
          })

        }
      }
    });
  }

})