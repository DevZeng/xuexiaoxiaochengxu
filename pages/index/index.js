//index.js
//获取应用实例
const app = getApp();
let lock = true,
  num, totle;
Page({
  data: {
    banner: [], //轮播图
    classFication: [], //分类列表
    information: [], //资讯列表
    schoolList: [], // 学校列表
    is_school: '',
    school: ''
  },
  onLoad: function (options) {
    // this.getSchool();

    console.log(options)
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    this.information = []
    // this.getBanner();
    // this.getClassFication();
    if (options.invite) {
      wx.showModal({
        title: "提示",
        content: "是否接受邀请",
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.host + '/accept/invite',
              method: 'POST',
              data: {
                token: wx.getStorageSync('token'),
                invite: options.invite
              },
              success: (res) => {
                console.log(res)
                if (res.statusCode == 200) {
                  wx.showToast({
                    title: '已接受',
                    duration: 1000
                  })
                } else {
                  wx.showToast({
                    title: '系统异常',
                    duration: 1000
                  })
                }
              }
            })
          }
        }
      })
    }


  },
  onShow: function () {
    this.getSchool();

    lock = true;
    this.information = []
    // this.getInformation();
  },
  //滚动监听
  scroll: function (e) {
    // if (lock) {
    //   lock = !lock;
    //   wx.showToast({ title: '加载中', icon: 'loading' })
    // this.getInformation();
    // }
  },
  // 获取轮播图
  getBanner: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/banners?token=' + wx.getStorageSync('token'),
      method: 'get',
      success: function (res) {
        console.log('首页轮播图列表')
        if (res.data) {
          that.banner = res.data.data.data;
          that.setData({
            banner: res.data.data.data
          })
        }
      }
    });
  },
  // 获取资讯分类
  getClassFication: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/document/types?token=' + wx.getStorageSync('token'),
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.data) {
          that.classFication = res.data.data.data;
          that.setData({
            classFication: res.data.data.data
          })
        }
      }
    });
  },
  // 获取资讯列表
  getInformation: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this,
      num = 1;
    if (that.information) {
      num = Math.ceil(that.information.length / 10) + 1
      console.log(that.information.length)
    }
    console.log('去获取资讯')
    console.log('页码' + num)
    wx.request({
      url: app.globalData.host + '/documents?token=' + wx.getStorageSync('token'),
      data: {
        page: num
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log('资讯列表返回')
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data.data;
          console.log('test')
          console.log(data)
          that.setData({
            information: data
          })
        }
      }
    });
  },
  // 去提交formID
  getFormID: function (e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },

  // 跳转分类
  openClassification: function (e) {
    console.log(e)
    setTimeout(function () {
      wx.navigateTo({
        url: '../campus-information/classification/classification?class_id=' + e.currentTarget.dataset.id
      })
    }, 100)
  },
  // 跳转资讯详情
  openDetals: function (e) {
    // 静态设置浏览量
    let index = e.currentTarget.dataset.index,
      data = this.information
    //data[index].details_browse = Number(data[index].details_browse) + 1
    // data[index].details_browse = 1
    console.log(e.currentTarget.dataset.id)
    this.information = data
    this.setData({
      information: data
    })
    wx.navigateTo({
      url: '../campus-information/details/details?details_id=' + e.currentTarget.dataset.id
    })
  },
  // 分享转发
  onShareAppMessage: function () {
    return {
      title: "图巴诺校园风采",
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544844868129.jpg"
    }
  },

  // 获取学校列表
  getSchool(e) {
    let that = this;
    if (!wx.getStorageSync('token')) {
      // 轮播图
      wx.request({
        url: app.globalData.host + '/banners?token=' + wx.getStorageSync('token'),
        // data: {
        //   school_id: that.data.schoolList[0].id
        // },
        method: 'get',
        success: function (res) {
          wx.hideToast()
          console.log('资讯列表返回')
          console.log(res)
          if (res.statusCode == 200) {
            let data = res.data.data.data;
            console.log(res.data.data)
            that.setData({
              banner: data
            })
          }
        }
      });
      // 资讯分类
      wx.request({
        url: app.globalData.host + '/document/types?token=' + wx.getStorageSync('token'),
        // data: {
        //   school_id: that.data.schoolList[0].id
        // },
        method: 'get',
        success: function (res) {
          wx.hideToast()
          console.log('资讯列表返回')
          console.log(res)
          if (res.statusCode == 200) {
            that.classFication = res.data.data.data;
            that.setData({
              classFication: res.data.data.data
            })
          }
        }
      });
      // 资讯列表
      wx.request({
        url: app.globalData.host + '/documents?token=' + wx.getStorageSync('token'),
        // data: {
        //   page: 1,
        //   school_id: that.data.schoolList[0].id
        // },
        method: 'get',
        success: function (res) {
          wx.hideToast()
          if (res.statusCode == 200) {
            let data = res.data.data.data;
            that.setData({
              information: data
            })
          }
        }
      });
    } else {
      wx.request({
        url: app.globalData.host + '/user/schools?token=' + wx.getStorageSync('token'),
        data: {},
        method: 'get',
        success: function (res) {
          wx.hideToast()
          console.log('资讯列表返回')
          
          console.log(res)
          if (res.statusCode == 200) {
            let data = res.data.data;
            console.log(11, data)
            that.setData({
              schoolList: data,
              school: data[0].name
            })
            if (data.length > 0) {
              // 轮播图
              wx.request({
                url: app.globalData.host + '/banners?token=' + wx.getStorageSync('token'),
                data: {
                  school_id: that.data.schoolList[0].id
                },
                method: 'get',
                success: function (res) {
                  wx.hideToast()
                  console.log('资讯列表返回')
                  console.log(res)
                  if (res.statusCode == 200) {
                    let data = res.data.data.data;
                    console.log(res.data.data)
                    that.setData({
                      banner: data
                    })

                  }
                }
              });
              // 资讯分类
              wx.request({
                url: app.globalData.host + '/document/types?token=' + wx.getStorageSync('token'),
                data: {
                  school_id: that.data.schoolList[0].id
                },
                method: 'get',
                success: function (res) {
                  wx.hideToast()
                  console.log('资讯列表返回')
                  console.log(res)
                  if (res.statusCode == 200) {
                    that.classFication = res.data.data.data;
                    that.setData({
                      classFication: res.data.data.data
                    })
                  }
                }
              });
              // 资讯列表
              wx.request({
                url: app.globalData.host + '/documents?token=' + wx.getStorageSync('token'),
                data: {
                  page: 1,
                  school_id: that.data.schoolList[0].id
                },
                method: 'get',
                success: function (res) {
                  wx.hideToast()
                  if (res.statusCode == 200) {
                    let data = res.data.data.data;
                    that.setData({
                      information: data
                    })
                  }
                }
              });
            } else {
              // 轮播图
              wx.request({
                url: app.globalData.host + '/banners?token=' + wx.getStorageSync('token'),
                // data: {
                //   school_id: that.data.schoolList[0].id
                // },
                method: 'get',
                success: function (res) {
                  wx.hideToast()
                  console.log('资讯列表返回')
                  console.log(res)
                  if (res.statusCode == 200) {
                    let data = res.data.data.data;
                    console.log(res.data.data)
                    that.setData({
                      banner: data
                    })
                  }
                }
              });
              // 资讯分类
              wx.request({
                url: app.globalData.host + '/document/types?token=' + wx.getStorageSync('token'),
                // data: {
                //   school_id: that.data.schoolList[0].id
                // },
                method: 'get',
                success: function (res) {
                  wx.hideToast()
                  console.log('资讯列表返回')
                  console.log(res)
                  if (res.statusCode == 200) {
                    that.classFication = res.data.data.data;
                    that.setData({
                      classFication: res.data.data.data
                    })
                  }
                }
              });
              // 资讯列表
              wx.request({
                url: app.globalData.host + '/documents?token=' + wx.getStorageSync('token'),
                // data: {
                //   page: 1,
                //   school_id: that.data.schoolList[0].id
                // },
                method: 'get',
                success: function (res) {
                  wx.hideToast()
                  if (res.statusCode == 200) {
                    let data = res.data.data.data;
                    that.setData({
                      information: data
                    })
                  }
                }
              });
            }

          }
        }
      });
    }


  },
  schoolChange(e) {
    console.log(e)
    this.setData({
      is_school: e.detail.value,
      school: ''
    })
    console.log(112, this.data.schoolList[e.detail.value].id)
    this.getSchoolBanner(this.data.schoolList[e.detail.value].id)
    this.getSchoolType(this.data.schoolList[e.detail.value].id)
    this.getSchoolInfomation(this.data.schoolList[e.detail.value].id)


  },

  // 学校轮播图
  getSchoolBanner(val) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/banners?token=' + wx.getStorageSync('token'),
      data: {
        school_id: val
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log('资讯列表返回')
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data.data;
          console.log(res.data.data)
          that.setData({
            banner: data
          })

        }
      }
    });
  },
  // 学校资讯分类
  getSchoolType(val) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/document/types?token=' + wx.getStorageSync('token'),
      data: {
        school_id: val
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log('资讯列表返回')
        console.log(res)
        if (res.statusCode == 200) {
          that.classFication = res.data.data.data;
          that.setData({
            classFication: res.data.data.data
          })
        }
      }
    });
  },

  // 学校资讯分类
  getSchoolInfomation(val) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this,
      num = 1;
    if (that.information) {
      num = Math.ceil(that.information.length / 10) + 1
      console.log(that.information.length)
    }
    console.log('去获取资讯')
    console.log('页码' + num)
    wx.request({
      url: app.globalData.host + '/documents?token=' + wx.getStorageSync('token'),
      data: {
        page: num,
        school_id: val
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.statusCode == 200) {
          let data = res.data.data.data;
          that.setData({
            information: data
          })
        }
      }
    });
  }
})