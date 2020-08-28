var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 购买服务
    page: 1,
    pageSize: 10,
    navIndex: 0, // nav下标
    user_id: null,
    areas_id: null,
    product_id: null,
    address_id: null,
    price: null,
    serviceList: [],
    serviceIndex: 0,
    order_id: null,
    globalShow: null,

    childList: [], // 学校列表
    is_child: '',
    child: '',
    student_id: '',
    school_id: ''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id: options.user_id
    })
    this.getChildrenList();
  },

  // 获取我的孩子列表
  getChildrenList: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/user/student?token=' + wx.getStorageSync('token'),
      data: {
        mode: 2
      },
      method: 'get',
      success: function (res) {
        if (res.statusCode == 200) {
          let data = res.data.data;
          console.log(11, data)
          that.setData({
            childList: data,
            child: data[0].name,
            student_id: data[0].id,
            school_id: data[0].school_id
          })
          that.getGoodsList();
        }
      }
    });
  },

  // 孩子选择
  childChange(e) {
    console.log(e)
    this.setData({
      is_child: e.detail.value,
      child: ''
    })
    this.data.student_id = this.data.childList[e.detail.value].id;
    this.data.school_id = this.data.childList[e.detail.value].school_id;
    this.getGoodsList();

  },

  // 跳转账单明细
  toBill() {
    var self = this;
    wx.navigateTo({
      url: '../record/record'
    })
  },



  // 获取服务
  getGoodsList() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/products?token=' + wx.getStorageSync('token'),
      data: {
        school: self.data.school_id
      },
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          var res = res.data.data
          self.setData({
            goodsList: res.data,
            price: res.data[0].price,
            serviceList: res.data[0].service,
            product_id: res.data[0].id,
          })
        }
      }
    })
  },

  // 支付
  purchase() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/product/order?token=' + wx.getStorageSync('token'),
      data: {
        school_id: self.data.school_id,
        user_id: self.data.user_id,
        product_id: self.data.product_id,
        student_id: self.data.student_id,
        price: self.data.price
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.data > 0) {
            var order_id = res.data.data;
            wx.request({
              url: app.globalData.host + '/buy/product?token=' + wx.getStorageSync('token'),
              data: {
                order_id: order_id
              },
              method: 'POST',
              success: function (res) {
                if (res.statusCode == 200) {
                  wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: 'MD5',
                    paySign: res.data.data.paySign,
                    success(res) {
                      console.log(111, res);
                      wx.showToast({
                        icon: "none",
                        title: '购买成功'
                      });
                      setTimeout(function () {
                        wx.switchTab({
                          url: '/pages/personal/index/index',
                        })
                      }, 1500)
                    },
                    fail(res) {
                      console.log(222, res);
                      wx.request({
                        url: app.globalData.host + '/pay/cancel?token=' + wx.getStorageSync('token'),
                        data: {
                          order_id: order_id
                        },
                        method: 'POST',
                        success: function (res) {
                          if (res.statusCode == 200) {
                            console.log('取消支付', res);
                            if (res.data.data > 0) {
                              wx.showToast({
                                icon: "none",
                                title: '订单已取消'
                              });
                            }
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  // 点击事件-商品nav
  nav(e) {
    var self = this;
    console.log('点击事件-商品nav', e);
    self.setData({
      navIndex: e.currentTarget.dataset.index
    })
    // 根据商品获取包含的服务
    wx.request({
      url: app.globalData.host + '/products?token=' + wx.getStorageSync('token'),
      data: {
        school: self.data.school_id
      },
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          var res = res.data.data
          self.setData({
            goodsList: res.data,
            serviceList: res.data[self.data.navIndex].service,
            product_id: res.data[self.data.navIndex].id,
            price: res.data[self.data.navIndex].price
          })
        }
      }
    })
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