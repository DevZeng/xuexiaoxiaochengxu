const app = getApp();

Page({
  data: {
    title: '',
    content: '',
    class_id: ''
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    this.setData({
      class_id: options.classid
  })
  },
  // 公告标题
  onEditorTitleReady() {
    const that = this
    wx.createSelectorQuery().select('#editorTitle').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  onEditorTitleInput(e) {
    var self = this;
    self.setData({
      title: e.detail.html.replace(/wx:nodeid="\d+"/g, '')
    })
    console.log(self.data.title)
  },

  // 公告内容
  onEditorContentReady() {
    const that = this
    wx.createSelectorQuery().select('#editorContent').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  onEditorContentInput(e) {
    var self = this;
    self.setData({
      content: e.detail.html.replace(/wx:nodeid="\d+"/g, '')
    })
    console.log(self.data.content)
  },

  sendNotice(e) {
    var self = this;
    console.log(self.data.content)
    if (self.data.title && self.data.content) {
      wx.request({
        url: app.globalData.host + '/class/notice',
        method: 'POST',
        data: {
          token: wx.getStorageSync('token'),
          notice_title: self.data.title,
          notice_content: self.data.content
        },
        success: function (res) {
          if (res.data.msg === 'ok') {
            wx.showToast({
              title: '发布成功',
              success: function(res) {
                setTimeout(function() {
                  wx.reLaunch({
                    url: '../notice/notice-list/notice-list?btn_del=' + 'true' + '&classid=' + self.data.class_id,
                  })
                }, 2000)
              } 
            });
            
          }
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请完善公告',
      })
    }
  }

})