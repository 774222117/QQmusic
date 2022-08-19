// app.js
import { getLoginCode,codeToToken,checkToken,checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'

App({
  onLaunch: function(){
    // 1.获取了设备信息
    const info = wx.getSystemInfoSync()
    // console.log(info)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight

    // 屏幕高度/屏幕宽度
    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio

    // 2.让用户默认进行登录
    this.handleLogin()
    
  },
  globalData:{
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0,
    navBarHeight:44,
    deviceRadio:0
  },
  handleLogin:async function(){
    // 2.让用户默认进行登录
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期   //checkResult.errorCode有值，表示token过期，返回的过期错误号码
    const checkResult = await checkToken()
    // console.log(checkResult)
    // 判断session_key是否过期
    const isSessionExpire = await checkSession()

    // 判断是否需要重新登陆
    if(!token || checkResult.errorCode || !isSessionExpire){
      this.loginAction()
    }
  },
  loginAction:async function(){
    // 1.获取code
    const code = await getLoginCode()

    // 2.将code发送给服务器
    const result = await codeToToken(code)
    // console.log(result)
    const token = result.data.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
