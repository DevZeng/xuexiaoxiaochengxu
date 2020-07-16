const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        class_id: '',
        notice_List: null,
        btn_del: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            class_id: options.classid,
            btn_del: options.btn_del
        })
        this.getNoticeList()
    },
    getNoticeList() {
        var self = this;
        wx.request({
            url: app.globalData.host + '/class/notice',
            method: 'GET',
            data: {
                token: wx.getStorageSync('token'),
                class_id: self.data.class_id
            },
            success: function (res) {
                self.setData({
                    notice_List: res.data.data
                })
            }
        })
    },

    toDetail(e) {
        console.log(e)
        var self = this;
        wx.navigateTo({
            url: '../notice-detail/notice-detail?title=' + e.currentTarget.dataset.title + '&content=' + e.currentTarget.dataset.content + '&time=' + e.currentTarget.dataset.createtime,
        })
    },

    del(e) {
        let self = this;
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '删除公告',
            content: '是否删除该公告？',
            cancelText: '取消',
            confirmText: '删除',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.host + '/class/notice?id=' + id,
                        method: 'DELETE',
                        success: function (res) {
                            if (res.data.msg == 'ok') {
                                wx.showToast({
                                    title: '删除成功',
                                    success: function (res) {
                                        setTimeout(() => {
                                            self.getNoticeList();
                                            wx.hideToast();
                                        }, 2000)
                                    }
                                })
                            }
                        }
                    })
                } else if (res.cancel) {
                    wx.hideToast()
                }
            }
        })
    }

})