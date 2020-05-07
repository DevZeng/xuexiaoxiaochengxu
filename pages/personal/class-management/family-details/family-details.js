
const app = getApp();
Page({
  data: {
  info:[],
  },
  onLoad: function (options) {
    console.log('传过来的信息')
    console.log(JSON.parse(options.data))
    this.info = JSON.parse(options.data)
    this.setData({
      info: JSON.parse(options.data)
    })
  },
  onShow: function () {

  },
 
})