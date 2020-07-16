const app = getApp();

Page({

    data: {
        recordsList: [],
        school_id: '',
        number: ''
    },
    onLoad: function (options) {
        this.setData({
            school_id: options.school_id,
            number: options.number
        })
        this.getRecords();

    },
    // 历史记录
    getRecords: function () {
        let that = this
            // gregorian = that.childrenlist[that.currentIndex].gregorian;
        wx.request({
            url: app.globalData.host + '/user/student/faceLogs?token='+wx.getStorageSync('token'),
            data: {
                page: 1,
                limit: 100,
                school_id: that.data.school_id,
                number: that.data.number,
                // school_id: 45,
                // number: 2019024
            },
            method: 'get',
            success: function (res) {
                console.log('历史记录')
                console.log(333, res.data.data)
                console.log(333, res.data.data.direction)
                if (res.data.data.direction.length > 0) {
                    that.setData({
                        recordsList: res.data.data.direction
                    })
                }
            }
        });
    },
})