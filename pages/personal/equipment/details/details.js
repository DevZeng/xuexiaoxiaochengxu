// pages/personal/equipment/details/details.js
const app = getApp()
let device_id, stu_number;
Page({
  data: {
    details: null,
    addState: false,
    pictureList: [],
    pictureIndex: 0
  },
  onLoad: function (options) {
    // device_id = 358511025621274
    // this.Remove();
    wx.showToast({ title: '加载中', icon: 'loading', duration: 1000 })
    if (options.data) { //查看设备详情
    console.log('查看设备')
      let data = options.data.replace(/[*]/g, '?').replace(/[~]/g, '=');
      data = JSON.parse(data)
      device_id = data.device_id
      stu_number = data.stu_number
      this.details = data
      this.setData({
        details: data
      })
    } else { //添加设备
      console.log('添加设备')
      this.addState = true;
      this.setData({
        addState: true
      })
    }
    this.getPictureList();
  },
  onShow: function() {

  },
  // 扫描设备条形码
  getDeviceid: function () {
    let that = this
    if (that.addState){
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log(res)
          device_id = res.result;
          that.details = { device_id: res.result }
          that.setData({
            details: that.details
          })
        }
      })
    }
  },
  // 根据型号查看图片
  getPictureList: function() {
    let that = this;
    wx.request({
      url: app.globalData.https1 + '/device/select_all_picture',
      data: {
        version_id: 1
      },
      method: 'get',
      success: function(res) {
        console.log('根据型号查看图片返回')
        console.log(res.data.data)
        if (res.data.data) {
          let pictureIndex = 0
          if (that.details) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (that.details.picture == res.data.data[i].picture) {
                pictureIndex = i;
              }
            }
          }
          wx.hideToast()
          that.pictureIndex = pictureIndex;
          that.pictureList = res.data.data;
          that.setData({
            pictureList: res.data.data,
            pictureIndex: pictureIndex
          })

        }
      }
    });
  },
  // 颜色图片选择
  radioChange: function(e) {
    this.pictureIndex = e.detail.value;
    this.setData({
      pictureIndex: e.detail.value
    })
  },
  // 设备ID输出
  IDInput: function(e) {
    device_id = e.detail.value;
  },
  // 学号输出
  numberInput: function(e) {
    stu_number = e.detail.value;
  },
  // 总控后台绑定设备
  Binding: function() {
    let that = this;
    if (device_id && stu_number) {
      wx.request({
        url: app.globalData.https1 + '/device/select_dev',
        data: {
          device_id: device_id
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
          console.log('总控后台绑定设备返回')
          console.log(res)
          if (res.data.code == 200) {
            //子后台绑定设备
            that.Binding1();
          } else {
            wx.showModal({ title: '提示', content: res.data.msg, showCancel: false, success: function (res) { } })
            // wx.showToast({
            //   title: res.data.msg,
            //   icon: 'loading',
            //   duration: 1000
            // })
          }
        }
      });
    } else {
      wx.showToast({
        title: '请完善信息',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  // 子后台绑定设备
  Binding1: function() {
    let that = this;
    wx.request({
      url: app.globalData.https + '/device/select_device',
      data: {
        device_id: device_id,
        stu_number: stu_number,
        user_openid: app.globalData.opnID,
        picture: that.pictureList[that.pictureIndex].picture
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(ret) {
        console.log('子后台绑定设备返回')
        console.log(ret)
        if (ret.data.sucesss) {
          wx.showToast({
            title: '绑定成功！',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            wx.navigateBack({ delta: 1})
          }, 1500)
        } else {
          // 总控后台移除设备
          that.Remove(true);
          wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) { } })
          // wx.showToast({
          //   title: ret.data.error,
          //   icon: 'loading',
          //   duration: 1000
          // })
        }
      }
    });

  },
  // 总控后台移除设备
  Remove: function(state) {
    let that = this;
    wx.request({
      url: app.globalData.https1 + '/device/update_status0?device_id=' + device_id,
      method: 'post',
      success: function (res) {
        console.log('总控后台移除设备返回')
        console.log(res)
        if (res.data.code == 200) {
          if (!state){
            wx.showToast({
              title: '解除成功！',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({})
            }, 1500)
          }
        } else {
          wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) { } })
          // wx.showToast({
          //   title: res.data.error,
          //   icon: 'loading',
          //   duration: 1000
          // })
        }
      }
    });
  },
  // 子后台移除设备
  Remove1: function() {
    let that = this;
    wx.request({
      url: app.globalData.https + '/device/delete_dev?device_id=' + device_id,
      method: 'post',
      success: function (res) {
        console.log('子后台移除设备返回')
        console.log(res)
        if (res.data.sucesss) {
          // 总控后台移除设备
          that.Remove();
        } else {
          wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) { } })
          // wx.showToast({
          //   title: res.data.error,
          //   icon: 'loading',
          //   duration: 1000
          // })
        }
      }
    });
  },
  // 删除设备
  Detele: function() {

  }
  // // 保存
  // Preservation: function() {
  //   let that = this;
  //   if (device_id && stu_number) {
  //     wx.request({
  //       url: app.globalData.https + '/device/select_device',
  //       data: {
  //         device_id: device_id,
  //         stu_number: stu_number,
  //         user_openid: app.globalData.opnID,
  //         picture: that.pictureList[that.pictureIndex].picture
  //       },
  //       header: {
  //         "content-type": "application/x-www-form-urlencoded"
  //       },
  //       method: 'post',
  //       success: function(res) {
  //         console.log(res)
  //         if (res.data.sucesss) {
  //           wx.showToast({
  //             title: '绑定成功！',
  //             icon: 'loading',
  //             duration: 1000
  //           })
  //           setTimeout(function () { wx.navigateBack({}) }, 1500)
  //         } else {
  //           wx.showToast({
  //             title: res.data.error,
  //             icon: 'loading',
  //             duration: 1000
  //           })
  //         }
  //       }
  //     });
  //   } else {
  //     wx.showToast({
  //       title: '请完善信息',
  //       icon: 'loading',
  //       duration: 1000
  //     })
  //   }

  // },
  // // 删除设备
  // Detele: function() {
  //   let that = this;
  //   wx.request({
  //     url: app.globalData.https + '/device/delete_dev?device_id=' + device_id,
  //     method: 'delete',
  //     success: function(res) {
  //       console.log(res)
  //       if (res.data.sucesss) {
  //         wx.showToast({
  //           title: '解除成功！',
  //           icon: 'success',
  //           duration: 1000
  //         })
  //         setTimeout(function () { wx.navigateBack({ })},1500)
  //       } else {
  //         wx.showToast({
  //           title: res.data.error,
  //           icon: 'loading',
  //           duration: 1000
  //         })
  //       }
  //     }
  //   });
  // }

})