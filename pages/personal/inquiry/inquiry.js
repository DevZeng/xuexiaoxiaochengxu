// pages/personal/family/index/index.js
const app = getApp();
Page({
  data: {
    childrenList: [], //孩子列表
    childrenName: [], //孩子名字列表
    childrenIndex: 0, //选中的孩子下标
    achievementList: null, //成绩列表
    switchList: [],
    scoresList: [], // 各科成绩
    showScore: false,
    totalScore: '',
    title: ''
  },
  onLoad: function (options) {
    this.childrenIndex = 0;
    this.childrenList = [];
    this.getChildrenList();
  },
  onShow: function () {

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
        console.log('孩子列表')
        console.log(res)
        if (res.data.data) {
          if (res.data.data.length > 0) { //有孩子
            let data = []
            for (let i = 0; i < res.data.data.length; i++) {
              data[data.length] = res.data.data[i].name
            }
            that.childrenList = res.data.data;
            that.childrenName = data
            that.setData({
              childrenList: res.data.data,
              childrenName: data
            })
            // 先获取第一个学生的成绩信息
            that.getAchievement(res.data.data[0].number, res.data.data[0].school_id,res.data.data[0].id);
          }
        }
      }
    });
  },
  // 孩子选择
  childrenChange: function (e) {
    this.childrenIndex = e.detail.value
    this.setData({
      childrenIndex: e.detail.value,
    })
    // 获取学生的成绩
    this.getAchievement(this.childrenList[this.childrenIndex].number, this.childrenList[this.childrenIndex].school_id,this.childrenList[this.childrenIndex].id);
  },
  // 获取学生的成绩
  getAchievement: function (number, school_id, student_id) {
    console.log('学号：' + number)
    let that = this;
    wx.request({
      url: app.globalData.host + '/student/exam',
      data: {
        school_id: school_id,
        number: number,
        student_id: student_id,
        token: wx.getStorageSync('token')
      },
      method: 'get',
      success: function (res) {
        console.log('学生成绩列表')
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data
          that.setData({
            achievementList: data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
        })
        }
      }
    });
  },

  // 显示各科成绩
  showScores(e) {
    var self = this;
    self.setData({
      scoresList: e.currentTarget.dataset.scores,
      totalScore: e.currentTarget.dataset.score,
      title: e.currentTarget.dataset.title,
      showScore: true
    })
  },

  // 隐藏各科成绩
  close() {
    var self = this;
    self.setData({
      showScore: false
    })
  }
})