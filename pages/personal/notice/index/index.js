// pages/personal/family/index/index.js
const app = getApp();
let becomment_image = null, //被评论者头像
  becomment_name = null, //被评论者名字
  becomment_openid = null, //被评论者ID
  imglock = false;//锁，防止预览图片后重复获取公告数据
Page({
  data: {
    class_array: [], //班级列表
    class_index: 0, //选中的班级下标
    notice_array: [], //公告列表
    meassage_list: [], //评论列表
    showInput: false, //是否显示评论输入框
    placeholderText: '', //输入框默认内容
    inputText: '', //输入框内容
    releaseState:false//发布公告按钮
  },
  onLoad: function(options) {
    if (app.globalData.userInfo.whether == 1 && app.globalData.userInfo.status == 2){//身份：已通过审核的班主任
      this.releaseState = true
      this.setData({
        releaseState: true
      })
    }
    this.class_index = 0;
    this.setData({
      class_index: 0
    })
  },
  onShow: function() {
    if (imglock){
      imglock = false;
      return;
    }
    this.getClassList();
  },
  // 年级选择
  classChange: function(e) {
    this.class_index = e.detail.value
    this.meassage_list = []
    this.setData({
      class_index: e.detail.value,
      meassage_list:[]
    })
    // 获取评论
    this.getMassage(this.notice_array[this.class_index].notice_id);
  },
  // 获取公告列表(浏览数、点赞数)
  getClassList: function() {
    let that = this;
    wx.request({
      url: app.globalData.https + '/notice/select_notice',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function (res) {
        console.log('公告列表')
        console.log(res)
        if (res.data.date1.length > 0) {
          let data = res.data.date1,
            class_list = [],
            notice_list = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i]) {
              if (data[i].notice_image){//有图片就显示图片
                data[i].notice_image = data[i].notice_image.split(",")
              }
              notice_list[notice_list.length] = data[i];
              class_list[class_list.length] = data[i].class_grade + '年级' + data[i].class_name;
              // 设置浏览量
              that.setView(data[i].notice_id);
            }
          }
          that.class_array = class_list
          that.notice_array = notice_list
          that.setData({
            class_array: class_list,
            notice_array: notice_list
          })
          // 获取评论
          that.getMassage(that.notice_array[that.class_index].notice_id);
        } else {
          console.log(res.data.error)
        }
      }
    });
  },
  // 获取该公告的评论
  getMassage: function(num) {
    let that = this;
    wx.request({
      url: app.globalData.https + '/notice/select_n_message',
      data: {
        notice_id: num
      },
      method: 'get',
      success: function (res) {
        console.log('公告评论列表')
        console.log(res)
        if (res.data.data) {
          that.meassage_list = res.data.data;
          that.setData({
            meassage_list: res.data.data
          })
        } else {
          that.meassage_list = [];
          that.setData({
            meassage_list: []
          })
        }
      }
    });
  },
  // 评论 || 回复评论
  Comment: function(e) {
    console.log('评论内容：' + e.currentTarget.dataset.value)
    let text = '请输入';
    if (e.currentTarget.dataset.value) { //回复评论
      text = '@ ' + e.currentTarget.dataset.value.comment_name
      becomment_image = e.currentTarget.dataset.value.comment_image; //被评论者头像
      becomment_name = e.currentTarget.dataset.value.comment_name; //被评论者名字
      becomment_openid = e.currentTarget.dataset.value.comment_openid; //被评论者ID
      this.showInput = true;
      this.setData({
        showInput: true
      })
    } else { //评论
      becomment_image = null; //被评论者头像
      becomment_name = null; //被评论者名字
      becomment_openid = null; //被评论者ID
      this.showInput = !this.showInput;
      this.setData({
        showInput: this.showInput
      })
    }

    if (this.showInput) {
      this.showCommentBox(text);
    } else {
      this.hideCommentBox();
    }
  },
  // 显示输入框
  showCommentBox: function(text) {
    this.showInput = true;
    this.placeholderText = text;
    this.inputText = '';
    this.setData({
      showInput: true,
      placeholderText: text,
      inputText: ''
    })
  },
  // 隐藏输入框
  hideCommentBox: function() {
    this.showInput = false;
    this.setData({
      showInput: false
    })
  },
  // 评论内容输出
  message: function(e) {
    console.log(e.detail.value)
    this.inputText = e.detail.value;
  },
  // 发送评论
  sendMessage: function() {
    let that = this;
    
    if (that.inputText){
      wx.request({
        url: app.globalData.https + '/notice/insert_n_message',
        data: {
          becomment_image: becomment_image, //被评论者头像
          becomment_name: becomment_name, //被评论者名字
          becomment_openid: becomment_openid, //被评论者ID
          comment_image: app.globalData.userInfo.user_image, //评论者头像
          comment_name: app.globalData.userInfo.user_alias, //评论者名字
          comment_openid: app.globalData.opnID, //评论者ID
          message: that.inputText, //评论内容
          notice_id: that.notice_array[that.class_index].notice_id //公告ID
        },
        method: 'post',
        success: function (res) {
          console.log('评论返回')
          console.log(res)
          if (res.data.sucesss) {
            console.log('评论成功')
            // 重新获取评论
            that.getMassage(that.notice_array[that.class_index].notice_id);
            // 隐藏输入框
            that.hideCommentBox();
          } else {
            console.log(res.data.error)
            wx.showModal({ title: '提示', content: res.data.error, showCancel: false, success: function (res) {}})
            // wx.showToast({ title: res.data.error, icon: 'loading', duration: 1000 })
          }
        }
      });
    }
  },
  // 设置浏览量
  setView: function (notice_id){
    wx.request({
      url: app.globalData.https + '/notice/upate_notice_view?notice_id=' + notice_id,
      method: 'post',
      success: function (res) {
        console.log('设置浏览量返回')
        console.log(res)}
    });
  },
  // 设置点赞
  setGive: function (e) {
    let that = this,
      data = e.currentTarget.dataset.value;
    console.log(data.notice_id)
    console.log(data.give_status)
    if (data.give_status != 1){
      wx.request({
        url: app.globalData.https + '/notice/update_notice_give',
        data:{
          user_openid: app.globalData.opnID,
          notice_id: data.notice_id
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
          console.log('设置点赞返回')
          console.log(res)
          if (res.data.sucesss) {
            console.log('点赞成功')
            // 点赞数静态 +1
            that.notice_array[that.class_index].notice_give = Number(that.notice_array[that.class_index].notice_give) + 1
            that.notice_array[that.class_index].give_status = 1
            that.setData({
              notice_array: that.notice_array
            })
          }
          
        }
      });
    }
  },
  // 图片展示
  previewImage: function(e) {
    imglock = true
    let that = this,
      index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: that.notice_array[that.class_index].notice_image[index], // 当前显示图片的http链接
      urls: that.notice_array[that.class_index].notice_image // 需要预览的图片http链接列表
    })
  },
  // 去提交formID
  getFormID: function (e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },
  // 跳转发布公告
  toEdit: function() {
    wx.navigateTo({
      url: '../edit/edit'
    })
  }
})