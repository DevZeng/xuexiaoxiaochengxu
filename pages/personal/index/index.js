//index.js
//获取应用实例
const app = getApp()
const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig; //匹配emoji表情正则
Page({
  data: {
    showFace: false,
    userInfo: null,
    memberTime: null,
    notice_childList: null,
    class_id: null,
    childList: [], // 服务列表
    school_id: '',
    showBuy: false,
    user_id: '',
  },
  onLoad: function () {
    if (wx.getStorageSync('token')) {
      this.getSchool();
      this.getChildrenList();
    }
  },
  onShow: function () {
    // 个人信息
    this.getMyinfo()
    this.getNoticeChild()
    this.getService()
  },
  getSchool() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/user/schools?token=' + wx.getStorageSync('token'),
      data: {},
      method: 'get',
      success: function (res) {
        let data = res.data.data;
        data.forEach(item => {
          if (item.mode == 2) {
            self.setData({
              showBuy: true
            })
          }
        })
      }
    })
  },
  getMyinfo: function () {
    console.log('getMyinfo');
    wx.request({
      url: app.globalData.host + '/user/info?token=' + wx.getStorageSync('token'),
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          this.setData({
            userInfo: res.data.data,
            class_id: res.data.data.class_id,
            user_id: res.data.data.user_id
          })
          this.getSchool()
        } else {
          this.setData({
            userInfo: null
          })
        }
      }
    })
  },
  getNoticeChild() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/user/student?token=' + wx.getStorageSync('token'),
      method: 'GET',
      success: function (res) {
        self.setData({
          notice_childList: res.data.data
        })
      }
    })
  },
  // 获取微信信息授权
  getUserInfo: function (e) {
    let that = this,
      u_info = e.detail.userInfo; //用户信息-从微信中获取
    wx.login({
      success: (res) => {
        if (res.code) {
          let code = res.code;
          wx.getUserInfo({
            success: (res) => {
              console.log(res.encryptedData);
              console.log(res.iv);
              wx.request({
                url: app.globalData.host + '/login',
                method: 'POST',
                data: {
                  'code': code,
                  'iv': res.iv,
                  'encryptedData': res.encryptedData
                },
                success(res) {
                  if (res.statusCode == 200) {
                    var data = res.data.data;
                    wx.setStorage({
                      data: data.token,
                      key: 'token',
                      complete: (res) => {},
                      fail: (res) => {},
                      success: (res) => {},
                    });
                    app.globalData.userInfo = data.user
                    that.setData({
                      userInfo: data.user
                    })
                    that.getNoticeChild()
                    that.getSchool();
                    that.getChildrenList();
                    that.getService()
                  } else {
                    that.setData({
                      userInfo: {}
                    })
                  }
                },
                fail: (res) => {
                  that.setData({
                    userInfo: {}
                  })
                }
              })
            },
          })
        }
      },
    })
    if (u_info) { //已授权获取信息
      // wx.navigateTo({
      //   url: '../information/information?u_info=' + JSON.stringify(u_info)
      // })
      // 普通用户注册
      console.log(app.globalData.opnID)
      console.log(u_info.gender)
      console.log(u_info.nickName)
      console.log(u_info.avatarUrl)

      u_info.nickName = u_info.nickName.replace(regStr, ""); //过滤emoji表情
      wx.request({
        url: app.globalData.https + '/user/insert_user',
        data: {
          user_openid: app.globalData.opnID,
          user_sex: u_info.gender,
          user_alias: u_info.nickName,
          user_image: u_info.avatarUrl
        },
        method: 'post',
        success: function (res) {
          console.log('普通注册返回')
          console.log(res)
          app.getUserinfo(function (info) {
            console.log('用户信息')
            console.log(info)
            if (info) {
              that.userInfo = info;
              that.setData({
                userInfo: info
              });
            }
          })
        }
      });
    }
  },
  // 跳转个人信息页
  openInformation: function () {
    let that = this;
    wx.navigateTo({
      url: '../information/information'
    })
  },
  // 跳转我的孩子页
  openChildren: function () {
    let that = this;
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '../children/index/index'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
    if (!this.data.userInfo.phone) {
      wx.showModal({
        title: '提示',
        content: "请先完善个人信息"
      })
      return;
    }
  },
  // 跳转家庭成员页
  // openFamily: function () {
  //   let that = this;
  //   app.getLogintype(function (type) {
  //     if (type.user_card) {
  //       wx.navigateTo({
  //         url: '../family/index/index'
  //       })
  //     } else {
  //       wx.showModal({
  //         title: '提示', content: '请补充完整注册信息', success: function (res) {
  //           if (res.confirm) {
  //             that.openInformation();
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  // 跳转公告信息页
  openNtice: function () {
    let that = this;
    wx.navigateTo({
      url: '../notice/index/index'
    })
    app.getLogintype(function (type) {
      if (type.user_card) {

      } else {
        wx.showModal({
          title: '提示',
          content: '请补充完整注册信息',
          success: function (res) {
            if (res.confirm) {
              that.openInformation();
            }
          }
        })
      }
    })
  },
  // 跳转发帖及记录页
  openPostRecord: function () {
    let that = this;
    app.getLogintype(function (type) {
      if (type.user_card) {
        wx.navigateTo({
          url: '../post-record/post-record'
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请补充完整注册信息',
          success: function (res) {
            if (res.confirm) {
              that.openInformation();
            }
          }
        })
      }
    })
  },
  // 跳转班级管理页
  openClassManagement: function () {
    let that = this;
    wx.navigateTo({
      url: '../class-management/index/index?class_id=' + that.data.class_id
    })
  },
  // 跳转班级公告
  openClassNotice() {
    let that = this;
    wx.navigateTo({
      url: '../class-management/notice/notice-child/notice-child'
    })
  },
  // 跳转购买服务页
  openPurchaseService: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/forbidden/products?token=' + wx.getStorageSync('token'),
      method: 'get',
      data: {
        school_id: that.data.school_id
      },
      success: function (res) {
        if (res.data.data == 2) {
          wx.navigateTo({
            url: '../purchase-service/index/index?user_id=' + that.data.user_id
          })
        } else {
          wx.showToast({
            title: '您已被禁用购买服务功能',
            icon: 'none'
          })
        }
      }
    })

    // wx.showToast({
    //   title: '暂不开放！',
    //   icon: 'fail',
    //   duration: 1500
    // })
    // return;
    // let that = this;
    // app.getLogintype(function (type) {
    //   if (type.user_card) {
    //     wx.navigateTo({
    //       url: '../purchase-service/index/index'
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请补充完整注册信息',
    //       success: function (res) {
    //         if (res.confirm) {
    //           that.openInformation();
    //         }
    //       }
    //     })
    //   }
    // })
  },
  // 跳转我的设备页
  openEquipment: function () {
    wx.showToast({
      title: '暂不开放！',
      icon: 'fail',
      duration: 1500
    })
    return;
    let that = this;
    app.getLogintype(function (type) {
      if (type.user_card) {
        wx.navigateTo({
          url: '../equipment/index/index'
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请补充完整注册信息',
          success: function (res) {
            if (res.confirm) {
              that.openInformation();
            }
          }
        })
      }
    })
  },
  // 跳转帮助文档页
  openHelpDocument: function () {
    app.getLogintype(function (type) {
      if (type) {
        wx.navigateTo({
          url: '../help-document/index/index'
        })
      }
    })
  },
  // 跳转访客申请
  openFaceApplication: function () {
    wx.navigateTo({
      url: '../visitor/visitor'
    })
  },
  openVisitorList: function () {
    wx.navigateTo({
      url: '../visitor/visitorlist/visitorlist'
    })
  },
  // 跳转学习辅导
  openCoach: function () {
    wx.showToast({
      title: '该功能开发中！',
      icon: 'success',
      duration: 1500
    })
  },
  // 跳转成绩查询
  openInquiry: function () {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '../inquiry/inquiry'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
    
    // wx.showToast({
    //   title: '暂不开放！',
    //   icon: 'fail',
    //   duration: 1500
    // })
    // return app.getLogintype(function (type) {
    //   if (type.user_card) {
    //     wx.navigateTo({
    //       url: '../inquiry/inquiry'
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请补充完整注册信息',
    //       success: function (res) {
    //         if (res.confirm) {
    //           that.openInformation();
    //         }
    //       }
    //     })
    //   }
    // })
  },
  // 获取会员到期时间
  getMemberTime: function () {
    console.log(1)
    let that = this;
    wx.request({
      url: app.globalData.https + '/member/select_member',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.data.result) {
          that.memberTime = res.data.result.use_time;
          that.setData({
            memberTime: res.data.result.use_time
          })
        }
      }
    });
  },
  //公众号绑定
  bindViewTap: function () {
    wx.navigateTo({
      url: '/pages/weixin/gongzonghao/gongzonghao'
    })
  },
  // 去提交formID
  getFormID: function (e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },
  // 分享转发
  onShareAppMessage: function () {
    return {
      title: "图巴诺安全中心",
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544840170971.jpg"
    }
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
            childList: res.data.data,
          })
        }
      }
    });
  },

  // 获取服务信息
  getService() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/user/serves?token=' + wx.getStorageSync('token'),
      method: 'get',
      data: {},
      success: function (res) {
        if (res.statusCode == 200) {
          self.setData({
            serviceList: res.data.data
          })
        }
      }
    })
  },


  childrenChange(e) {
    var self = this;
    wx.navigateTo({
      url: './service-detail/service-detail?student_id=' + self.data.childList[e.detail.value].id
    })
  }

})