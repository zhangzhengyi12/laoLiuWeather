let API = require('../../utils/api')
let util = require('../../utils/util')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
   
    
      //首先获取城市的地址

      API.getLocationToCache()
      .then(function (loca) {
        return new Promise((resolve, reject) => {
          resolve(loca)
        })
      }, function (err) {
        API.getLocation()
      })
      .then(API.getWeatherNow)
      .then((WeatherData)=>{
        //处理最近天气
        // let time = (WeatherData.hourly_forecast[0].date).split(" ")[1];
        // WeatherData.hourly_forecast[0].date = time;
        WeatherData.hourly_forecast[0] = API.setHourlyWeather(WeatherData.hourly_forecast[0]);
        //处理backimg
        let bg = API.setWeatherIocn(
          WeatherData.daily_forecast[0].cond.code_d,
          WeatherData.daily_forecast[1].cond.code_d,
          WeatherData.daily_forecast[2].cond.code_d,
        );
        WeatherData.bg = bg;



        that.setData({WeatherData})
        that.setData({ "loadingHidden": true, "loadingHiddenModal":true })
        wx.hideNavigationBarLoading()
      })
   
  },

  // 下拉刷新

  onPullDownRefresh(){
    var that = this
    // 打开Loading动画
    wx.showNavigationBarLoading()
    this.setData({ "loadingHidden": false })

    
    //首先获取城市的地址
      API.getLocation()
      .then(API.getWeatherNow)
      .then((WeatherData) => {

        // let time = (WeatherData.hourly_forecast[0].date).split(" ")[1];
        // WeatherData.hourly_forecast[0].date = time;
        //处理backimg
         WeatherData.hourly_forecast[0] = API.setHourlyWeather(WeatherData.hourly_forecast[0]);
        let bg = API.setWeatherIocn(
          WeatherData.daily_forecast[0].cond.code_d,
          WeatherData.daily_forecast[1].cond.code_d,
          WeatherData.daily_forecast[2].cond.code_d,
        );
        WeatherData.bg = bg;

        WeatherData.time = util.formatTime(new Date)
        that.setData({ WeatherData })
        that.setData({ "loadingHidden": true})
        wx.hideNavigationBarLoading()
      })
  }
})
