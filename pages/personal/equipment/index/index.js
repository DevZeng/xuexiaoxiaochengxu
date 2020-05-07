// pages/personal/children/index/index.js
const app = getApp()
Page({
  data: {
    equipmentList:[]
  },
  onLoad: function (options) {
    wx.showToast({ title: '加载中', icon: 'loading', duration: 1000 })

  },
  onShow: function () {
    this.getEquipmentList();
  },
  // 获取我的设备列表
  getEquipmentList: function(){
    let that = this;
    wx.request({
      url: app.globalData.https + '/device/select_all_dev',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function (res) {
        console.log('我的设备列表返回')
        console.log(res)
        wx.hideToast()
        console.log(res.data.data)
        if (res.data.data) {
          if(res.data.data.length > 0){
            that.equipmentList = res.data.data;
            that.setData({
              equipmentList: res.data.data
            })
            // 获取设备信息
            let num = 0;
            for (let i = 0; i < res.data.data.length; i++) {
              (function (j) {
                wx.request({
                  url: app.globalData.https1 + '/device/select_securty',
                  data: {
                    device_id: res.data.data[j].device_id
                  },
                  method: 'get',
                  success: function (ret) {
                    num++;
                    console.log('设备信息')
                    console.log(ret)
                    if (ret.data.data) {
                      res.data.data[j].device_battery = ret.data.data.battery
                    }
                    if (num == res.data.data.length) {//最后一个请求
                      console.log('最后一个请求')
                      that.equipmentList = res.data.data;
                      that.setData({
                        equipmentList: res.data.data
                      })
                    }
                  }
                });
              }(i))
            }
          } else {
            that.equipmentList = [];
            that.setData({
              equipmentList: []
            })
          }
        }
      }
    });
  },
  // 获取设备信息
  getEquipmentInfo: function () {
    let that = this;
    
  },
  // 跳转详情（添加）
  toDetails: function (e) {
    console.log('1111111111111111')
    console.log(e.currentTarget.dataset.value)
    if (e.currentTarget.dataset.value) {//查看设备详情
      let data = JSON.stringify(e.currentTarget.dataset.value).replace(/[?]/g, '*').replace(/[=]/g, '~');
      console.log(JSON.parse(data))
      wx.navigateTo({
        url: '../details/details?data=' + data
      })
    } else {//添加设备
      wx.navigateTo({
        url: '../details/details'
      })
    }
  }
})