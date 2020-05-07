//index.js
//获取应用实例
const app = getApp();
let lock = true,
  becomment_name = null, //被评论者名字
  becomment_openid = null, //被评论者ID
  id = ''; //帖子ID
Page({
  data: {
    information: '', //帖子列表
    showInput: false, //是否显示评论输入框
    placeholderText: '', //输入框默认内容
    inputText: '', //输入框内容
  },
  onLoad: function(option) {
    console.log(option.id)
    this.getDeteils(option.id)
    return;
    
  },
  onShow: function() {
    lock = true;
  },
  getDeteils: function(id){
    let that = this;
    wx.request({
      url: app.globalData.https + '/aummi/by_aumni?id=' + id,
      method: 'get',
      success: function (res) {
        console.log('帖子内容')
        console.log(res)
        if (res.data.code == 200) {
          // 初始化
          let data = res.data.data,
            thumbsStatus = false
          console.log(data)

          data.images = data.images.split(",")
          // 初始化我的点赞状态
          if (data.aumniGive.length > 0) {
            for (let j = 0; j < data.aumniGive.length; j++) {
              if (data.aumniGive[j].user_openid == app.globalData.userInfo.user_openid) {
                thumbsStatus = true;
              }
            }
          }
          console.log(2)
          data.thumbsStatus = thumbsStatus
          // 初始化全文&收起按钮的状态
          data.fullText = true;
          data.havelong = false;
          // 初始化点赞评论弹框的状态
          data.commentBtu = false;
          // 改变时间的格式
          data.creatime = data.creatime.slice(5, 16)
          that.information = data
          that.setData({
            information: data
          }, function () {
            var query = wx.createSelectorQuery();
            query.select('#box').boundingClientRect()
            query.exec(function (res) {
              //res就是 所有标签为mjltest的元素的信息 的数组
              console.log(res);
              //取高度
              if (res[0].height < 60) { //帖子内容容器的高度小于60的，不显示全文&收起按钮
                that.information.havelong = false
              } else {
                that.information.havelong = true
              }
              that.information.fullText = false
              that.setData({
                information: that.information
              })
            })
          })
        }
      }
    });
  },
  // 帖子内容全文和收起
  operation: function(e) {
    // 如果输入框是打开状态，则先隐藏输入框
    if (this.showInput) {
      this.hideCommentBox();
    }
    this.information.fullText = !this.information.fullText
    this.setData({
      information: this.information
    })
  },
  // 显示和隐藏点赞评论弹框
  showcommentBtu: function(e) {
    let that = this
    app.getLogintype(function(type) { //只有注册的才能评论点赞
      if (type) {
        if (e == 'Allflase') { //隐藏所有点赞评论按钮弹窗
            that.information.commentBtu = false
        } else {
          // 如果输入框是打开状态，则先隐藏输入框
          if (that.showInput) {
            that.hideCommentBox();
          }
          let index = e.currentTarget.dataset.index
          that.information.commentBtu = true
        }
        that.setData({
          information: that.information
        })
      }
    })

  },
  // 点赞&取消点赞
  thumbs: function(e) {
    console.log('点赞')
    console.log(app.globalData.opnID)
    let that = this,
      url;
    if (e.currentTarget.dataset.status) { //取消点赞
      url = "/aummi/delete_aumni_d"
    } else { //点赞
      url = '/aummi/insert_aumni_d'
    }
    wx.request({
      url: app.globalData.https + url,
      data: {
        user_openid: app.globalData.userInfo.user_openid,
        id: e.currentTarget.dataset.id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(res) {
        console.log('点赞||取消点赞返回')
        console.log(res)
        if (res.data.code == 200) {
          // 设置点赞评论的状态
          that.information.thumbsStatus = !that.information.thumbsStatus

          if (e.currentTarget.dataset.status) { //取消点赞
            // 静态去除我的点赞
            for (let i = 0; i < that.information.aumniGive.length; i++) {
              if (that.information.aumniGive[i].user_openid == app.globalData.userInfo.user_openid) {
                that.information.aumniGive.splice(i, 1);
              }
            }
          } else { //点赞
            // 静态添加我的点赞
            that.information.aumniGive.push({
              id: that.information.id, //帖子ID
              user_alias: app.globalData.userInfo.user_alias, //用户昵称
              user_openid: app.globalData.userInfo.user_openid //用户ID
            })
          }
          that.setData({
            information: that.information
          })
          // 隐藏点赞评论弹框
          setTimeout(function() {
            that.showcommentBtu('Allflase');
          }, 1000)
        } else {
          console.log(res.data.message)
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function(res) {
              that.showcommentBtu('Allflase');
            }
          })
        }
      }
    });
  },
  // 评论 || 回复评论
  comment: function(e) {
    let that = this;
    app.getLogintype(function(type) { //只有注册的才能评论点赞
      if (type) {
        let text = '请输入';
        if (e.currentTarget.dataset.value) { //回复评论
          text = '@ ' + e.currentTarget.dataset.value.comment_name
          becomment_name = e.currentTarget.dataset.value.comment_name; //被评论者名字
          becomment_openid = e.currentTarget.dataset.value.comment_openid; //被评论者ID
          id = e.currentTarget.dataset.id //帖子ID
          console.log(becomment_name)
          console.log(becomment_openid)
          that.showInput = true;
          that.setData({
            showInput: true
          })
        } else { //评论
          becomment_name = null; //被评论者名字
          becomment_openid = null; //被评论者ID
          id = e.currentTarget.dataset.id //帖子ID
          that.showInput = !that.showInput;
          that.setData({
            showInput: that.showInput
          })
        }

        // 隐藏点赞评论弹框
        that.showcommentBtu('Allflase');

        if (that.showInput) {
          that.showCommentBox(text);
        } else {
          that.hideCommentBox();
        }
      }
    })

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
    if (that.inputText) {
      wx.request({
        url: app.globalData.https + '/aummi/insert_aumni_p',
        data: {
          becomment_name: becomment_name, //被评论者名字
          becomment_openid: becomment_openid, //被评论者ID
          comment_name: app.globalData.userInfo.user_alias, //评论者名字
          comment_openid: app.globalData.userInfo.user_openid, //评论者ID
          message: that.inputText, //评论内容
          id: id //帖子ID
        },
        method: 'post',
        success: function(res) {
          console.log('评论返回')
          console.log(res)
          if (res.data.code == 200) {
            console.log('评论成功')
            // 静态设置帖子评论
              if (that.information.id == id) {
                that.information.aumniComment.push({
                  becomment_name: becomment_name,
                  becomment_openid: becomment_openid,
                  comment_name: app.globalData.userInfo.user_alias,
                  comment_openid: app.globalData.userInfo.user_openid,
                  id: id,
                  message: that.inputText,
                })
              }
            that.setData({
              information: that.information
            })
            that.hideCommentBox();
          } else {
            console.log(res.data.magesss)
            wx.showModal({
              title: '提示',
              content: res.data.magesss,
              showCancel: false,
              success: function(res) {}
            })
            // wx.showToast({ title: res.data.error, icon: 'loading', duration: 1000 })
          }
        }
      });
    }
  },
  //页面滚动监听
  scroll: function(e) {
    // 隐藏输入框
    this.hideCommentBox();
    // 隐藏点赞评论框
    this.showcommentBtu('Allflase')
  },
  // 图片展示
  previewImage: function(e) {
    // imglock = true
    // 如果输入框是打开状态，则先隐藏输入框
    if (this.showInput) {
      this.hideCommentBox();
    }
    let that = this,
      index = e.currentTarget.dataset.index;
        wx.previewImage({
          current: that.information.images[index], // 当前显示图片的http链接
          urls: that.information.images // 需要预览的图片http链接列表
        })
  },
  // 去提交formID
  getFormID: function(e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  }

})