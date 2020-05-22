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
  letout:function(e){
    console.log(e.currentTarget.dataset.value)
    wx.request({
      url: app.globalData.host+'/student/out',
      method:"POST",
      data:{
        token:wx.getStorageSync('token'),
        id: e.currentTarget.dataset.value
      },
      success:(res)=>{
        if(res.statusCode==200){
          wx.showModal({
            title: '提示',
            content: '本次进出权限30分钟后失效',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '系统错误！',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail:(res)=>{
        wx.showModal({
          title: '提示',
          content: '系统错误！',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
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
    console.log(e)
    let that = this,
      list = this.childrenList,
      id =  e.currentTarget.dataset.value,
      num = e.currentTarget.dataset.index;
    list[num].family_state = !list[num].family_state;
    if (list[num].family_state) { //显示家庭成员
      wx.request({
        url: app.globalData.host+'/invite',
        method:'POST',
        data:{
          token:wx.getStorageSync('token'),
          user_student:id,
        },
        success:(res)=>{
          if(res.statusCode==200){
            // invite_id = 
            list[num].invite_id = res.data.data;
            that.childrenList = list
            that.setData({
              childrenList: list
            })
          }else{
            wx.showModal({
              title:'提示',
              content:res.data.msg
            })
          }
          console.log(res)
        },
      })
      // 获取孩子的家庭成员
      // wx.request({
      //   url: app.globalData.https + '/parent/select_parent',
      //   data: {
      //     stu_number: list[num].stu_number
      //   },
      //   method: 'get',
      //   success: function(res) {
      //     console.log('家庭成员列表返回')
      //     console.log(res)
      //     if (res.data.data) {
            // list[num].family = res.data.data;
            
      //     }
      //   }
      // });
    } else { //隐藏家庭成员
      that.childrenList = list
      that.setData({
        childrenList: list
      })
    }
  },

  // 跳转家长信息页
  toFamily_Details: function(e) {
    // console.log(e.currentTarget.dataset)
    // let data = e.currentTarget.dataset.value;
    // let family = e.currentTarget.dataset.family;
    // let stu_number = e.currentTarget.dataset.stu_number;

    // if (data.parent_status == 0) { //判断该家长是否审核中（这个函数是2018-8-20加的）
    //   for (let i = 0; i < family.length; i++) {
    //     if (family[i].user_openid == app.globalData.userInfo.user_openid && family[i].user_status != 1) { //如果我不是默认家长则不给去审核
    //       return;
    //     }
    //   }
    // }
    // // 隐藏家庭成员
    // let list = this.childrenList
    // for (let i = 0; i < list.length; i++) {
    //   list[i].family_state = false;
    // }
    // this.childrenList = list
    // this.setData({
    //   childrenList: list
    // })
    wx.navigateTo({
      url: '../family-details/family-details?data=' + JSON.stringify(e.currentTarget.dataset.value)
    })


  },
  // 跳转孩子信息页
  toChildren_Details: function(e) {
    console.log(e.currentTarget.dataset.value)
    wx.navigateTo({
      url: '../children-details/children-details?stu_number=' + e.currentTarget.dataset.value
    })
  },
  addFamily: function(e) {
    console.log(e.currentTarget.dataset.value)
    
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
      url: app.globalData.host + '/children?type=2',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'get',
      success: function(res) {
        console.log('我的孩子列表返回')
        console.log(res)
        wx.hideToast()
        if (res.statusCode==200) {
          let children_list = res.data.data;
          // for (let i = 0; i < children_list.length; i++) {
          //   // 设置隐藏
          //   children_list[i].family_state = false;
          // }
          // console.log(children_list)
          
          that.childrenList = children_list;
          that.setData({
            childrenList: children_list
          })
        }
        if(res.statusCode==403){
          wx.showToast({
            title: '请先登陆！',
            icon: 'loading',
            mask: true,
            duration: 1000,
            
          })
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateBack()
           }, 1000) //
          console.log('go')
         
        }
        if(res.statusCode==401){
          wx.showToast({
            title: '请先登陆！',
            icon: 'loading',
            mask: true,
            duration: 1000,
            
          })
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateBack()
           }, 1000) //
          console.log('go')
         
        }
      }
    });
  },
  onShareAppMessage:(e)=>{
    console.log(e)
    let invite_id = e.target.dataset.value;
    
    if(invite_id!=0){
      return {
        title:'邀请加入',
        path:'pages/index/index?invite='+invite_id,
        imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544840170971.jpg"
      }
    }else{
      
      wx.showModal({
        title:"提示",
        content:"系统异常！"
      })
      return {
        title: "图巴诺安全中心",
        // cnontent: this.data.summer_theme,
        imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544840170971.jpg"
      }
    }
  }
})