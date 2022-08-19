import { hyLoginRequest } from './index'

export function getLoginCode(){
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 1000,//超时时间
      success:res => {
        // code
        const code = res.code
        resolve(code)
        // 发送网络请求 - 发送给服务器
      },
      fail:err => {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function codeToToken(code){
  return hyLoginRequest.post('/login',{ code })
}

export function checkToken(){
  return hyLoginRequest.post('/auth', {}, true)
}

export function postFavorRequest(id){
  return hyLoginRequest.post('/api/favor',{ id },true)
}

export function checkSession(){
  return new Promise((reslove) => {
    wx.checkSession({
      success: () => {
        reslove(true)
      },
      fail:() => {
        reslove(false)
      }
    })
  })
}

export function getUserInfo(){
  return new Promise((resolve,reject) => {
    wx.getUserProfile({
      desc: '你好，李银河',
      success:(res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}