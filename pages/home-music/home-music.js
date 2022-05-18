// pages/home-music/home-music.js
import { getBanners } from "../../service/api_music"

Page({
  data: {
    banners:[]
  },
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData()
  },
  // 网络请求
  getPageData(){
    getBanners().then(res => {
      this.setData({
        banners:res.data.banners
      })
      console.log(this.data.banners)
    })
  },
  // 事件处理
  handleSearchClick(){
    console.log("点击了搜索框")
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  onUnload: function () {
    
  },
})