// pages/campus-safety/record/record.js
const app = getApp();
let lock = true,
  lock1 = true;
Page({

  data: {
    postList: [],
    commenList: [],
    tabClasss: ["text-select", ""],
    tabtype: 0
  },
  onLoad: function(options) {
    lock = true
    this.getCommen();
  },
  onShow: function () {
    lock1 = true
    this.getPost(true);

  },
  //点击导航
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index
    if (index == 0) { //我的帖子

    } else { //我的评论

    }
    console.log(index)
    var classs = ["", ""]
    classs[index] = "text-select"
    this.tabtype = index
    this.setData({
      tabClasss: classs,
      tabtype: index
    })
  },
  // 获取我的贴子列表
  getPost: function(type) {
    let that = this,
      num = 1;
    if (lock1) {
      lock1 = false
      if (that.commenList) {
        num = Math.ceil(that.commenList.length / 10) + 1
      }
      if (type){
        num = 1;
      }
      wx.request({
        url: app.globalData.https + '/aummi/select_user_aumni',
        data: {
          user_openid: app.globalData.userInfo.user_openid,
          start: num
        },
        method: 'get',
        success: function(res) {
          console.log('我的帖子列表')
          console.log(res)
          if (res.data.code == 200) {
            lock1 = true;
            if (res.data.data.length != 10) {
              console.log('返回的数据少于十条,滑动无法再继续请求')
              lock1 = false;
            }
            if (that.postList) { //原来有数据
              let str1 = that.postList;
              let str2 = res.data.data;
              if (type) {
                str1 = []
              }
              for (let i = 0; i < str2.length; i++) {
                str2[i].images = str2[i].images.split(",")
                str1.push(str2[i]);
              }
              console.log('赋值了')
              that.postList = str1;
              that.setData({
                postList: str1
              })
            } else {
              for (let i = 0; i < res.data.data.length; i++) {
                res.data.data[i].images = res.data.data[i].images.split(",")
              }
              that.postList = res.data.data;
              that.setData({
                postList: res.data.data
              })
            }
          }
        }
      });
    }
  },
  // 获取我的评论列表
  getCommen: function() {
    let that = this,
      num = 1;
    if (lock) {
      lock = false
      if (that.commenList) {
        num = Math.ceil(that.commenList.length / 10) + 1
      }
      wx.request({
        url: app.globalData.https + '/aummi/select_user_p',
        data: {
          user_openid: app.globalData.userInfo.user_openid,
          start: num
        },
        method: 'get',
        success: function(res) {
          console.log('我的评论列表')
          console.log(res)
          if (res.data.code == 200) {
            lock = true;
            if (res.data.data.length != 10) {
              console.log('返回的数据少于十条,滑动无法再继续请求')
              lock = false;
            }
            if (that.commenList) { //原来有数据
              let str1 = that.commenList;
              let str2 = res.data.data;
              // 预防最后一页和最后一页的下一页数据相同时数据重复加载
              if (str1[str1.length - 1].p_id == str2[str2.length - 1].p_id) {
                return;
              }
              for (let i = 0; i < str2.length; i++) {
                str1.push(str2[i]);
              }
              console.log('赋值了')
              that.commenList = str1;
              that.setData({
                commenList: str1
              })
            } else {
              that.commenList = res.data.data;
              that.setData({
                commenList: res.data.data
              })
            }
          }
        }
      });
    }
  },
  // 删除帖子
  deletePost: function(e) {
    let id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      that = this;
    wx.showModal({
      title: '提示', content: '是否确定删除该帖子？', success: function (res) {
        if (res.confirm) {
          console.log('111111')
          wx.request({
            url: app.globalData.https + '/aummi/delete_aumni/' + id,
            method: 'delete',
            success: function (res) {
              console.log('删除帖子返回')
              console.log(res)
              if (res.data.code == 200) {
                lock1 = true
                that.getPost(true)
                wx.showToast({ title: '删除成功！', icon: 'success', duration: 1000 })
              }
            }
          });
        }
      }
    })
   
  },
  // 跳转发布帖子页面
  toPost: function() {
    wx.navigateTo({
      url: '../../schoolfellow-circle/edit/edit'
    })
  },
  // 跳转帖子详情页
  toDetails: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../schoolfellow-circle/details/details?id=' + JSON.stringify(e.currentTarget.dataset.id)
    })
  },
  // 去提交formID
  getFormID: function(e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },
})