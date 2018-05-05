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
    wx.showLoading({  
        title: '加载中',  
        mask:true  
    }) 
    //判断是否登录,如果没有登录,则去init页面
    //在init页面判断是否新用户,如果是新用户,则初始化用户数据,并登录;如果是已经存在的用户,则让用户登录后,跳转到计算结果页.
    //如果是已登录用户,则直接去计算结果页
     //wx.removeStorageSync('LoginSessionKey')
    //  if(!app.globalData.token)

    //  var globaltoken = app.globalData.token;
    //  console.log("index中的token==>"+globaltoken);
    var userInfo = wx.getStorageSync("LoginSessionKey");
    var openid = userInfo.openid;
    console.log("index里面判断缓存有值时时,openid==>"+openid);
    if(!wx.getStorageSync("LoginSessionKey")){//如果缓存里没有记录,则去initinfo页面
      wx.redirectTo({
            url:'../initinfo/initinfo'
          });
    }else{
      
      app.getUserInfo(function(){},function(){});
      wx.redirectTo({
        url: '../caculator/caculator?openid='+openid,
        fail: function() {
          console.log("导航到计算结果页面失败");
        }
      })
    }
    
   
  }
})
