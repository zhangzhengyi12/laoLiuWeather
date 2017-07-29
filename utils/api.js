function getWeatherNow(city){
  let key = "a8516e092b44467baf0cb1eac33247cc"
  return new Promise((reslove,reject)=>{
    wx.request({
      url: 'https://free-api.heweather.com/v5/weather',
      data:{
        city,
        key
      },
    success(res){
      //需要生成一个新的对象 内部有Base和now的天气信息
      reslove(res.data.HeWeather5[0])
    },
    fail() {
      console.log("fail")
      reject({ status: 'error', msg: '获取天气失败' })
    }
    })
  })
}


//TODO:需要做一个城市是否合格的检测

function getLocation() {
  return new Promise((resolve, reject) => {
      

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed

        wx.setStorage({
          key: "locationCache",
          data: res.latitude + ',' + res.longitude
        })
        //缓存信息
        resolve(res.latitude + ',' + res.longitude)
      },
      fail() {
        resolve('')
      }
    })
  })
}

function getLocationToCache() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'locationCache',
      success: function (res) {
        resolve(res.data)
      },
      fail:function (){
        reject()
      }
    })
  })
}

//传入所有的接口 传出一个统一的对象 对象内部有不同的BGURL 数字排列
function setWeatherIocn(...api){
    let bg = [];

    for(let aps of api){
      let itemUrl =  getWeatherURLIconURL(aps)
      bg.push(itemUrl)
    }

    return bg;
  
}

function getWeatherURLIconURL(code){
  // URL	
  let bg

  if(code === 100){
    bg = "http://ot7z7wqqo.bkt.clouddn.com/laoLiuWeather%E6%99%B4%E5%A4%A9.png" 
  } else if(code > 100 && code<105){
    bg = "http://ot7z7wqqo.bkt.clouddn.com/laoLiuWeather%E9%98%B4%E5%A4%A9.png"
  } else if (code >199 && code<216){
    bg = "http://ot7z7wqqo.bkt.clouddn.com/feng.png"
  } else if (code > 299 && code < 314){
    bg = "http://ot7z7wqqo.bkt.clouddn.com/laoLiuWeatherxiayu.png"
  } else if(code > 399 && code < 408){
    bg = "http://ot7z7wqqo.bkt.clouddn.com/laoLiuWeatherxue.png"
  } else{
    bg = "http://ot7z7wqqo.bkt.clouddn.com/laoLiuWeather%E9%98%B4%E5%A4%A9.png"
  }
  
  return bg
}


function setHourlyWeather(hourly){
  if(hourly.date){
    let time = (hourly.date).split(" ")[1];
     hourly.date = time;
  }else{
    hourly.date = "22.00";
    hourly.tmp = "30";
    hourly.cond.txt = "晴";
  }

  return hourly;

}



module.exports = {
  getWeatherNow,
  getLocation,
  setWeatherIocn,
  setHourlyWeather,
  getLocationToCache
}

//别忘了导出模块