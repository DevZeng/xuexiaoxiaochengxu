//index.js
//获取应用实例
const app = getApp();
var DATE = require('../../../utils/util.js');


let today, num, lock = true, interval;

let markersArray = [{
    id: 0,
    iconPath: "../../../icon/address.png",
    latitude: 22.93791,
    longitude: 113.34135,
    width: 30,
    height: 30,
    title: '广州市图巴诺信息科技有限公司',
    anchor: {
      x: .5,
      y: 1
    },
    alpha: 1
  }],
  addressText = '广州市图巴诺信息科技有限公司',
  latitudeNum = 22.93791,
  longitudeNum = 113.34135;



var Lunar = {
  MIN_YEAR: 1891,
  MAX_YEAR: 2100,
  lunarInfo: [
    [0, 2, 9, 21936],
    [6, 1, 30, 9656],
    [0, 2, 17, 9584],
    [0, 2, 6, 21168],
    [5, 1, 26, 43344],
    [0, 2, 13, 59728],
    [0, 2, 2, 27296],
    [3, 1, 22, 44368],
    [0, 2, 10, 43856],
    [8, 1, 30, 19304],
    [0, 2, 19, 19168],
    [0, 2, 8, 42352],
    [5, 1, 29, 21096],
    [0, 2, 16, 53856],
    [0, 2, 4, 55632],
    [4, 1, 25, 27304],
    [0, 2, 13, 22176],
    [0, 2, 2, 39632],
    [2, 1, 22, 19176],
    [0, 2, 10, 19168],
    [6, 1, 30, 42200],
    [0, 2, 18, 42192],
    [0, 2, 6, 53840],
    [5, 1, 26, 54568],
    [0, 2, 14, 46400],
    [0, 2, 3, 54944],
    [2, 1, 23, 38608],
    [0, 2, 11, 38320],
    [7, 2, 1, 18872],
    [0, 2, 20, 18800],
    [0, 2, 8, 42160],
    [5, 1, 28, 45656],
    [0, 2, 16, 27216],
    [0, 2, 5, 27968],
    [4, 1, 24, 44456],
    [0, 2, 13, 11104],
    [0, 2, 2, 38256],
    [2, 1, 23, 18808],
    [0, 2, 10, 18800],
    [6, 1, 30, 25776],
    [0, 2, 17, 54432],
    [0, 2, 6, 59984],
    [5, 1, 26, 27976],
    [0, 2, 14, 23248],
    [0, 2, 4, 11104],
    [3, 1, 24, 37744],
    [0, 2, 11, 37600],
    [7, 1, 31, 51560],
    [0, 2, 19, 51536],
    [0, 2, 8, 54432],
    [6, 1, 27, 55888],
    [0, 2, 15, 46416],
    [0, 2, 5, 22176],
    [4, 1, 25, 43736],
    [0, 2, 13, 9680],
    [0, 2, 2, 37584],
    [2, 1, 22, 51544],
    [0, 2, 10, 43344],
    [7, 1, 29, 46248],
    [0, 2, 17, 27808],
    [0, 2, 6, 46416],
    [5, 1, 27, 21928],
    [0, 2, 14, 19872],
    [0, 2, 3, 42416],
    [3, 1, 24, 21176],
    [0, 2, 12, 21168],
    [8, 1, 31, 43344],
    [0, 2, 18, 59728],
    [0, 2, 8, 27296],
    [6, 1, 28, 44368],
    [0, 2, 15, 43856],
    [0, 2, 5, 19296],
    [4, 1, 25, 42352],
    [0, 2, 13, 42352],
    [0, 2, 2, 21088],
    [3, 1, 21, 59696],
    [0, 2, 9, 55632],
    [7, 1, 30, 23208],
    [0, 2, 17, 22176],
    [0, 2, 6, 38608],
    [5, 1, 27, 19176],
    [0, 2, 15, 19152],
    [0, 2, 3, 42192],
    [4, 1, 23, 53864],
    [0, 2, 11, 53840],
    [8, 1, 31, 54568],
    [0, 2, 18, 46400],
    [0, 2, 7, 46752],
    [6, 1, 28, 38608],
    [0, 2, 16, 38320],
    [0, 2, 5, 18864],
    [4, 1, 25, 42168],
    [0, 2, 13, 42160],
    [10, 2, 2, 45656],
    [0, 2, 20, 27216],
    [0, 2, 9, 27968],
    [6, 1, 29, 44448],
    [0, 2, 17, 43872],
    [0, 2, 6, 38256],
    [5, 1, 27, 18808],
    [0, 2, 15, 18800],
    [0, 2, 4, 25776],
    [3, 1, 23, 27216],
    [0, 2, 10, 59984],
    [8, 1, 31, 27432],
    [0, 2, 19, 23232],
    [0, 2, 7, 43872],
    [5, 1, 28, 37736],
    [0, 2, 16, 37600],
    [0, 2, 5, 51552],
    [4, 1, 24, 54440],
    [0, 2, 12, 54432],
    [0, 2, 1, 55888],
    [2, 1, 22, 23208],
    [0, 2, 9, 22176],
    [7, 1, 29, 43736],
    [0, 2, 18, 9680],
    [0, 2, 7, 37584],
    [5, 1, 26, 51544],
    [0, 2, 14, 43344],
    [0, 2, 3, 46240],
    [4, 1, 23, 46416],
    [0, 2, 10, 44368],
    [9, 1, 31, 21928],
    [0, 2, 19, 19360],
    [0, 2, 8, 42416],
    [6, 1, 28, 21176],
    [0, 2, 16, 21168],
    [0, 2, 5, 43312],
    [4, 1, 25, 29864],
    [0, 2, 12, 27296],
    [0, 2, 1, 44368],
    [2, 1, 22, 19880],
    [0, 2, 10, 19296],
    [6, 1, 29, 42352],
    [0, 2, 17, 42208],
    [0, 2, 6, 53856],
    [5, 1, 26, 59696],
    [0, 2, 13, 54576],
    [0, 2, 3, 23200],
    [3, 1, 23, 27472],
    [0, 2, 11, 38608],
    [11, 1, 31, 19176],
    [0, 2, 19, 19152],
    [0, 2, 8, 42192],
    [6, 1, 28, 53848],
    [0, 2, 15, 53840],
    [0, 2, 4, 54560],
    [5, 1, 24, 55968],
    [0, 2, 12, 46496],
    [0, 2, 1, 22224],
    [2, 1, 22, 19160],
    [0, 2, 10, 18864],
    [7, 1, 30, 42168],
    [0, 2, 17, 42160],
    [0, 2, 6, 43600],
    [5, 1, 26, 46376],
    [0, 2, 14, 27936],
    [0, 2, 2, 44448],
    [3, 1, 23, 21936],
    [0, 2, 11, 37744],
    [8, 2, 1, 18808],
    [0, 2, 19, 18800],
    [0, 2, 8, 25776],
    [6, 1, 28, 27216],
    [0, 2, 15, 59984],
    [0, 2, 4, 27424],
    [4, 1, 24, 43872],
    [0, 2, 12, 43744],
    [0, 2, 2, 37600],
    [3, 1, 21, 51568],
    [0, 2, 9, 51552],
    [7, 1, 29, 54440],
    [0, 2, 17, 54432],
    [0, 2, 5, 55888],
    [5, 1, 26, 23208],
    [0, 2, 14, 22176],
    [0, 2, 3, 42704],
    [4, 1, 23, 21224],
    [0, 2, 11, 21200],
    [8, 1, 31, 43352],
    [0, 2, 19, 43344],
    [0, 2, 7, 46240],
    [6, 1, 27, 46416],
    [0, 2, 15, 44368],
    [0, 2, 5, 21920],
    [4, 1, 24, 42448],
    [0, 2, 12, 42416],
    [0, 2, 2, 21168],
    [3, 1, 22, 43320],
    [0, 2, 9, 26928],
    [7, 1, 29, 29336],
    [0, 2, 17, 27296],
    [0, 2, 6, 44368],
    [5, 1, 26, 19880],
    [0, 2, 14, 19296],
    [0, 2, 3, 42352],
    [4, 1, 24, 21104],
    [0, 2, 10, 53856],
    [8, 1, 30, 59696],
    [0, 2, 18, 54560],
    [0, 2, 7, 55968],
    [6, 1, 27, 27472],
    [0, 2, 15, 22224],
    [0, 2, 5, 19168],
    [4, 1, 25, 42216],
    [0, 2, 12, 42192],
    [0, 2, 1, 53584],
    [2, 1, 21, 55592],
    [0, 2, 9, 54560]
  ],
  //是否闰年
  isLeapYear: function(year) {
    return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0));
  },
  //天干地支年
  lunarYear: function(year) {
    var gan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
      zhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
      str = year.toString().split("");
    return gan[str[3]] + zhi[year % 12];
  },
  //生肖年
  zodiacYear: function(year) {
    var zodiac = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
    return zodiac[year % 12];
  },
  //公历月份天数
  //@param year 阳历-年
  //@param month 阳历-月
  solarMonthDays: function(year, month) {
    var FebDays = this.isLeapYear(year) ? 29 : 28;
    var monthHash = ['', 31, FebDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthHash[month];
  },
  //农历月份天数
  lunarMonthDays: function(year, month) {
    var monthData = this.lunarMonths(year);
    return monthData[month - 1];
  },
  //农历月份天数数组
  lunarMonths: function(year) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    var leapMonth = yearData[0];
    var bit = (+yearData[3]).toString(2);
    var months = [];
    for (var i = 0; i < bit.length; i++) {
      months[i] = bit.substr(i, 1);
    }

    for (var k = 0, len = 16 - months.length; k < len; k++) {
      months.unshift('0');
    }

    months = months.slice(0, (leapMonth == 0 ? 12 : 13));
    for (var i = 0; i < months.length; i++) {
      months[i] = +months[i] + 29;
    }
    return months;
  },
  //农历每年的天数
  //@param year 农历年份
  lunarYearDays: function(year) {
    var monthArray = this.lunarYearMonths(year);
    var len = monthArray.length;
    return (monthArray[len - 1] == 0 ? monthArray[len - 2] : monthArray[len - 1]);
  },
  //
  lunarYearMonths: function(year) {
    var monthData = this.lunarMonths(year);
    var res = [];
    var temp = 0;
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    var len = (yearData[0] == 0 ? 12 : 13);
    for (var i = 0; i < len; i++) {
      temp = 0;
      for (let j = 0; j <= i; j++) {
        temp += monthData[j];
      }
      res.push(temp);
    }
    return res;
  },
  //获取闰月
  //@param year 农历年份
  leapMonth: function(year) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    return yearData[0];
  },
  //计算农历日期与正月初一相隔的天数
  betweenLunarDays: function(year, month, day) {
    var yearMonth = this.lunarMonths(year);
    var res = 0;
    for (var i = 1; i < month; i++) {
      res += yearMonth[i - 1];
    }
    res += day - 1;
    return res;
  },
  //计算2个阳历日期之间的天数
  //@param year 阳历年
  //@param month
  //@param day
  //@param l_month 阴历正月对应的阳历月份
  //@param l_day  阴历初一对应的阳历天
  betweenSolarDays: function(year, month, day, l_month, l_day) {
    var time1 = new Date(year + "-" + month + "-" + day).getTime(),
      time2 = new Date(year + "-" + l_month + "-" + l_day).getTime();
    return Math.ceil((time1 - time2) / 24 / 3600 / 1000);
  },
  //根据距离正月初一的天数计算阴历日期
  //@param year 阳历年
  //@param between 天数
  lunarByBetween: function(year, between) {
    var lunarArray = [],
      yearMonth = [],
      t = 0,
      e = 0,
      leapMonth = 0,
      m = '';
    if (between == 0) {
      t = 1;
      e = 1;
      m = '正月';
    } else {
      year = between > 0 ? year : (year - 1);
      yearMonth = this.lunarYearMonths(year);
      leapMonth = this.leapMonth(year);
      between = between > 0 ? between : (this.lunarYearDays(year) + between);
      for (var i = 0; i < 13; i++) {
        if (between == yearMonth[i]) {
          t = i + 2;
          e = 1;
          break;
        } else if (between < yearMonth[i]) {
          t = i + 1;
          e = between - ((yearMonth[i - 1]) ? yearMonth[i - 1] : 0) + 1;
          break;
        }
      }

      m = (leapMonth != 0 && t == leapMonth + 1) ? ('闰' + ':' + this.chineseMonth(t - 1)) : this.chineseMonth(((leapMonth != 0 && leapMonth + 1 < t) ? (t - 1) : t));
    }
    lunarArray.push(year, t, e); //年 月 日
    lunarArray.push(this.lunarYear(year),
      this.zodiacYear(year),
      m,
      this.chineseNumber(e)); //天干地支年 生肖年 月份 日
    lunarArray.push(leapMonth); //闰几月
    return lunarArray;
  },
  //中文月份
  chineseMonth: function(month) {
    var monthHash = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    return monthHash[month];
  },
  //中文日期
  chineseNumber: function(num) {
    var dateHash = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      res;
    if (num <= 10) {
      res = '初' + dateHash[num];
    } else if (num > 10 && num < 20) {
      res = '十' + dateHash[num - 10];
    } else if (num == 20) {
      res = "二十";
    } else if (num > 20 && num < 30) {
      res = "廿" + dateHash[num - 20];
    } else if (num == 30) {
      res = "三十";
    }
    return res;
  },
  //转换农历
  toLunar: function(year, month, day) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    if (year == this.MIN_YEAR && month <= 2 && day <= 9) {
      return [1891, 1, 1, '辛卯', '兔', '正月', '初一'];
    }
    return this.lunarByBetween(year, this.betweenSolarDays(year, month, day, yearData[1], yearData[2]));
  },

  //转换公历
  //@param year 阴历-年
  //@param month 阴历-月，闰月处理：例如如果当年闰五月，那么第二个五月就传六月，相当于阴历有13个月
  //@param date 阴历-日
  toSolar: function(year, month, day) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    var between = this.betweenLunarDays(year, month, day);
    var ms = new Date(year + "-" + yearData[1] + "-" + yearData[2]).getTime();
    var s = ms + between * 24 * 60 * 60 * 1000;
    var d = new Date();
    d.setTime(s);
    year = d.getFullYear();
    month = d.getMonth() + 1;
    day = d.getDate();
    return [year, month, day];
  },

  // 转换星期
  getdateTime: function (year, month, day) {
    let strings = year + '-' + month + '-' + day
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.platform)
        if (res.platform == 'ios') {
          strings = year + '/' + month + '/' + day
        }
      }
    })
    let today = new Date(strings);
    // let strings = year + '/' + month + '/' + day + ' 00:00:01'
    // let today = new Date(strings).getTime();
    console.log('修改时间：' + today)
    let d = new Array(
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六");
    let year_ = today.getFullYear(),
      month_ = today.getMonth() + 1,
      date_ = today.getDate();
    if (month_ < 10) {
      month_ = '0' + month_
    }
    if (date_ < 10) {
      date_ = '0' + date_
    }
    let dt = {
      year: year_,
      month: month_,
      date: date_,
      week: d[today.getDay()]
    }
    return dt;
  }
};




