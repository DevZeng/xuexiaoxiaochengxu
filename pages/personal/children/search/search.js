const app = getApp();
let num;
Page({

  data: {
    strList: '' //列表
  },
  onLoad: function(options) {

  },
  onShow: function() {

  },
  // 学号输出
  numInput: function(e) {
    num = e.detail.value;
  },
  // 搜索
  search: function() {
    let that = this
    setTimeout(function() {
      console.log('关键字:' + num)
      if (num) {
        // if (/\D/.test(num)) { //判断是否是数字
        //   console.log('姓名')
        // } else {
        //   console.log('学号')
        // }
        wx.showToast({ title: '搜索中...', icon: 'loading', duration: 10000 })
        // 搜索关键字
        wx.request({
          url: app.globalData.host + '/students',
          data: {
            search: num
          },
          method: 'get',
          success: function(res) {
            console.log('搜索返回')
            console.log(res)
            if (res.statusCode == 200) {
              that.strList = res.data.data.data
              that.setData({
                strList: that.strList
              })
              if (res.data.data.data.length > 0){
                wx.hideToast({});
              } else {
                wx.showToast({
                  title: '暂无搜索数据~',
                })
              }
            }
          }
        });
        // 搜索学号
        // wx.request({
        //   url: app.globalData.https + '/class_m/select_message',
        //   data: {
        //     stu_number: num
        //   },
        //   method: 'get',
        //   success: function (res) {
        //     console.log('搜索返回')
        //     console.log(res)
        //     if (res.data.result) {
        //       // that.strList
        //       wx.navigateTo({
        //         url: '../children-details/children-details?stu_number=' + res.data.result.stu_number
        //       })
        //     } else {
        //       wx.showToast({ title: '学号不正确', icon: 'loading', duration: 1000 })
        //     }
        //   }
        // });
      } else {
        wx.showToast({
          title: '请填写学号',
          icon: 'loading',
          duration: 1000
        })
      }
    }, 200)
  },
  toDetails: function(e) {
    console.log(e)
    // return;
    wx.navigateTo({
      url: '../children-details/children-details?stu_number=' + e.currentTarget.dataset.id
    })
  }
})