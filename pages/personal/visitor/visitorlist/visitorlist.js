// pages/personal/visitor/visitorlist/visitorlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitors:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVisitors()
  },
  getVisitors:function(){
    wx.request({
      url: app.globalData.host+'/visitors',
      method:'GET',
      data:{
        limit:1000,
        token:wx.getStorageSync('token')
      },
      success:(res)=>{
        if(res.statusCode==200){
          this.setData({
            visitors:res.data.data.data
          })
        }
      }
    })
  },
  toDetail:function(e){
    wx.navigateTo({
      url: '../visitordetail/visitordetail?id=' + e.currentTarget.dataset.id
    })
    console.log(e)
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
    this.getVisitors()
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