// pages/personal/family/index/index.js
const app = getApp();
Page({
  data: {
    childrenList: [], //孩子列表
    childrenName: [], //孩子名字列表
    childrenIndex: 0, //选中的孩子下标
    achievementList: [], //成绩列表
    switchList: []
  },
  onLoad: function(options) {
    this.childrenIndex = 0;
    this.childrenList = [];
    this.getChildrenList();
  },
  onShow: function() {

  },
  // 获取我的孩子列表
  getChildrenList: function() {
    let that = this;
    wx.request({
      url: app.globalData.https + '/security/select_save',
      data: {
        user_openid: app.globalData.opnID
      },
      method: 'get',
      success: function(res) {
        console.log('孩子列表')
        console.log(res)
        if (res.data.data) {
          if (res.data.data.length > 0) { //有孩子
            let data = []
            for (let i = 0; i < res.data.data.length; i++) {
              data[data.length] = res.data.data[i].stu_name
            }
            that.childrenList = res.data.data;
            that.childrenName = data
            that.setData({
              childrenList: res.data.data,
              childrenName: data
            })
            // 先获取第一个学生的成绩信息
            that.getAchievement(res.data.data[0].stu_number);
          }
        }
      }
    });
  },
  // 孩子选择
  childrenChange: function(e) {
    this.childrenIndex = e.detail.value
    this.setData({
      childrenIndex: e.detail.value,
    })
    // 获取学生的成绩
    this.getAchievement(this.childrenList[this.childrenIndex].stu_number);
  },
  // 获取学生的成绩
  getAchievement: function(stu_number) {
    console.log('学号：' + stu_number)
    let that = this;
    wx.request({
      url: app.globalData.https + '/excel/select_stu',
      data: {
        sch_num: stu_number
      },
      method: 'get',
      success: function(res) {
        console.log('学生成绩列表')
        console.log(res)
        if (res.data.code == 200) {
          let data = res.data.data,
            list = {
              art: true,
              biology: true,
              chemistry: true,
              chineses: true,
              class_advance: true,
              class_ranking: true,
              classes: true,
              creatime: true,
              english: true,
              english_k: true,
              grade_advance: true,
              grade_ranking: true,
              id: true,
              k_date: true,
              k_name: true,
              li_zong: true,
              mathematics: true,
              physics: true,
              politics: true,
              s_status: true,
              sch_num: true,
              score: true,
              sports: true,
              wen_zong: true
            };
          if (data.length > 0) { //有成绩信息
            console.log(data)
            for (let t = 0; t < data[0].length; t++) {
              list[t] = true
            }
            console.log(list)
            for (let i = 0; i < data.length; i++) {
              if (!data[i].art) list.art = false
              if (!data[i].biology) list.biology = false
              if (!data[i].chemistry) list.chemistry = false
              if (!data[i].chineses) list.chineses = false
              if (!data[i].class_advance) list.class_advance = false
              if (!data[i].class_ranking) list.class_ranking = false
              if (!data[i].classes) list.classes = false
              if (!data[i].creatime) list.creatime = false
              if (!data[i].english) list.english = false
              if (!data[i].english_k) list.english_k = false
              if (!data[i].grade_advance) list.grade_advance = false
              if (!data[i].grade_ranking) list.grade_ranking = false
              if (!data[i].id) list.id = false
              if (!data[i].k_date) list.k_date = false
              if (!data[i].k_name) list.k_name = false
              if (!data[i].li_zong) list.li_zong = false
              if (!data[i].mathematics) list.mathematics = false
              if (!data[i].physics) list.physics = false
              if (!data[i].politics) list.politics = false
              if (!data[i].s_status) list.s_status = false
              if (!data[i].sch_num) list.sch_num = false
              if (!data[i].score) list.score = false
              if (!data[i].sports) list.sports = false
              if (!data[i].wen_zong) list.wen_zong = false
              // console.log(data[i].hasOwnProperty("art"));
            }
          }
          console.log(list)
          that.achievementList = data;
          that.switchList = list
          that.setData({
            achievementList: data,
            switchList: list
          })
        }
      }
    });
  }
})