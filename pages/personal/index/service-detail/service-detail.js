// pages/personal/index/service-detail/service-detail.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        student_id: '',
        title: '',
        time: '',
        detailList: [],
        state: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            student_id: options.student_id
        })
        this.getService()
    },

    // 获取服务信息
    getService() {
        var self = this;
        wx.request({
            url: app.globalData.host + '/user/serves?token=' + wx.getStorageSync('token'),
            method: 'get',
            data: {
                student_id: self.data.student_id
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if(res.data.data.length > 0) {
                        self.setData({
                            detailList: res.data.data
                        })
                    } else {
                        wx.showToast({
                          title: '暂无购买服务记录',
                          icon: 'none'
                        })
                    }
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