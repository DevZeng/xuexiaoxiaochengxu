
const app = getApp()
Page({
  data: {
  list:[],
  page:1
  },
  onLoad: function (options) {
    this.getExamine();
  },
  onShow: function () {
  
  },
  // 获取家长审核列表
  getExamine: function(){
    let that = this;
    wx.request({
      url: app.globalData.host + '/my/students',
      data:{
        token: wx.getStorageSync('token'),
        state:2,
        page:1
      },
      method: 'get',
      success: function (res) {
        console.log('家长审核列表返回')
        console.log(res)
        if (res.data.data) {
          that.list = res.data.data.data;
          that.setData({
            list: res.data.data.data
          })
        }
      }
    });
  },
  // 查看家长的信息
 toFamilyDetails: function(e){
   console.log('跳转家长信息页')
   console.log(e.currentTarget.dataset.value)
   let data = e.currentTarget.dataset.value
   data.relation = e.currentTarget.dataset.relation
  //  return;
   wx.navigateTo({
     url: '../family-details/family-details?data=' + JSON.stringify(data)
   })
 }, 
 // 查看孩子的信息
 toChildrenDetails: function (e) {
   console.log('跳转学生信息页')
   console.log(e.currentTarget.dataset.stu_number)
  //  return;
   wx.navigateTo({
     url: '../children-details/children-details?stu_number=' + e.currentTarget.dataset.stu_number
   })
 }, 
  // 去审核
  toExamine: function(e){
    let that = this;
    wx.showModal({
      title: '审核提示', 
      content: '是否通过该家长的申请？', 
      cancelText: '不通过',
      confirmText: '通过',
      success: function (res) { 
        if (res.confirm) {
          that.throughAudit(e.currentTarget.dataset.value)
        } else if (res.cancel) {
          that.NotThroughAudit(e.currentTarget.dataset.value)
        }
      }
    })
  },
  // 通过审核
  throughAudit: function (id){
    let that = this;
    console.log(id)
    wx.request({
      url: app.globalData.host + '/pass/user/student',
      data:{
        token: wx.getStorageSync('token'),
        state: 3,
        id:id
      },
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('通过审核返回')
        console.log(res)
        if (res.statusCode==200) {
          wx.showToast({ title: '操作成功', icon: 'success', duration: 1000 })
          that.getExamine();
        } else {
          // wx.showModal({ title: '提示', content: res.data.sucesss, showCancel: false, success: function (res) { if (res.confirm) {  })
        }
      }
    });
  },
  // 不通过审核
  NotThroughAudit: function (id) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/pass/user/student',
      data: {
        token: wx.getStorageSync('token'),
        state: 4,
        id:id
      },
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('不通过审核返回')
        console.log(res)
        if (res.statusCode==200) {
          wx.showToast({ title: '操作成功', icon: 'success', duration: 1000 })
          that.getExamine();
        }
        //  else {
        //   wx.showToast({ title: res.data.error, icon: 'success', duration: 1000 })
        // }
      }
    });
  }

})