// app.js
App({
  onLaunch:function(){
    const info = wx.getSystemInfoSync()
    // console.log(info.windowWidth)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
  },
  globalData:{
    screenWidth:0,
    screenHeight:0
  }
})
