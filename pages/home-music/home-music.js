// pages/home-music/home-music.js
import { rankingStore } from "../../store/ranking-store"

import { getBanners } from "../../service/api_music"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"

const throttleQueryRect = throttle(queryRect,1000)

Page({
  data: {
    banners:[],
    swiperHeight:0,
    recommendSongs:[]
  },
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction')

    // 从store中获取共享的数据
    rankingStore.onState("hotRanking",(res) => {
      // 热歌榜数据
      // console.log('home-music:',res)
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6)
      // console.log(recommendSongs)
      this.setData({recommendSongs})
    })
  },
  // 网络请求
  getPageData(){
    getBanners().then(res => {
      // setData在设置data数据上，是同步的
      // setData通过最新的数据对wxml进行渲染，渲染的过程是异步
      this.setData({
        banners:res.data.banners
      })
      // console.log(this.data.banners)
    })
  },
  handleSwiperImageLoaded:function(){
    // console.log('图片加载完成')
    // 获取图片的高度(如何去获取某一个组件的高度)
    throttleQueryRect('.swiper-image').then(res => {
      console.log('启动节流，查询到了结果')
      this.setData({swiperHeight:res[0].height})
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