//app.js
App({
  onLaunch: function (ops) {
    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //用户由微信群分享进入本应用,获取shareTicket
    //   if (ops.scene == 1044) {     
    //     console.log("1044 share ticket=>" + ops.shareTicket)
    //     wx.getShareInfo({
    //       shareTicket: ops.shareTicket,
    //       complete(res){
    //       console.log(res)
    //       }
    //     })
     
    // }

    //这里存在异步的问题,即globaldata中的数据还没准备好,别的页面有可能已经要使用它了了.先通过setInterval函数解决
    const that = this;
    wx.request({
         url: that.globalData.appUrl+'/api/authenticate',
          data: {"password":"ff",
                "rememberMe":true,
                "username":""
                },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function(res){
            that.globalData.token = res.data.id_token;
            wx.setStorageSync('token',res.data.id_token);
            console.log("that.globa lData.token==>"+that.globalData.token);
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
   
  },
  //这个是全局函数,可以在分页面中调用,取得全局变量
  getUserInfo:function(cb,callback){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      
      //调用登录接口
      wx.login({
        success: function (result) {console.log("调用wx.login接口"+result.code);
          var d =  that.globalData;
            if(result.code){
            var xxx = setInterval(function(){//每隔1秒读取token的值,token有值了,才执行获取openid的操作
              if(that.globalData.token){
               console.log("app.js***app.globalData.token=================="+that.globalData.token)
               clearInterval(xxx);//token有值后退出循环
                  wx.getUserInfo({
                    success: function (res) {
                      //注意此时获得的的res中的user中不包含openid,需要从后台获取.
                      //得到openid
                      
                      wx.request({
                        url: that.globalData.appUrl+'/api/getSessionOrOpenid?resCode='+result.code,
                        header: {
                          Authorization:"Bearer "+that.globalData.token
                        },
                        method: 'GET', 
                        success: function(resWithOpenid){
                          
                         
                          res.userInfo.openid = resWithOpenid.data.openid;
                          console.log("app中调用后台得到openid=>"+resWithOpenid.data.openid);
                          res.userInfo.session_key = resWithOpenid.data.session_key;
                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                          if (!wx.getStorageSync('LoginSessionKey'))
                          wx.setStorageSync('LoginSessionKey',that.globalData.userInfo)
                          
                          callback();
                        },
                        fail: function() {
                          console.log("获取Openid信息失败");
                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                      })                 
                    }
                })
              }
            },1000)
            // wx.getUserInfo({
            //   success: function (res) {
            //     //注意此时获得的的res中的user中不包含openid,需要从后台获取.
            //     //得到openid
                
            //     wx.request({
            //       url: that.globalData.appUrl+'/api/getSessionOrOpenid?resCode='+result.code,
            //       header: {
            //         Authorization:"Bearer "+that.globalData.token
            //       },
            //       method: 'GET', 
            //       success: function(resWithOpenid){
                    
            //         debugger;
            //         res.userInfo.openid = resWithOpenid.data.openid;
            //         console.log("app中调用后台得到openid=>"+resWithOpenid.data.openid);
            //         that.globalData.userInfo = res.userInfo
            //         typeof cb == "function" && cb(that.globalData.userInfo)
            //         wx.setStorageSync('LoginSessionKey',that.globalData.userInfo)
            //          var loginUser1 = wx.getStorageSync('LoginSessionKey');
            //         console.log("app中设置缓存后得到openid==>"+loginUser1.openid);
            //         callback();
            //       },
            //       fail: function() {
            //         console.log("获取Openid信息失败");
            //         that.globalData.userInfo = res.userInfo
            //         typeof cb == "function" && cb(that.globalData.userInfo)
            //       }
            //     })                 
            //   }
            // })
          }
          else{
            console.log('获取用户登录状态失败!'+result.errMsg);
          }
        }
      })
    }
    
  },
  
  globalData:{
    userInfo:null,
    token:"",
     //appUrl:'https://19338678.qcloud.la/hou'
     appUrl:'https://96049019.aga-mask.com/hou'
     //appUrl:'https://19338678.qcloud.la'
     //appUrl:'http://localhost:8494/hou'
    //appUrl:'http://localhost:8913',
    // appId:'wx41bce4f14ed1c59c',
    // secret:'12665418bda1be8d12ecbacbb22d07f2',

  }
  
})