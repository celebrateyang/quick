var app = getApp();
Page({
    data:{
        date:'',
        cycle:0,
        userInfo:{},
        openid:'',
        disabled:false,
        remindtext:'',
        buttonvalue:'提交'
    },
    
bindDateChange:function(e){
    this.setData({
        date:e.detail.value
    })
    console.log("===>"+this.data.date)
},
clearStorage:function(){
        wx.clearStorage({
          key: 'LoginSessionKey',
          success: function(res){
            console.log("清除缓存成功!");
          },
        })
    },
formSubmit: function(e) {
    this.setData({
        date:e.detail.value.initdate,
        cycle:e.detail.value.cycle,
    })
    if(!this.data.date){
        wx.showModal({
            title:"友情提示",
            content:"请选择您或她的月经第一天",
            showCancel:false
        });
        return;
    }
    if(!this.data.cycle)
    {
        wx.showModal({
            title:"友情提示",
            content:"请输入您或她的月经周期",
            showCancel:false
        });
        return;
    }else if(this.data.cycle<24||this.data.cycle>40){
        wx.showModal({
            title:"友情提示",
            content:"月经周期应该处于24天到到40天之间",
            showCancel:false
        });
        return;
    }

    

    // if(!this.data.openid){
    //     const that = this;
    //     wx.showModal({
    //         title:"友情提示",
    //         content:"请授权读取微信用户信息,否则无法正常进入系统!授权完后,请点击左上角的返回图标,就可以继续啦!",
    //         showCancel:false,
    //         success:function(res){
    //             wx.openSetting({
    //                 success:function(res){
    //                     if(res.authSetting["scope.userInfo"]){
    //                       console.log("获得了用户授权");
    //                       //获得了用户授权后再调用一下登录
    //                       app.getUserInfo(function(userInfo){
    //                           that.setData({
    //                               userInfo:userInfo
    //                           })    
    //                       },function(){
    //                           var loginUser = app.globalData.userInfo;     
    //                               that.setData({
    //                                   openid:loginUser.openid
    //                               })
                              
    //                       });
    //                     }
    //                 }
    //             });
    //         }
    //     });
    //     return;
    // }

    this.setData({
            disabled:true,
            buttonvalue:'请稍等...'
        })

    const _this = this;
    if(!this.data.openid){
      this.data.openid = wx.getStorageSync("LoginSessionKey").openid;
      if (!this.data.openid) {
        app.getUserInfo(function (userInfo) {
                              that.setData({
                                  userInfo:userInfo
                              })    
                          },function(){
                              var loginUser = app.globalData.userInfo;     
                                  that.setData({
                                      openid:loginUser.openid
                                  })

                          });
        console.log("==========================================================");
        this.data.openid = app.globalData.userInfo.openid;
        if (!this.data.openid){
          console.log("openid 还是空！");
        }
      }
    }
    wx.request({
                  url: app.globalData.appUrl+'/api/weixinuser-lunaria',
                  data: {
                                    
                        "averageperiod": _this.data.cycle,
                        "firstdate": _this.data.date,
                        "avatarUrl": _this.data.userInfo.avatarUrl,
                        "city": _this.data.userInfo.city,
                        "country": _this.data.userInfo.country,
                        "gender": _this.data.userInfo.gender,         
                        "nickName": _this.data.userInfo.nickName,
                        "openid": _this.data.openid,
                        "province": _this.data.userInfo.province,
                        "productname":"anquanqi"
                  },
                  method: 'POST', 
                  header: {Authorization:"Bearer "+app.globalData.token}, // 设置请求的 header
                  success: function(res){
                    //保存用户信息到缓存    
                    wx.setStorageSync('LoginSessionKey',app.globalData.userInfo)  
                    // 跳转到计算结果页
                    console.log("保存后导航到caculator"+_this.data.openid);
                        wx.navigateTo({
                                            url: '../caculator/caculator?openid='+ _this.data.openid,
                                            fail: function() {
                                                console.log("导航到计算结果页面失败");
                                            }
                                        })  
                  },
                  fail: function() {
                    // 跳转到错误页面
                    console.log("保存用户信息失败!"+_this.data.userInfo.nickName+"=="+ _this.data.openid)
                    }
                })
  },

    onLoad: function(){
        var that = this;
       //调用全局的登录 
       app.getUserInfo(function(userInfo){
                    that.setData({
                        userInfo:userInfo
                    })    
                },function(){
                    
                    //  var loginUser = wx.getStorageSync('LoginSessionKey');  
                  var loginUser = wx.getStorageSync("LoginSessionKey") || app.globalData.userInfo;     
                     //   console.log("initinfo中页面初始化时时,缓存中的loginUser.openid===>"+loginUser.openid); 
                        that.setData({
                            openid:loginUser.openid
                        })
                        //判断该用户是否已经注册
                        wx.request({
                        url: app.globalData.appUrl+'/api/getweixinuser/'+loginUser.openid,
                        header: {
                            Authorization:"Bearer "+app.globalData.token
                        },
                        method: 'GET', 
                        success: function(existOpenidUser){
                            
                            console.log("existOpenidUser==>"+existOpenidUser);
                            if(existOpenidUser.statusCode=='200'){
                              console.log("openid存在,是已注册用户");
                                    wx.redirectTo({
                                    url: '../caculator/caculator?openid='+loginUser.openid,
                                    fail: function() {
                                        console.log("导航到计算结果页面失败");
                                    }
                                })  
                            } else{

                              // wx.showModal({
                              //   title: "上海护理友情提示",
                              //   content: "本小程序旨在帮您管理记录[安全期][易孕期],轻巧易用,希望您喜欢!",
                              //   showCancel: false
                              // });
                              //为防止万一用户不提交月经记录,而这时缓存里又有了用户记录.下次用户进来,会导致直接进入caculator页面
                              //而这时后台事实是没有该用户存在的,用户想重新注册也没有机会了.所以这里清一下缓存.
                              wx.clearStorage({
                                key: 'LoginSessionKey',
                                success: function (res) {
                                  console.log("清除缓存成功!");
                                },
                              })
                                console.log("访问getweixinuser返回码不正常,返回码是=>"        +existOpenidUser.statusCode);
                            }                   
                        },
                        fail: function() {
                            console.log("判断用户是否已经注册,失败");
                        }
            
                    })
                })    
    }
});