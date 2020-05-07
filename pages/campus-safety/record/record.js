// pages/campus-safety/record/record.js
const app = getApp();
let lock = true, start = 1, stu_number, device_id;
Page({

  data: {
    recordsList: [],
    trajectoryList:[],
    tabClasss: ["text-select", ""],
    tabtype: 0
  },
  onLoad: function (options) {
    lock = true
    start = 1
    this.recordsList = []
    this.trajectoryList = []
    console.log('传过来的值')
    console.log(options)
    stu_number = options.stu_number
    device_id = options.device_id
    this.getRecords();
    this.getTrajectory();
  },
  onShow: function () {
  
  },
  //点击导航
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    if ( index == 0) {//校园信息

    }else{//轨迹

    }
    console.log(index)
    var classs = ["",""]
    classs[index] = "text-select"
    this.tabtype = index
    this.setData({ tabClasss: classs, tabtype: index})

  },
  // 打开微信内置地图
  openLocation: function(e){
    console.log(e)
    wx.showModal({
      title: '提示', content: '是否打开微信地图查看位置信息', success: function (res) {
        if (res.confirm) {
          wx.openLocation({
            latitude: e.currentTarget.dataset.data.lat,
            longitude: e.currentTarget.dataset.data.lag,
            // name:
            address: e.currentTarget.dataset.data.address,
            scale: 28
          })
        }
      }
    })
   
  },
  // 获取校园信息列表
  getRecords: function (){
    let that = this;
    wx.request({
      url: app.globalData.https + '/security/select_school',
      data:{
        user_openid: app.globalData.opnID,
        stu_number: stu_number
      },
      method: 'get',
      success: function (res) {
        console.log('校园信息列表')
        console.log(res)
        if (res.data.data) {
          for(let i = 0; i < res.data.data.length; i++){
            res.data.data[i].date = res.data.data[i].imex_time.slice(5, 10)
            res.data.data[i].time = res.data.data[i].imex_time.slice(11, 16)
          }
          that.recordsList = res.data.data;
          that.setData({
            recordsList: res.data.data
          })
        }
      }
    });
  },
  // 获取轨迹列表
  getTrajectory: function () {
    let that = this;
    if (device_id != 'null') {//有定位器
      if (lock) {
        lock = false
        wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 })
        wx.request({
          url: app.globalData.https1 + '/device/select_adress',
          data: {
            start: start,
            device_id: device_id
          },
          method: 'get',
          success: function (res) {
            console.log('定位轨迹列表')
            console.log(res)
            wx.hideToast({})
            if (res.data.data) {
              if (res.data.data.length == 50) {
                start++;
                lock = true
              }

              let data = that.trajectoryList
              for (let i = 0; i < res.data.data.length; i++) {
                // res.data.data[i].date = app.conversionDate(res.data.data[i].cteation_time)//日期转换
                // res.data.data[i].time = app.conversionTime(res.data.data[i].cteation_time)//时间转换
                res.data.data[i].date = res.data.data[i].cteation_time.slice(5, 10)
                res.data.data[i].time = res.data.data[i].cteation_time.slice(11, 16)
                console.log(res.data.data[i].location_time)
                console.log(res.data.data[i].date + '----------' + res.data.data[i].time)
                if (res.data.data[i].address) {
                  // res.data.data[i].addressText = res.data.data[i].address.split(";")[0].replace('市', '*').split("*")[1]
                  res.data.data[i].addressText = res.data.data[i].address.split(";")[0]
                }
                data[data.length] = res.data.data[i]
              }

              that.trajectoryList = data;
              that.setData({
                trajectoryList: data
              })
            }
          }
        });
      }
    }else{
      console.log('该学生没有设备')
    }
    
  },
  // 去提交formID
  getFormID: function (e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },
})