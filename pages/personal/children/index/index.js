const app = getApp();
Page({
  data: {
    childrenList: []
  },
  onLoad: function(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
  },
  onShow: function() {
    this.getChildrenList(); //获取我的孩子的列表
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease',
      backgroundColor: "000"
      // opacity:0
    })
    this.animation = animation
  },
  // 显示和隐藏家庭成员
  change_state: function(e) {
    let that = this,
      list = this.childrenList,
      num = e.currentTarget.dataset.index;
    list[num].family_state = !list[num].family_state;
    if (list[num].family_state) { //显示家庭成员
      // 获取孩子的家庭成员
      wx.request({
        url: app.globalData.https + '/parent/select_parent',
        data: {
          stu_number: list[num].stu_number
        },
        method: 'get',
        success: function(res) {
          console.log('家庭成员列表返回')
          console.log(res)
          if (res.data.data) {
            list[num].family = res.data.data;
            that.childrenList = list
            that.setData({
              childrenList: list
            })
          }
        }
      });
    } else { //隐藏家庭成员
      that.childrenList = list
      that.setData({
        childrenList: list
      })
    }
  },

  // 跳转家长信息页
  toFamily_Details: function(e) {
    console.log(e.currentTarget.dataset)
    let data = e.currentTarget.dataset.value;
    let family = e.currentTarget.dataset.family;
    let stu_number = e.currentTarget.dataset.stu_number;

    if (data.parent_status == 0) { //判断该家长是否审核中（这个函数是2018-8-20加的）
      for (let i = 0; i < family.length; i++) {
        if (family[i].user_openid == app.globalData.userInfo.user_openid && family[i].user_status != 1) { //如果我不是默认家长则不给去审核
          return;
        }
      }
    }
    // 隐藏家庭成员
    let list = this.childrenList
    for (let i = 0; i < list.length; i++) {
      list[i].family_state = false;
    }
    this.childrenList = list
    this.setData({
      childrenList: list
    })
    wx.navigateTo({
      url: '../family-details/family-details?data=' + JSON.stringify(e.currentTarget.dataset.value) + '&stu_number=' + stu_number
    })


  },
  // 跳转孩子信息页
  toChildren_Details: function(e) {
    console.log(e.currentTarget.dataset.value)
    wx.navigateTo({
      url: '../children-details/children-details?stu_number=' + e.currentTarget.dataset.value
    })
  },
  // 跳转搜索添加孩子
  toSearch: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  // 获取我的孩子列表
  getChildrenList: function() {
    let that = this;
    wx.request({
      url: app.globalData.host + '/children',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'get',
      success: function(res) {
        console.log('我的孩子列表返回')
        console.log(res)
        if (res.statusCode==200) {
          let children_list = res.data.data;
          // for (let i = 0; i < children_list.length; i++) {
          //   // 设置隐藏
          //   children_list[i].family_state = false;
          // }
          // console.log(children_list)
          wx.hideToast()
          that.childrenList = children_list;
          that.setData({
            childrenList: children_list
          })
        }
      }
    });
  }
})