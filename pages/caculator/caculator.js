var app = getApp();
Page({
    data:{
        firstdate:"",
        averageperiod:"",
        anquanqi:"安全期",
        title1:"",
        listData:"",
        previouMonth:"",
        nextMonth:"",
        pageMonth:"",
        pageYear:"",
        openid:"",
        currentYear:"",
        currentMonth:"",
        currentDate:"",
        usestatus:"PROBATION",
        useInfo:'',
        canIUseShare: wx.canIUse('button.open-type.share'),//分享功能低版本兼容性检查
        lunariaid:'',
        leftDay:""//用户使用产品还剩余的天数 enddate-fromdate
    },
    remindNoshare:function(event){
        wx.showModal({
            title:"友情提示",
            content:"当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel:false
        });
    },
    goadjust:function(event){
      console.log("lunariaid==>" + this.data.lunariaid);
        wx.redirectTo({
          url: '../adjust/adjust?lunariaid=' + this.data.lunariaid + '&openid=' + this.data.openid + '&firstdate='+this.data.firstdate
          + '&averageperiod=' + this.data.averageperiod
        })
    },
    gosleep: function (event) {
      console.log("gosleep==>");
      wx.redirectTo({
        url: '../sleep/sleep'
      })
    },
    onShareAppMessage: function (res) { 
      const that = this;
      wx.showShareMenu({
      withShareTicket: true
      })
      return {
        title: '小程序帮您科学避孕!',
        desc: '安全期随时看!简单输入一下，安全期尽在掌握！',
        path: 'pages/index/index',
        imageUrl:'/images/1.jpg',
        success: function (res) {
          if (res.shareTickets!=undefined && res.shareTickets[0]){
            var sharetick = res.shareTickets[0];
            wx.getShareInfo({
              shareTicket: res.shareTickets[0],
              success(shareres){
                wx.request({
                  url: app.globalData.appUrl + '/api/shareReward',
                  method: 'POST', 
                  header: {
                    Authorization: "Bearer " + app.globalData.token
                  }, // 设置请求的 header
                  data:{
                    openid: app.globalData.userInfo.openid,
                    baseproductname:'anquanqi',
                    iv: shareres.iv,
                    encryptedData: shareres.encryptedData,
                    getShareInfo: shareres.errMsg,
                    sessionKey: app.globalData.userInfo.session_key,
                    shareticket: sharetick
                  },
                  success:function(restres){
                    console.log("endDate==>" + restres.data.endDate);
                      wx.showModal({
                        title: '本次分享结果:',
                        showCancel: false,
                        content: restres.data.message,
                        success(shareresult){
                          if (shareresult.confirm){
                            if (restres.data.endDate){
                                that.setData({
                                  leftDay: parseInt((new Date(restres.data.endDate).getTime() - new Date().getTime())/86400000)
                                })
                            }
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
          else{
            wx.showModal({
              title: '本次分享结果:',
              showCancel: false,
              content: '要分享到群里才有效哦!',
            })
          }
        },
        fail: function(res) {
          console.log("转发失败!");
        }
      }
  },
    previousClick:function(event){
        var pageMonth = event.target.dataset.pagemonth;
        var pageYear = event.target.dataset.pageyear;
        wx.redirectTo({
          url: '../caculator/caculator?openid='+this.data.openid+'&pageMonth='+pageMonth+'&pageYear='+pageYear+'&action=previous',
          success: function(res){
           
          },
          fail: function() {
            console.log("计算结果页,页内跳转失败!");
          }
        })
        console.log("上一个月"+event);
    },
    nextClick:function(event){
        
        var pageMonth = event.target.dataset.pagemonth;
        var pageYear = event.target.dataset.pageyear;
        wx.redirectTo({
          url: '../caculator/caculator?openid='+this.data.openid+'&pageMonth='+pageMonth+'&pageYear='+pageYear+'&action=next',
          success: function(res){
           
          },
          fail: function() {
            console.log("计算结果页,页内跳转失败!");
          }
        })
        console.log("下一个月");
    },
    clearStorage:function(){
        wx.clearStorage({
          key: 'LoginSessionKey',
          success: function(res){
            console.log("清除缓存成功!");
          },
        })
    },
    buyproduct:function(event){
        const that = this;
        wx.redirectTo({
        url: '../pay/pay?openid='+that.data.openid,
        fail: function() {
          console.log("导航到支付页面失败");
        }
      })
    },
    calendar:{
        //构造日期数据
        createListData:function(year,month,inputInitDate,averageperiod,inputYear,inputMon){
           var mon = month -1;
            var firstDay = new Date(year,mon,1).getDay();
            firstDay = firstDay==0?7:firstDay
            console.log("firstday==>"+firstDay);
            var days = new Date(year,month,0).getDate();
            var totalRow =  Math.ceil((days+firstDay-1)/7)
            var aData = new Array(totalRow);         
            for(var i=0;i<totalRow;i++){
                var fields = this.createFields();
                fields.Monday.value = (7-firstDay+(i-1)*7+2<=0||7-firstDay+(i-1)*7+2>days)?'':7-firstDay+(i-1)*7+2;
                fields.Monday.color = this.getMoonColor(year,mon,fields.Monday.value,inputInitDate,averageperiod,inputYear,inputMon);
                
                fields.Tuesday.value = (7-firstDay+(i-1)*7+3<=0||7-firstDay+(i-1)*7+3>days)?'':7-firstDay+(i-1)*7+3;
                fields.Tuesday.color = this.getMoonColor(year,mon,fields.Tuesday.value,inputInitDate,averageperiod,inputYear,inputMon);

                fields.Wensday.value = (7-firstDay+(i-1)*7+4<=0||7-firstDay+(i-1)*7+4>days)?'':7-firstDay+(i-1)*7+4;
                fields.Wensday.color = this.getMoonColor(year,mon,fields.Wensday.value,inputInitDate,averageperiod,inputYear,inputMon);

                fields.Thursday.value = (7-firstDay+(i-1)*7+5<=0||7-firstDay+(i-1)*7+5>days)?'':7-firstDay+(i-1)*7+5;
                fields.Thursday.color = this.getMoonColor(year,mon,fields.Thursday.value,inputInitDate,averageperiod,inputYear,inputMon);

                fields.Friday.value =(7-firstDay+(i-1)*7+6<=0||7-firstDay+(i-1)*7+6>days)?'':7-firstDay+(i-1)*7+6;
                fields.Friday.color = this.getMoonColor(year,mon,fields.Friday.value,inputInitDate,averageperiod,inputYear,inputMon);

                fields.Saturday.value =(7- firstDay+(i-1)*7+7<=0||7-firstDay+(i-1)*7+7>days)?'':7-firstDay+(i-1)*7+7;
                fields.Saturday.color = this.getMoonColor(year,mon,fields.Saturday.value,inputInitDate,averageperiod,inputYear,inputMon);

                fields.Sunday.value = (7-firstDay+(i-1)*7+8<=0||7-firstDay+(i-1)*7+8>days)?'':7-firstDay+(i-1)*7+8;
                fields.Sunday.color = this.getMoonColor(year,mon,fields.Sunday.value,inputInitDate,averageperiod,inputYear,inputMon);
                aData[i] = fields;
            }
             
            return aData;
        },
        createFields:function(){ 
            var fields = {
                Monday:{},
                Tuesday:{},
                Wensday:{},
                Thursday:{},
                Friday:{},
                Saturday:{},
                Sunday:{}
            }
            return fields;
        },
        getMoonColor:function(year,mon,date,inputInitDate,averageperiod,inputYear,inputMon){
            var color = "";
            if(date=='')
            return color;
            var secondUnit = 24 * 60 * 60 * 1000;
            //var dateTime = new Date(Date.UTC(year,mon,date)).getTime();
            var dateTime = new Date(Date.UTC(year,mon,date)).getTime();
            var inputInitTime = new Date(Date.UTC(inputYear,inputMon-1,inputInitDate)).getTime();
            var dayDiff = Math.floor((dateTime - inputInitTime) / secondUnit);
            var result = (dayDiff % averageperiod + averageperiod) % averageperiod;
            if(result >= 0 && result <= 4){	
                color = "#FAE371";//黄色
            }else if(result >= 5 && result <= (averageperiod - 20)){
                color = "#6BC235";//绿色
            }else if(result >= (averageperiod - 19) && result <= (averageperiod - 10)){
                color = "#FF4364";//红色
            }else if(result >= (averageperiod - 9) && result <= (averageperiod - 1)){
                color = "#6BC235";//绿色
            }
            return color;
        },

    },
    onLoad(params){
        
        wx.showLoading({  
            title: '加载中',  
            mask:true  
        }) ;
        var current =  new Date();
       this.setData({
           currentYear: current.getFullYear(),
           currentMonth: current.getMonth()+1,
           currentDate:current.getDate()
       })
       const _this = this; 
       var xxx = setInterval(function(){//每隔1秒读取token的值,token有值了,才执行获取数据的操作
           if(app.globalData.token){
               console.log("app.globalData.token=================="+app.globalData.token)
               clearInterval(xxx);
                    wx.request({
                        url: app.globalData.appUrl+'/api/getweixinuser/'+params.openid,
                        
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        header: {
                            
                                Authorization:"Bearer "+app.globalData.token
                        }, // 设置请求的 header
                        success: function(res){
                            _this.setData({
                                firstdate:res.data.lunariaInfo.firstdate,
                                averageperiod:res.data.lunariaInfo.averageperiod,
                                openid:params.openid,
                                lunariaid: res.data.lunariaInfo.id
                            })
                            if(res.data.produses[0]){
                                _this.setData({
                                    usestatus:res.data.produses[0].usestatus,
                                    leftDay: parseInt((new Date(res.data.produses[0].enddate).getTime() - new Date().getTime()) / 86400000)
                                })
                            }


                            var inputDate = new Date(_this.data.firstdate);
                            var inputYear = inputDate.getFullYear();
                            var inputMonth = inputDate.getMonth()+1;
                            var inputInitDate = inputDate.getDate();
                            var nowYear = "";
                            var nowMonth = "";
                        
                            if(!params.pageMonth){//不是由用户点击上一个月,下一个月过来的(即初始计算结果页)

                                nowYear = new Date().getFullYear();
                                nowMonth = new Date().getMonth()+1;
                                _this.setData(
                                    { title1:nowYear+"年"+nowMonth+"月",
                                        previouMonth:nowMonth-1,
                                        nextMonth:nowMonth+1,
                                        pageYear:nowYear
                                    }
                                )
                               
                            }else{
                                
                                var pageYear = parseInt(params.pageYear);
                                var pageMonth = parseInt(params.pageMonth);
                                nowYear = pageYear;
                                nowMonth = pageMonth;
                                var action = params.action;
                                if(action=='previous'&&pageMonth==0){
                                    nowYear = pageYear-1;
                                    nowMonth = pageMonth+12;
                                }
                                if(action=='next'&&pageMonth==13){
                                    nowYear = pageYear+1;
                                    nowMonth = pageMonth-12
                                }
                                
                                _this.setData(
                                    { title1:nowYear+"年"+nowMonth+"月",
                                        previouMonth:nowMonth-1,
                                        nextMonth:nowMonth+1,
                                        pageYear:nowYear
                                    }
                            )
                            }
                            
                            
                            var aData = _this.calendar.createListData(nowYear,nowMonth,inputInitDate,_this.data.averageperiod,inputYear,inputMonth);
                            _this.setData({listData:aData});
                            wx.hideLoading();
                            if(_this.data.usestatus=='PROBATION'){
                                _this.setData({
                                    useInfo :'试用'
                                })
                            }
                            if(_this.data.usestatus=='PAY'){
                                _this.setData({
                                    useInfo :'付费'
                                })
                            }
                            if(_this.data.usestatus=='UNPAY'){
                                wx.showModal({
                                        title: '提示',
                                        content: '您的试用期已经结束,请付费继续使用!',
                                        showCancel:false,
                                        success: function(res) {
                                            if (res.confirm) {
                                               console.log("params.openid=====>"+params.openid);
                                                wx.redirectTo({
                                                url: '../pay/pay?openid='+params.openid,
                                                fail: function() {
                                                console.log("导航到支付页面失败");
                                                }
                                            })
                                            } 
                                        }
                                        })
                            }
                        },
                        fail: function() {
                            // fail
                        }
                })   
           } 
       },1000) 
     
           
    }
});