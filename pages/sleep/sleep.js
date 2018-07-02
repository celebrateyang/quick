//index.js
//获取应用实例
const app = getApp()
var colorUtil = require('/util/colordeal.js');
var cloudUtil = require('/util/cloudAnima.js');
var netUtil = require('../network/net.js');


Page({
  data: {
    playMusicName: '自然风声',
    playMusicDes: '聆听大自然最质朴的声音',
    playBgOrignColor: 'pink',//历史颜色
    playBgOrignColorEnd: '#f0f0f0',//历史颜色  
    playBgClorStart: 'pink',//当前颜色
    playBgClorEnd: '#f0f0f0',//渐变色
    playIndex: 0,//当前播放的索引位置
    isPlay: false,
    userInfo: {},
    playsrc: '../res/wind128.png',
    playbtn: '../res/play.png',
    pausebtn: '../res/pause.png',
    prebtn: '../res/pre.png',
    nextbtn: '../res/next.png',
    listbtn: '../res/list.png',
    likebtn: '../res/left.png',
    cloud1: '../res/cloud_one.png',
    cloud2: '../res/cloud_two.png',
    cloud3: '../res/cloud_three.png',
    voice: '../res/voice.png',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isBottomSheetVisiable: false,//是否显示弹框标识
    openid:'',

    //testData
    array: [{
      musicName: '自然之声',
      musicDes: '聆听大自然的声音',
      musicImg: '../res/wind128.png',
      musicImgSmall: '../res/wind.png',
      musicBgStart: '#005F8C',
      musicBgEnd: '#f0f0f0',
      musicSrc: 'http://dl.stream.qqmusic.qq.com/C4L0004gVaO30hdpUR.m4a?vkey=934E2EBB63374465DE1891EEC27B043C57608C13C4AEBDAA3E804A0A0FA8CF0764C7BA95DAF294CDE9F84B3E21B27E9956504F7CE9282AF5&guid=4589014471&uin=0&fromtag=66'
    }, {
      musicName: '雷雨天气',
      musicDes: '打雷下雨的雨夜',
      musicImg: '../res/rain.png',
      musicImgSmall: '../res/rain48.png',
      musicBgStart: '#111111',
      musicBgEnd: '#f0f0f0',
      musicSrc: 'http://dl.stream.qqmusic.qq.com/C4L0002MTnVe2LKHTv.m4a?vkey=42D9AF073DADDB0591378F5628114500B1DC30BB449B7621480335C76D1389271604A40110A331BEF317F99A47A7BCD41E29195E29CD02A6&guid=4589014471&uin=0&fromtag=66'
    }, {
      musicName: '舒暖',
      musicDes: '舒暖的睡眠',
      musicImg: '../res/storm.png',
      musicImgSmall: '../res/storm48.png',
      musicBgStart: '#B95C00',
      musicBgEnd: '#f0f0f0',
      musicSrc: 'http://dl.stream.qqmusic.qq.com/C400002twCkE26fb2Q.m4a?vkey=3422A0169F6199AEBE8F0B97AAB29ABA4B268E6E91CF734B3F25DCB557AC416E362213D3F031EC573798F4683155F0FFBBEA5817CB4D5C0C&guid=4589014471&uin=0&fromtag=66'
    }, {
      musicName: '林中鸟语',
      musicDes: '林间小鸟的清越啼鸣',
      musicImg: '../res/trees.png',
      musicImgSmall: '../res/trees48.png',
      musicBgStart: '#119F11',
      musicBgEnd: '#f0f0f0',
      musicSrc: 'http://dl.stream.qqmusic.qq.com/C400004cIaFD4TmgWZ.m4a?vkey=18584356C13253444E4DE322D64FFDBBA45A4E4DEBF6522F96196EEB649484E71171E89F6D5D95F6B59EE3495E924AB281AF9C8309E368D4&guid=4589014471&uin=0&fromtag=66'
    }, {
      musicName: '大海之音',
      musicDes: '大海深的水浪声音',
      musicImg: '../res/sea.png',
      musicImgSmall: '../res/sea48.png',
      musicBgStart: '#003973',
      musicBgEnd: '#f0f0f0',
      musicSrc: 'http://dl.stream.qqmusic.qq.com/C4L0001SuEsL2EUdgb.m4a?vkey=157A79407861A27639A79F236C82EC1D9D4A58F135D7472BCD560F308CCC20E5B5EDC4B86D9B2E2728B827CD50B035F4710CC48611E7A686&guid=4589014471&uin=0&fromtag=66'
    }]

  },

  onReady: function () {
    this.drawBg()
     cloudUtil.drawAnimaCloud()//白云飘动动画
    netUtil.getMusicList();
  },

  onLoad: function (params) {
    const that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        openid: params.openid
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //this.playMusic()
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    
      backgroundAudioManager.title = this.data.playMusicName
      backgroundAudioManager.epname = this.data.playMusicDes
      backgroundAudioManager.singer = '优质睡眠'
      backgroundAudioManager.coverImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521440401578&di=ec47a4c86e104e436a7696b78290f204&imgtype=0&src=http%3A%2F%2Fpic.2265.com%2Fupload%2F2017-7%2F20177141332134035.png'
      backgroundAudioManager.src = 'http://dl.stream.qqmusic.qq.com/C4L0004gVaO30hdpUR.m4a?vkey=934E2EBB63374465DE1891EEC27B043C57608C13C4AEBDAA3E804A0A0FA8CF0764C7BA95DAF294CDE9F84B3E21B27E9956504F7CE9282AF5&guid=4589014471&uin=0&fromtag=66'
      backgroundAudioManager.play();

      backgroundAudioManager.onPlay(function () {
        that.setData({
          isPlay: true
        })

      })
      //暂停监听
      backgroundAudioManager.onPause(function () {
        that.setData({
          isPlay: false
        })
      })
      //停止监听
      backgroundAudioManager.onStop(function () {
        that.setData({
          isPlay: false
        })
      })
      //放完监听
      backgroundAudioManager.onEnded(function () {
        that.setData({
          isPlay: false
        })
      })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow() {
  },

  goback:function(){
    console.log("that.data.openid=>" + this.data.openid);
    wx.redirectTo({
      url: '../caculator/caculator?openid=' + this.data.openid,
      fail: function () {
        console.log("导航到计算结果页面失败");
      }
    });
  } , 
  //绘制渐变背景
  drawBg: function () {
    var height;
    var width;
    wx.getSystemInfo({
      success: function (res) {
        height = res.screenHeight;
        width = res.screenWidth;
      },
    })
    var context = wx.createCanvasContext('myCanvas')
    const grd = context.createLinearGradient(0, 0, 0, height)
    grd.addColorStop(0, this.data.playBgClorStart)
    grd.addColorStop(0.7, this.data.playBgClorEnd)
    grd.addColorStop(1, this.data.playBgClorStart)
    context.setFillStyle(grd)
    context.fillRect(0, 0, width, height)
    context.draw()
  },
  //渐变背景切换动画
  drawBgAnim: function () {
    var height;
    var width;
    wx.getSystemInfo({
      success: function (res) {
        height = res.screenHeight;
        width = res.screenWidth;
      },
    })
    var duration = 500;
    var step = 50;
    var orignColor = this.data.playBgOrignColor;
    var orignColorEnd = this.data.playBgOrignColorEnd;

    var destiColor = this.data.playBgClorStart;
    var destiColorEnd = this.data.playBgClorEnd;


    //导航栏渐变
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: destiColor,
      animation: {
        duration: duration,
        timingFunc: 'linear'
      }
    });
    //获取渐变颜色值
    var array = [];
    var arrayEnd = [];
    array = colorUtil.gradient(orignColor, destiColor, step);
    arrayEnd = colorUtil.gradient(orignColorEnd, destiColorEnd, step);
    var timeStep = duration / array.length;
    console.log(timeStep);
    var i = 0
    setInterval(function () {
      if (i < array.length) {
        var context = wx.createCanvasContext('myCanvas')
        const grd = context.createLinearGradient(0, 0, 0, height)
        grd.addColorStop(0, array[i])
        grd.addColorStop(0.7, arrayEnd[i])
        grd.addColorStop(1, array[i])
        context.setFillStyle(grd)
        context.fillRect(0, 0, width, height)
        context.draw()
        i++;
      }
    }, timeStep)


  },

  //列表按钮点击
  bindViewTap: function () {
    this.showModal()
  },



  // 列表弹框动画
  showModal: function () {
    var heightV = 300;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    var isV = false
    if (this.data.isBottomSheetVisiable == true) {
      animation.translateY(heightV).step()
      isV = false;

    } else {
      animation.translateY(-heightV).step()
      isV = true;
    }
    this.setData({
      animationAlert: animation.export(),
      isBottomSheetVisiable: isV,
    })
  },

  //隐藏弹框动画
  hideAlert: function () {
    var heightV = 300;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    var isV = false
    if (this.data.isBottomSheetVisiable == true) {
      animation.translateY(heightV).step()
      isV = false;

    }
    this.setData({
      animationAlert: animation.export(),
      isBottomSheetVisiable: isV,
    })
  },


  //点击弹框背景
  clickAlertBg: function () {
    this.showModal()
  },

  //点击列表item
  clickAlertList: function (event) {
    var origColor = this.data.playBgClorStart;//将当前颜色保存为历史颜色
    var origColorEnd = this.data.playBgClorEnd;//将当前颜色保存为历史颜色
    this.setData({
      playMusicName: event.currentTarget.dataset.name,
      playMusicDes: event.currentTarget.dataset.des,
      playBgOrignColor: origColor,
      playIndex: event.currentTarget.dataset.id,
      playBgClorStart: event.currentTarget.dataset.bgstart,
      playBgClorEnd: event.currentTarget.dataset.bgend,
      playsrc: event.currentTarget.dataset.cover
    })
    this.drawBgAnim()
    wx.getBackgroundAudioManager().src = event.currentTarget.dataset.musicsrc;
  },
  //下一首
  clickNext: function () {
    var origColor = this.data.playBgClorStart;//将当前颜色保存为历史颜色
    var array = [];
    array = this.data.array;
    if (this.data.playIndex + 1 > array.length - 1) {
      this.setData({
        playIndex: -1,
      })
    }

    this.setData({
      playMusicName: array[this.data.playIndex + 1].musicName,
      playMusicDes: array[this.data.playIndex + 1].musicDes,
      playBgOrignColor: origColor,
      playIndex: this.data.playIndex + 1,
      playBgClorStart: array[this.data.playIndex + 1].musicBgStart,
      playBgClorEnd: array[this.data.playIndex + 1].musicBgEnd,
      playsrc: array[this.data.playIndex + 1].musicImg

    })
    this.drawBgAnim()
    wx.getBackgroundAudioManager().src = array[this.data.playIndex].musicSrc;

  },
  //上一首
  clickPre: function () {
    var origColor = this.data.playBgClorStart;//将当前颜色保存为历史颜色
    var array = [];
    array = this.data.array;
    if (this.data.playIndex - 1 < 0) {
      this.setData({
        playIndex: array.length
      })
    }

    this.setData({
      playMusicName: array[this.data.playIndex - 1].musicName,
      playMusicDes: array[this.data.playIndex - 1].musicDes,
      playBgOrignColor: origColor,
      playIndex: this.data.playIndex - 1,
      playBgClorStart: array[this.data.playIndex - 1].musicBgStart,
      playBgClorEnd: array[this.data.playIndex - 1].musicBgEnd,
      playsrc: array[this.data.playIndex - 1].musicImg
    })
    this.drawBgAnim()
    wx.getBackgroundAudioManager().src = array[this.data.playIndex].musicSrc;
  },

  //播放点击事件
  playMusic: function () {
    var that = this
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    var isp = this.data.isPlay == true ? false : true;
    if (isp == true) {
      if (backgroundAudioManager.src == null) {
        backgroundAudioManager.title = this.data.playMusicName
        backgroundAudioManager.epname = this.data.playMusicDes
        backgroundAudioManager.singer = '优质睡眠'
        backgroundAudioManager.coverImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521440401578&di=ec47a4c86e104e436a7696b78290f204&imgtype=0&src=http%3A%2F%2Fpic.2265.com%2Fupload%2F2017-7%2F20177141332134035.png'
        backgroundAudioManager.src = 'http://dl.stream.qqmusic.qq.com/C4L0004gVaO30hdpUR.m4a?vkey=934E2EBB63374465DE1891EEC27B043C57608C13C4AEBDAA3E804A0A0FA8CF0764C7BA95DAF294CDE9F84B3E21B27E9956504F7CE9282AF5&guid=4589014471&uin=0&fromtag=66'
      } else {
        if (backgroundAudioManager.currentTime == backgroundAudioManager.duration) {
          backgroundAudioManager.startTime = 0;
        }
        backgroundAudioManager.play();
      }
    } else {
      backgroundAudioManager.pause();
    }
    //播放监听
    backgroundAudioManager.onPlay(function () {
      that.setData({
        isPlay: true
      })

    })
    //暂停监听
    backgroundAudioManager.onPause(function () {
      that.setData({
        isPlay: false
      })
    })
    //停止监听
    backgroundAudioManager.onStop(function () {
      that.setData({
        isPlay: false
      })
    })
    //放完监听
    backgroundAudioManager.onEnded(function () {
      that.setData({
        isPlay: false
      })
    })
  },

  error(e) {
    console.log(e.detail)
  }

})
