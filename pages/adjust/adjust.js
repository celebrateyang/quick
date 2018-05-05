var app = getApp();
Page({
  data: {
    date: '',
    cycle: 0,
    userInfo: {},
    openid: '',
    disabled: false,
    remindtext: '',
    buttonvalue: '提交',
    lnunariaid:''
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  
  formSubmit:function(e){
    this.setData({
      date: e.detail.value.initdate,
      cycle: e.detail.value.cycle,
    })
    if (!this.data.date) {
      wx.showModal({
        title: "友情提示",
        content: "请选择您或她的月经第一天",
        showCancel: false
      });
      return;
    }
    if (!this.data.cycle) {
      wx.showModal({
        title: "友情提示",
        content: "请输入您或她的月经周期",
        showCancel: false
      });
      return;
    } else if (this.data.cycle < 24 || this.data.cycle > 40) {
      wx.showModal({
        title: "友情提示",
        content: "月经周期应该处于24天到到40天之间",
        showCancel: false
      });
      return;
    }
    this.setData({
      disabled: true,
      buttonvalue: '请稍等...'
    })
    const _this = this;
    wx.request({
      url: app.globalData.appUrl + '/api/lunaria-infos',
      data: {
        "averageperiod": _this.data.cycle,
        "firstdate": _this.data.date,
        "id": _this.data.lnunariaid,
       
      },
      method: 'PUT',
      header: { Authorization: "Bearer " + app.globalData.token }, // 设置请求的 header
      success: function (res) {
        // 跳转到计算结果页
        console.log("保存后导航到caculator" + _this.data.openid);
        wx.navigateTo({
          url: '../caculator/caculator?openid=' + _this.data.openid,
          fail: function () {
            console.log("导航到计算结果页面失败");
          }
        })
      },
      fail: function () {
        // 跳转到错误页面
        console.log("修改月经信息失败!")
      }
    })
  },
  onLoad: function (params) {
    var that = this;
    this.setData({
      lnunariaid: params.lunariaid,
      openid:params.openid,
      date: params.firstdate,
      cycle: params.averageperiod
    })
  }
});