Page({
  data: {
    childrenlist: [],
    recordsList: [], // 进出
    currentIndex: 0,
    cardRightIn: false,
    cardLeftIn: false,
    address: addressText,
    //地图开始的位置
    latitude: latitudeNum,
    longitude: longitudeNum,
    //标记位置
    markers: markersArray,
    showCalendar: false, // 显示日历
    //圆
    // circles: [{
    // latitude: 22.93791,
    // longitude: 113.34135,
    //   fillColor: "#8bd5fc",
    //   radius: 300,
    //   clickable: true
    // }],
    // 日历
    days_color: [{
      month: 'current', //要标记的日期所属月份，有效值有prev（上个月）,current（当前月），next（下个月）
      day: 31, //要标记的日期
      color: "white", //日期文字的颜色
      // background: "#f5a8f0"//日期单元格的颜色
    }]
  },
  onLoad: function (option) {
    this.currentIndex = 0;
    let data =[]
    for(let i = 1; i < 32; i++){
      data[data.length] = {
        month: 'current', //要标记的日期所属月份，有效值有prev（上个月）,current（当前月），next（下个月）
        day: i, //要标记的日期
        color: "white", //日期文字的颜色
        // background: "#f5a8f0"//日期单元格的颜色
      }
    }
    this.days_color = data
    this.setData({
      days_color: data
    })
  },
  onShow: function() {
    lock = true
    let that = this
    that.getChildrenList();
    // 判断会员信息
    // if (app.globalData.memberInfo) {
    //   if (app.globalData.memberInfo.time_status == 1) {
    //     this.getChildrenList();
    //   }
    // } else {
    //   app.getMemberTime(function (memberinfo) {
    //     if (memberinfo.time_status == 1) {
    //       this.getChildrenList();
    //     }
    //   })
    // }

  },
  onHide: function () {
    // 清除定时器
    console.log('清除定时器')
    clearInterval(interval)

  },
  // 获取我的孩子列表
  getChildrenList: function(e) {
    let that = this;
   
    wx.request({
      url: app.globalData.host + '/children?token='+wx.getStorageSync('token')+'&state=3',
      method: 'get',
      success: function(res) {
        console.log('孩子列表')
        console.log(res)
        if (res.data.data) {
          if (res.data.data.length > 0) {//有孩子
            let data = res.data.data
            let time = new Date();
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let date = time.getDate();
            console.log(year)
            console.log(month)
            console.log(date)
            let gregorian = Lunar.getdateTime(year, month, date);
            let lunar = Lunar.toLunar(year, month, date);
            console.log('时间：' + JSON.stringify(Lunar.getdateTime(year, month, date)));
            console.log('时间：' + Lunar.toLunar(year, month, date));
            for (let i = 0; i < data.length; i++) {
              data[i].calendar_state = false;
              data[i].gregorian = gregorian;
              data[i].lunar = lunar;
            }
            that.childrenlist = data;
            that.setData({
              childrenlist: data
            })

            // 获取进出记录和定位信息
            that.toGet();
          }
        }
      }
    });
  },
  // 去获取信息
  toGet: function(){
    console.log('去获取定位信息和进出学校记录')
    let that = this;
    // 判断会员信息
    if (app.globalData.memberInfo) {
      if (app.globalData.memberInfo.time_status == 1) {//是有效的会员
        // 获取人脸记录
        that.getRecords();
      }
    } else {
      app.getMemberTime(function (memberinfo) {
        if (memberinfo.time_status == 1) {//是有效的会员
          // 获取人脸记录
          that.getRecords();
        }
      })
    }
    //获取孩子定位信息
    that.getLocation();
    if (lock) { //只能设置一次定时器
      lock = false
      // 定时五分钟获取更新信息
      interval = setInterval(function () {
        console.log('定时一分钟更新信息')
        that.getRecords();
        if (app.globalData.memberInfo) {
          if (app.globalData.memberInfo.time_status == 1) {//是有效的会员
            // 获取人脸记录
            that.getLocation();
          }
        } 
      }, 1 * 60 * 1000)
    }
  },
  // 根据日期获取记录列表
  getRecords: function() {
    console.log(this.childrenlist[this.currentIndex])
    let that = this,
      gregorian = that.childrenlist[that.currentIndex].gregorian;
    // var date = new Date(gregorian.year + '-' + gregorian.month + '-' + gregorian.date) 
    // let time_stamp= date.getTime(date)/1000 + 86400;
    // console.log(DATE.formatTime(time_stamp, "Y-M-D"))
    wx.request({
      url: app.globalData.host + '/user/student/faceLogs?token='+wx.getStorageSync('token'),
      data: {
        time: gregorian.year + '-' + gregorian.month + '-' + gregorian.date,
        // school_id: 43,
        //         id: 3949
        school_id: that.childrenlist[that.currentIndex].school_id,
        number: that.childrenlist[that.currentIndex].number
      },
      method: 'get',
      success: function(res) {
        console.log('历史记录')
        console.log(333,res)
        console.log(333,res.data.data.direction)

        if (res.data.data.direction.length > 0) {
          that.setData({
            recordsList: res.data.data.direction
          })
        }
      }
    });
  },
  // 获取孩子位置信息
  getLocation: function() {
    let that = this;
    if (that.childrenlist[that.currentIndex].device_id){
      wx.request({
        url: app.globalData.https1 + '/device/select_securty',
        data: {
          // user_openid: app.globalData.opnID,
          device_id: that.childrenlist[that.currentIndex].device_id
        },
        method: 'get',
        success: function (res) {
          console.log('定位信息')
          console.log(res)
          if (res.data.data) {
            if(res.data.data.lag == 0){//定位器返回经纬度为0少数情况
              //设置默认地址显示
              that.setDefaultAddress();
              return;
            }
            let markers = [{
              id: 0,
              iconPath: "../../../icon/address.png",
              latitude: res.data.data.lat,
              longitude: res.data.data.lag,
              width: 30,
              height: 30,
              title: that.childrenlist[that.currentIndex].stu_name,
              anchor: {
                x: .5,
                y: 1
              },
              alpha: 1
            }]
            that.latitude = res.data.data.lat,
              that.longitude = res.data.data.lag,
              that.markers = markers
            that.setData({
              latitude: that.latitude,
              longitude: that.longitude,
              markers: that.markers
            })

            if (res.data.data.address) {
              console.log('这是服务器返回的地址信息')
              that.address = res.data.data.address.split(";")[0]
              that.setData({
                address: that.address
              })
            } else {
              that.checkAddress(that.latitude, that.longitude)
            }
            console.log(that.markers)
          } else {
            //没有定位信息，设置默认地址显示
            that.setDefaultAddress();
          }
        }
      });
    }else{
      console.log('没有设备ID，该学生没有绑定设备')
    }
    
  },

  // 点击地图标记地点事件
  markertap: function(){
    
  },
  // 地址反查
  checkAddress: function(lag, log) {
    console.log(lag)
    console.log(log)
    let that = this;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: lag + ',' + log,
        key: app.globalData.mapKey
      },
      success: (res) => {
        console.log('地址反查返回')
        console.log(res.data.result)
        that.address = res.data.result.address
        that.setData({
          address: res.data.result.address
        })
      }
    })

  },
  //没有地址显示，则显示默认地址
  setDefaultAddress: function(){
    let that = this
    console.log('没有地址信息，那么就给他一个默认地址')
    that.markers = markersArray
    that.address = addressText
    that.latitude = latitudeNum
    that.longitude = longitudeNum
    that.setData({
      markers: markersArray,
      address: addressText,
      latitude: latitudeNum,
      longitude: longitudeNum
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  //滑动事件处理(滑动时重复调用多次，num是为了防止重复调用)
  touchmove: function(e) {
    let idx = e.currentTarget.dataset.index;
    let startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = this.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });

    //滑动超过45度角 return
    if (Math.abs(angle) > 45) return;

    if (touchMoveX > startX) { //右滑 2——1

      console.log('111111111111111111111111')
      if (this.currentIndex == 0) return;//我加的，防止
      console.log('卡一过')

      console.log(this.currentIndex)
      console.log(this.childrenlist.length)

      this.currentIndex = idx == 0 ? 0 : idx - 1
      this.setData({
        currentIndex: idx == 0 ? 0 : idx - 1,
        cardRightIn: false,
        cardLeftIn: true
      })
      if (idx != num) {
        console.log('获取信息1')
        // 获取人脸记录
        this.getRecords();
        //获取孩子定位信息
        this.getLocation();
        num = idx
      }

    } else {//左滑 1——2

      console.log('22222222222222222222222')
      if (this.currentIndex == this.childrenlist.length - 1) return;//我加的
      console.log('卡二过')

      this.currentIndex = idx == this.data.childrenlist.length - 1 ? idx : idx + 1

      this.setData({
        currentIndex: idx == this.data.childrenlist.length - 1 ? idx : idx + 1,
        cardRightIn: true,
        cardLeftIn: false
      })

      if (idx != num) {
        console.log('获取信息2')
        // 获取人脸记录
        this.getRecords();
        //获取孩子定位信息
        this.getLocation();
        num = idx
      }
    }
    wx.pageScrollTo({
      scrollTop: 0
    })


  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },



  // 跳转记录
  // toRecord: function(e) {
  //   let data = e.currentTarget.dataset.value;
  //   console.log(111,e)
  //   // 判断会员信息
  //   wx.navigateTo({ url: '../record/record?stu_number=' + data.number + '&device_id=' + data.face_id})
  // },
  // 跳转历史记录
  toRecord: function(e) {
    let history_data = e.currentTarget.dataset.value;
    wx.navigateTo({ url: '../history/history?school_id=' + history_data.school_id + '&number=' + history_data.number})
  },


  // 日历选择(显示日历)
  calendar: function(e) {
    console.log(1111, e)
    this.currentIndex = e.currentTarget.dataset.index;
    let data = this.childrenlist;
    console.log(this.currentIndex)
    data[this.currentIndex].calendar_state = true;
    console.log(data[this.currentIndex].calendar_state)
    this.childrenlist = data;
    this.setData({
      childrenlist: data
    })
  },
  // 监听点击下个月事件
  next: function(event) {
    console.log(event.detail);
  },
  // 监听点击上个月事件
  prev: function(event) {
    console.log(event.detail);
  },
  // 监听点击日历标题日期选择器事件
  dateChange: function(event) {
    console.log(event.detail);
  },
  // 隐藏日历遮罩弹框
  hideMask: function(){
    console.log(this.currentIndex);
    this.childrenlist[this.currentIndex].calendar_state = false;
    this.setData({
      childrenlist: this.childrenlist
    })
  },
  // 监听点击日历具体某一天的事件
  dayClick: function(event) {
    console.log(event.currentTarget.dataset.index);
    console.log(event.detail);
    let data = this.childrenlist;
    let gregorian = Lunar.getdateTime(event.detail.year, event.detail.month, event.detail.day);
    let lunar = Lunar.toLunar(event.detail.year, event.detail.month, event.detail.day);

    data[this.currentIndex].gregorian = gregorian;
    data[this.currentIndex].lunar = lunar;
    // 隐藏日历
    data[this.currentIndex].calendar_state = false;
    this.childrenlist = data;
    this.setData({
      childrenlist: data
    })
    // 获取人脸记录
    this.getRecords();
    //获取孩子定位信息
    this.getLocation();
  },
  // 去提交formID
  getFormID: function (e) {
    console.log('formID:' + e.detail.formId);
    app.submitFormID(e.detail.formId);
  },
  // 分享转发
  onShareAppMessage: function () {
    return {
      title: "孩子实时安全信息",
      // cnontent: this.data.summer_theme,
      imageUrl: "http://babihu2018-1256705913.cos.ap-guangzhou.myqcloud.com/bbh/2018/153544836305312.jpg"
    }
  }

})