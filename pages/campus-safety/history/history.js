const app = getApp();

Page({

    data: {
        recordsList: [],
        school_id: '',
        id: ''
    },
    onLoad: function (option) {
        this.getRecords();
        this.setData({
            school_id: option.school_id,
            id: option.id
        })
    },
    // 历史记录
    getRecords: function () {
        let that = this
            // gregorian = that.childrenlist[that.currentIndex].gregorian;
        wx.request({
            url: app.globalData.host + '/user/student/faceLogs',
            data: {
                school_id: that.data.school_id,
                id: that.data.id,
                // school_id: 43,
                // id: 3949
            },
            method: 'get',
            success: function (res) {
                console.log('历史记录')
                console.log(333, res)
                console.log(333, res.data.data.data)
                if (res.data.data.data.length > 0) {
                    that.setData({
                        recordsList: res.data.data.data
                    })
                }
            }
        });
    },
})