// pages/personal/purchase-service/purchase-service.js
// Page({
//   data: {
//     imgUrls: [
//       '/image/1.jpg',
//       '/image/1.jpg',
//       '/image/1.jpg'
//     ],
//     swiperIndex: 0
//   },
  
// })

const app = getApp();
let order_id;
Page({
  data: {
    navIndex: 0, //导航下标
    goodsList: [] //商品列表
  },
  onLoad: function(options) {
    this.navIndex = 0;
    this.getGoodList();
  },
  onShow: function() {

  },
  // banner滑动
  swiperChange(e) {
    this.navIndex = e.detail.current
    this.setData({
      navIndex: this.navIndex
    })
  },
  // 获取商品列表
  getGoodList: function() {
    let that = this;
    wx.request({
      url: app.globalData.https + '/goods/select_all_goods',
      method: 'get',
      success: function(res) {
        console.log(res)
        if (res.data.data.length > 0) {
          let data = res.data.data,
            nav_array = [],
            goods_array = [];
          for (let i = 0; i < data.length; i++) {
            goods_array[i] = data[i];
            goods_array[i].class = '';
            data[i].priceText = Number(data[i].goods_price).toFixed(2)
          }
          goods_array[0].class = 'this';
          that.goodsList = goods_array
          that.setData({
            goodsList: goods_array
          })
        }
      }
    });
  },
  // 导航事件
  nav: function(e) {
    let data = this.goodsList;
    for (let i = 0; i < data.length; i++){
      data[i].class = '';
      if (i == e.currentTarget.dataset.index) {
        data[i].class = 'this';
      }
    }
    this.goodsList = data;
    this.navIndex = e.currentTarget.dataset.index
    this.setData({
      goodsList: data,
      navIndex: e.currentTarget.dataset.index
    })
  },
  // 立即购买
  purchase: function () {
    let that = this;
    // 生成订单
      wx.showToast({ title: '支付中', icon: 'loading', duration: 10000 })
      wx.request({
        url: app.globalData.https + '/order/insert_order',
        data: {
          goods_id: that.goodsList[that.navIndex].goods_id,
          user_openid: app.globalData.opnID
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res_) {
          console.log(res_)
          if (res_.data.sucesss) {
            order_id = res_.data.sucesss;
            // 微信支付
            wx.request({
              url: app.globalData.https + '/pay/get_open_payid',
              data: {
                order_id: order_id,
                openid: app.globalData.opnID
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'post',
              success: function (res) {
                console.log(res)
                if (res.data.result) {
                  // 调用微信密码支付
                  wx.requestPayment({
                    "timeStamp": res.data.result.timeStamp,
                    "nonceStr": res.data.result.nonceStr,
                    "package": "prepay_id=" + res.data.result.prepay_id,
                    "signType": "MD5",
                    "paySign": res.data.result.paySign,
                    "success": function (res) {
                      app.getMemberTime();//重新获取会员信息
                      console.log('支付成功返回')
                      wx.showToast({ title: '购买成功', icon: 'success', duration: 1000 })
                      setTimeout(function () { 
                        wx.navigateBack({});//返回
                         }, 1500)
                    },
                    "fail": function (err) {
                      console.log('支付失败返回')
                      console.log(err)
                      that.delorder();
                    }

                  })
                } else {
                  that.delorder();
                }
              }
            });
          }else{
            wx.hideToast();
            wx.showModal({ title: '提示', content: res_.data.error, showCancel: false, success: function (res) { if (res.confirm) { } } })
          }
        }
      });
  },
  // 删除订单
  delorder: function () {
    wx.request({
      url: app.globalData.https + '/order/detele_order?order_id=' + order_id,
      method: 'delete',
      success: function (res) {
        console.log(res)
        if (res.data.sucesss) {
          console.log('删除订单成功')
          wx.showToast({ title: '购买失败', icon: 'success', duration: 1000 })
        }
      }
    });
  },
  // 跳转账单详情
  toRecord: function(){
    wx.navigateTo({
      url: '../record/record'
    })
  },
  // 显示定位器页面小程序码
  toBuyGPS: function() {
    console.log('跳转购买定位器')
    let that = this
    wx.previewImage({
      urls: ['http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153293378936863.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDTpDTZdLR8g32yoCPbz6EG9QdkvU2NySv%26q-sign-time%3D1532933789%3B1534812184%26q-key-time%3D1532933789%3B1534812184%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D559690244a04c1aceb45adf95245eb0aa6d04144'] // 需要预览的图片http链接列表
    })
  }
})