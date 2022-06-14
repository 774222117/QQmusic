// app.js
App({
  onLaunch:function(){
    const info = wx.getSystemInfoSync()
    console.log(info.windowWidth)
  },
  globalData:{
    screenWidth:0,
    screenHeight:0
  }
})
