//index.js
//获取应用实例
const app = getApp();
let lock = true,
  becomment_name = null, //被评论者名字
  becomment_openid = null, //被评论者ID
  id = '';//帖子ID
Page({
  data: {
    banner: [], //轮播图
    classFication: [], //分类列表
    information: '', //帖子列表
    showInput: false, //是否显示评论输入框
    placeholderText: '', //评论输入框默认内容
    inputText: '', //评论输入框内容
    searchText: ''//搜索输入框内容
  },
  onLoad: function () {
    // 初始化
    wx.showToast({ title: '加载中', icon: 'loading', mask: true, duration: 10000 })
    this.getBanner();
    this.getClassFication();
  },
  onShow: function () {
    lock = true;
    this.getInformation(true);
    this.searchText = ''
    this.setData({
      searchText: ''
    })
  },
  // 搜索文字
  searchInput: function(e){
    this.searchText = e.detail.value;
  },
  // 搜索
  search: function(){
    console.log('搜索')
    console.log(this.searchText)
    let that = this
    wx.showToast({ title: '搜索中', icon: 'loading' })
    wx.request({
      url: app.globalData.https + '/aummi/check',
      data: {
        key: that.searchText
      },
      method: 'get',
      success: function (res) {
        console.log('帖子搜索返回')
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({ title: '搜索成功！', icon: 'success' })
            lock = false;
            // 去赋值
            that.assignment(res.data.data,true);
        }
      }
    });
  },
  // 帖子内容全文和收起
  operation: function (e) {
    // 如果输入框是打开状态，则先隐藏输入框
    if (this.showInput) {
      this.hideCommentBox();
    }
    let index = e.currentTarget.dataset.index;
    this.information[index].fullText = !this.information[index].fullText
    this.setData({
      information: this.information
    })
  },
  // 显示和隐藏点赞评论弹框
  showcommentBtu: function (e) {
    let that = this
    app.getLogintype(function (type) {//只有注册的才能评论点赞
      if (type) {
        if (e == 'Allflase') {//隐藏所有点赞评论按钮弹窗
          for (let i = 0; i < that.information.length; i++) {
            that.information[i].commentBtu = false
          }
        } else {
          // 如果输入框是打开状态，则先隐藏输入框
          if (that.showInput) {
            that.hideCommentBox();
          }
          let index = e.currentTarget.dataset.index
          for (let i = 0; i < that.information.length; i++) {
            that.information[i].commentBtu = false
          }
          that.information[index].commentBtu = true
        }
        that.setData({
          information: that.information
        })
      }
    })
    
  },
  // 点赞&取消点赞
  thumbs: function(e){
    console.log('点赞')
    console.log(app.globalData.opnID)
    let that = this, url, index = e.currentTarget.dataset.index;
    if (e.currentTarget.dataset.status){//取消点赞
      url = "/aummi/delete_aumni_d"
    }else{//点赞
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
      success: function (res) {
        console.log('点赞||取消点赞返回')
        console.log(res)
        if (res.data.code == 200) {
            // 设置点赞评论的状态
            that.information[index].thumbsStatus = !that.information[index].thumbsStatus
            
            if (e.currentTarget.dataset.status) {//取消点赞
              // 静态去除我的点赞
              for (let i = 0; i < that.information[index].aumniGive.length; i++) {
                if (that.information[index].aumniGive[i].user_openid == app.globalData.userInfo.user_openid){
                  that.information[index].aumniGive.splice(i, 1);
                }
              }
            } else {//点赞
              // 静态添加我的点赞
              that.information[index].aumniGive.push({
                id: that.information[index].id,//帖子ID
                user_alias: app.globalData.userInfo.user_alias,//用户昵称
                user_openid: app.globalData.userInfo.user_openid//用户ID
              })
            }
            that.setData({
              information : that.information
            })
          // 隐藏点赞评论弹框
          setTimeout(function () {
            that.showcommentBtu('Allflase');
          },1000)
        } else {
          console.log(res.data.message)
          wx.showModal({
            title: '提示', content: res.data.message, showCancel: false, success: function (res) { that.showcommentBtu('Allflase'); } })
        }
      }
    });
  },
  // 评论 || 回复评论
  comment: function (e) {
    let that = this;
    app.getLogintype(function (type) {//只有注册的才能评论点赞
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
  showCommentBox: function (text) {
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
  hideCommentBox: function () {
    this.showInput = false;
    this.setData({
      showInput: false
    })
  },
  // 评论内容输出
  message: function (e) {
    console.log(e.detail.value)
    this.inputText = e.detail.value;
  },
  // 发送评论
  sendMessage: function () {
    let that = this;
    if (that.inputText) {
      console.log('评论发送的数据start')
      console.log(becomment_name)
      console.log(becomment_openid)
      console.log(app.globalData.userInfo.user_alias)
      console.log(app.globalData.userInfo.user_openid)
      console.log(that.inputText)
      console.log(id)
      console.log('评论发送的数据end')
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
        success: function (res) {
          console.log('评论返回')
          console.log(res)
          if (res.data.code == 200) {
            console.log('评论成功')
            // 静态设置帖子评论
            for (let i = 0; i < that.information.length; i++) {
              if (that.information[i].id == id){
                that.information[i].aumniComment.push({
                  becomment_name: becomment_name,
                  becomment_openid: becomment_openid,
                  comment_name: app.globalData.userInfo.user_alias,
                  comment_openid: app.globalData.userInfo.user_openid,
                  id: id,
                  message: that.inputText,
                })
              }
            }
            that.setData({
              information: that.information
            })
            that.hideCommentBox();
          } else {
            console.log(res.data.magesss)
            wx.showModal({ title: '提示', content: res.data.magesss, showCancel: false, success: function (res) { } })
            // wx.showToast({ title: res.data.error, icon: 'loading', duration: 1000 })
          }
        }
      });
    }
  },
  //页面滚动到底部监听
  scrolltolower: function (e) {
    if (lock) {
      lock = !lock;
      wx.showToast({ title: '加载中', icon: 'loading' })
      this.getInformation();
    }
  },
  //页面滚动监听
  scroll: function (e) {
    // 隐藏输入框
    this.hideCommentBox();
    // 隐藏点赞评论框
    this.showcommentBtu('Allflase')
  },
  // 获取轮播图
  getBanner: function () {
    let that = this;
    wx.request({
      url: app.globalData.https + '/select_type',
      method: 'get',
      success: function (res) {
        console.log('校友圈轮播图列表')
        console.log(res)
        if (res.data.code == 200) {
          that.banner = res.data.data;
          that.setData({
            banner: res.data.data
          })
        }
      }
    });
  },
  // 获取帖子分类
  getClassFication: function () {
    let that = this;
    wx.request({
      url: app.globalData.https + '/aummi/select_all_class',
      method: 'get',
      success: function (res) {
        console.log('帖子分类列表')
        console.log(res)
        if (res.data.code == 200) {
          that.classFication = res.data.data;
          that.setData({
            classFication: res.data.data
          })
        }
      }
    });
  },
  // 获取帖子列表
  getInformation: function (type) {
    let that = this,
      num = 1;
    if (that.information) {
      num = Math.ceil(that.information.length / 10) + 1
      console.log(that.information.length)
    }
    if (type) {//重新获取
      num = 1
    }
    console.log('去获取帖子')
    wx.request({
      url: app.globalData.https + '/aummi/select_qian_aumni',
      data: {
        start: num
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log('帖子列表返回')
        console.log(res)
        if (res.data.code == 200) {
          lock = true;
          if (res.data.data.length != 10) {
            console.log('返回的数据少于十条,滑动无法再继续请求')
            lock = false;
          }
          if (that.information) {//原来有数据
            let str1 = that.information;
            let str2 = res.data.data;
            // 重新加载数据
            if (type) {
              if (str2[0].id == str1[0].id && str1.length == 10) {//数据重复时不代入数据
                console.log('和原来的数据一样')
                return;
              } else {//先清空原来的数据，再重新加载数据
                that.information = '';
              }
            }
            // 预防最后一页和最后一页的下一页数据相同时数据重复加载
            if (str1[str1.length - 1].id == str2[str2.length - 1].id) {
              if (num != 1) {
                return;
              }
            }
            // 去赋值
            that.assignment(res.data.data,type);
          } else {
            console.log('没有数据，直接赋值')
            // 去赋值
            that.assignment(res.data.data);
          }
        }
      }
    });
  },
  // 帖子列表赋值
  assignment: function (data, type){
    console.log(data)
    if (type){
      this.information = []
    }
    let information = this.information, that = this;
    for (let i = 0; i < data.length; i++) {
      // 判断我有没有点赞这一条帖子
      let thumbsStatus = false;
      if (data[i].aumniGive.length > 0) {
        for (let j = 0; j < data[i].aumniGive.length; j++) {
          if (data[i].aumniGive[j].user_openid == app.globalData.userInfo.user_openid) {
            thumbsStatus = true;
          }
        }
      }
      // 初始化我的点赞状态
      data[i].thumbsStatus = thumbsStatus
      // 初始化全文&收起按钮的状态
      data[i].fullText = true;
      data[i].havelong = false;
      // 初始化点赞评论弹框的状态
      data[i].commentBtu = false;
      // 改变时间的格式
      data[i].creatime = data[i].creatime.slice(5, 16)
      // 改变帖子图片的数据格式
      data[i].images = data[i].images.split(",")
      
      if (information) {//如果原来有数据的，在原来的基础上添加
        information.push(data[i]);
      }else{
        information = [data[i]]
      }
    }
    that.information = information
    that.setData({
      information: data
    },function(){
      var query = wx.createSelectorQuery();
      for (let i = 0; i < that.information.length; i++){
        query.select('#box' + i).boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          console.log(res);
          //取高度
          if (res.length == that.information.length){//最后一个
            for (let j = 0; j < res.length; j++){
              if (res[j].height < 60){//帖子内容容器的高度小于60的，不显示全文&收起按钮
                that.information[j].havelong = false
              } else {
                that.information[j].havelong = true
              }
              that.information[j].fullText = false
            }
            that.setData({
              information: that.information
            })
          }
          console.log(res[0].height);
        })
      }
      
      // console.log('显示完了')
    })
  },
  // 图片展示
  previewImage: function (e) {
    // imglock = true
    // 如果输入框是打开状态，则先隐藏输入框
    if (this.showInput) {
      this.hideCommentBox();
    }
    let that = this, index = e.currentTarget.dataset.index;
    for (let i = 0; i < that.information.length; i++) {
      if (that.information[i].id == e.currentTarget.dataset.id) {
        console.log('1111111')
        wx.previewImage({
          current: that.information[i].images[index], // 当前显示图片的http链接
          urls: that.information[i].images // 需要预览的图片http链接列表
        })
        break;
      }
    }
    
  },
  // 去提交formID
  getFormID: function (e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },

  // 跳转分类
  openClassification: function (e) {
    setTimeout(function () {
      wx.navigateTo({
        url: '../classification/classification?class_id=' + e.currentTarget.dataset.id
      })
    }, 100)
  },
  openHome: function(e){
    wx.navigateTo({
      url: '../personal-home/personal-home?user_openid=' + e.currentTarget.dataset.user_openid
    })
  },
  // 分享转发
  onShareAppMessage: function () {
    return {
      title: "图巴诺校友圈",
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544844868129.jpg"
    }
  }
})