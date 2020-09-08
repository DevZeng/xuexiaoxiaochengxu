const app = getApp();

Page({

    data: {
        recordsList: null,
        school_id: '',
        number: '',
        student_id: '',
        face_id: ''
    },
    onLoad: function (options) {
        this.setData({
            school_id: options.school_id,
            number: options.number,
            student_id: options.student_id,
            face_id: options.face_id
        })
        this.getRecords();

    },
    // 历史记录
    getRecords: function () {
        let that = this
        // gregorian = that.childrenlist[that.currentIndex].gregorian;
        wx.request({
            url: app.globalData.host + '/user/student/faceLogs?token=' + wx.getStorageSync('token'),
            data: {
                page: 1,
                limit: 300,
                school_id: that.data.school_id,
                number: that.data.number,
                student_id: that.data.student_id,
                face_id: that.data.face_id
                // school_id: 43,
                // number: 20200212,
                // student_id: 11682,
                // face_id: 'face_5f4b9918688fa'
            },
            method: 'get',
            success: function (res) {
                if (res.statusCode == 200) {
                    that.setData({
                        recordsList: res.data.data.direction
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }

            }
        });
    },
})