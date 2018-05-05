var app = getApp();
Page({
    data: {
    items: [],
    buttonvalue:'提交',
    disabled:false,
    payValue:'',
    productContent:'',
    payprodcomplex:'',
    openid:'',
    canIUseShare: wx.canIUse('button.open-type.share'),//分享功能低版本兼容性检查
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value,'name为=>',e.detail.name)
    this.setData({
      payprodcomplex:e.detail.value,
      buttonvalue:'提交',
      disabled:false
    })
  },

  remindNoshare: function (event) {
    wx.showModal({
      title: "友情提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      showCancel: false
    });
  },
  onShareAppMessage: function (res) {
    const that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: '小程序来帮您科学避孕!',
      desc: '安全期随时看!简单输入一下，安全期尽在掌握！',
      path: 'pages/index/index',
      imageUrl: '/images/1.jpg',
      success: function (res) {
        if (res.shareTickets != undefined && res.shareTickets[0]) {
          var sharetick = res.shareTickets[0];
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success(shareres) {
              wx.request({
                url: app.globalData.appUrl + '/api/shareReward',
                method: 'POST',
                header: {
                  Authorization: "Bearer " + app.globalData.token
                },
                data: {
                  openid: app.globalData.userInfo.openid,
                  baseproductname: 'anquanqi',
                  iv: shareres.iv,
                  encryptedData: shareres.encryptedData,
                  getShareInfo: shareres.errMsg,
                  sessionKey: app.globalData.userInfo.session_key,
                  shareticket: sharetick
                },
                success: function (restres) {
                  console.log("endDate==>" + restres.data.endDate);
                  wx.showModal({
                    title: '本次分享结果:',
                    showCancel: false,
                    content: restres.data.message,
                    success(shareresult) {
                      if (shareresult.confirm) {
                        wx.redirectTo({
                          url: '../caculator/caculator?openid=' + that.data.openid,
                          fail: function () {
                            console.log("导航到计算结果页面失败");
                          }
                        })
                      }
                    }
                  })
                }
              })
            },
            complete(res) {
              console.log(res)
            }
          })
        }
        else {
          wx.showModal({
            title: '本次分享结果:',
            showCancel: false,
            content: '要分享到群里才有效哦!',
          })
        }
      },
      fail: function (res) {
        console.log("转发失败!");
      }
    }
  },

  formSubmit: function(e){

    const that = this;
    this.setData({
      disabled:true,
      buttonvalue:'请稍等...'
    })
    var product = this.data.payprodcomplex.split("-")[0];
    var payValue = this.data.payprodcomplex.split("-")[1];
    wx.request({
      url: app.globalData.appUrl+'/api/placeorder',
      data: {
        'openid':that.data.openid,
        'price':payValue,
        'productContent':product
        },
      method: 'POST', 
      header: {                 
            Authorization:"Bearer "+app.globalData.token
            },
      success: function(res){
           var prepay_id = res.data.prepay_id;
           console.log("统一下单返回 prepay_id:"+prepay_id);
           //对prepay_id再签名
                wx.request({
                    url: app.globalData.appUrl+'/api/signagain',
                    data: {'prepay_id':prepay_id},
                    method: 'POST', 
                    header: {
                         Authorization:"Bearer "+app.globalData.token
                    }, 
                    success: function(res){
                            wx.requestPayment({
                            timeStamp: res.data.timeStamp,
                            nonceStr: res.data.nonceStr,
                            package: res.data.package,
                            signType: 'MD5',
                            paySign: res.data.paySign,
                            success: function(res){
                                console.log("调用微信支付后返回的支付结果=>"+res);
                                wx.redirectTo({
                                  url: '../caculator/caculator?openid='+that.data.openid,
                                  success: function(res){
                                  },
                                  fail: function() {
                                    console.log("支付成功后导航到计算结果页失败!")
                                  },
                                 
                                })
                            },
                            fail: function() {
                               console.log("调用微信支付失败!");
                               that.setData({
                                 buttonvalue:'提交',
                                 disabled:false
                               })
                            },
                           
                            })
                    },
                    fail: function() {
                    console.log("调用再次签名失败");
                    },
                    
                })
      },
      fail: function() {
        console.log("请求预支付失败!");
      },
      
    })
  },

  onLoad(params){
    const that = this;
    console.log("params.openid==>"+params.openid);
    this.setData({
      openid: params.openid
      // payValue:0.01,
      // productContent:'2years',
    })
      wx.request({
        url: app.globalData.appUrl+'/api/childrenProducts/anquanqi',
        data: {},
        method: 'GET', 
        header: {
          Authorization:"Bearer "+app.globalData.token
        }, 
        success: function(res){
          var  items = new Array();
          for(var i=0;i<res.data.length;i++){
            if(i==res.data.length-1){
              items.push({name:res.data[i].name+'-'+res.data[i].price,value:res.data[i].pimage+'('+res.data[i].price+'元)',checked:'true'})
              that.setData({
                payprodcomplex:res.data[i].name+'-'+res.data[i].price
              })
            }
            else
              items.push({name:res.data[i].name+'-'+res.data[i].price,value:res.data[i].pimage+'('+res.data[i].price+'元)'})
          }
          that.setData({
            items:items
          })

        },
        fail: function() {
          console.log("请求产品详情失败!")
        },
        
      })
  }
})