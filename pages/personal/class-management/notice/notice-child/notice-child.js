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
          method: 'GET',
          success: function(res) {
            self.setData({
              notice_childList: res.data.data
            })
          }
        })
      },

      toNotice(e) {
        console.log(e)
        var self =this;
        wx.navigateTo({
          url: '../notice-list/notice-list?classid=' + e.currentTarget.dataset.classid + '&studentid=' +  e.currentTarget.dataset.studentid,
        })
    }
   
})