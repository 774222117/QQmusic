// const BASE_URL = "http://123.207.32.32:9001/"
import { TOKEN_KEY } from '../constants/token-const.js'
const token = wx.getStorageSync(TOKEN_KEY)

const BASE_URL = "https://coderwhy-music.vercel.app/"

const LOGIN_BASE_URL = 'http://123.207.32.32:3000'


class HYRequest {
  constructor(baseURL,authHeader = {}){
    this.baseURL = baseURL
    this.authHeader = authHeader
  }
  request(url,method,params,isAuth = false,header = {}){
    const finalHeader = isAuth ? {...this.authHeader,...header} : header
    return new Promise((resolve,reject) => {
      wx.request({
        url: this.baseURL + url,
        method:method,
        header:finalHeader,
        data:params,
        success:function(res){
          resolve(res)
        },
        fail:function(err){
          reject(err)
        }
      })
    })
  }

  get(url,params,isAuth = false,header){
    return this.request(url,'GET',params,isAuth,header)
  }
  post(url,data,isAuth = false,header){
    return this.request(url,'POST',data,isAuth,header)
  }
}

const hyRequest = new HYRequest(BASE_URL)

const hyLoginRequest = new HYRequest(LOGIN_BASE_URL,{
  token
})

export default hyRequest
export {
  hyLoginRequest
}

// hyRequest.request('/top/mv','GET',{offset:0,limit:10}).then(res => {

// }).catch(err => {

// })