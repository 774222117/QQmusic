// pages/home-music/home-music.js
import { rankingStore,rankingMap } from "../../store/ranking-store"

import { getBanners,getSongMenu } from "../../service/api_music"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"
import { playerStore } from "../../store/player-store"

const throttleQueryRect = throttle(queryRect,1000, { trailing: true })

Page({
  data: {
    banners:[],
    hotSongMenu:[],//热门歌单
    recommendSongMenu:[],//推荐歌单
    swiperHeight:0,
    recommendSongs:[],
    // rankings:[],//第一种方法
    rankings:{3779629:{},2884035:{},19723756:{}},// 第二种方法

    currentSong:{},
    isPlaying:false,
    playAnimState:'paused'
  },
  onLoad: function (options) {
    // 测试   给首页添加播放数据
    // playerStore.dispatch('playMusicWithSongIdAction',{ id:1842025914 })

    // 获取页面数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction')

    // 从store中获取共享的数据
    this.setupPlayerStoreListener()
    // 没封装前
    // rankingStore.onState("hotRanking",(res) => {
    //   // 热歌榜数据
    //   // console.log('home-music:',res)
    //   if(!res.tracks) return
    //   const recommendSongs = res.tracks.slice(0,6)
    //   // console.log(recommendSongs)
    //   this.setData({recommendSongs})
    // })
    // // 第一种方法
    // // rankingStore.onState('newRanking',this.getNewRankingHandler)
    // // rankingStore.onState('originRanking',this.getNewRankingHandler)
    // // rankingStore.onState('upRanking',this.getNewRankingHandler)
    // // 第二种方法
    // rankingStore.onState('newRanking',this.getRankingHandler(3779629))
    // rankingStore.onState('originRanking',this.getRankingHandler(2884035))
    // rankingStore.onState('upRanking',this.getRankingHandler(19723756))
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
    // 获取热门/推荐歌曲数据
    getSongMenu().then(res => {
      // console.log(res)
      this.setData({
        hotSongMenu:res.data.playlists
      })
      // console.log(this.data.hotSongMenu)
    })
    getSongMenu("华语").then(res => {
      this.setData({
        recommendSongMenu:res.data.playlists
      })
      // console.log(this.data.recommendSongMenu)
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
  handleMoreClick(){
    // console.log('监听到推荐歌曲中的更多的点击')
    this.navigateToDetailSongsPage('hotRanking')
  },
  // 点击首页bar跳转详情页
  handlePlayBarClick:function(event){
    wx.navigateTo({
      url: '/pages/music-player/music-player?id=' + this.data.currentSong.id,
    })
  },
  handleRankingClick(event){
    // console.log(event.currentTarget.dataset.idx)
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },
  // 跳转通用函数，参数表达要去的地方
  navigateToDetailSongsPage(rankingName){
    wx.navigateTo({
      url: `/pages/detail-songs/detail-songs?ranking=${rankingName}&type=rank`,
    })
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    // console.log(index,this.data.recommendSongs)
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)
  },
  handlePlayBtnClick:function(){
    playerStore.dispatch('changeMusicPlayStatusAction',!this.data.isPlaying)
  },
  // 卸载页面
  onUnload: function () {
    // rankingStore.offState('newRanking',this.getNewRankingHandler)
  },
  setupPlayerStoreListener:function(){
    // 1.排行榜监听
    rankingStore.onState("hotRanking",(res) => {
      // 热歌榜数据
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6)
      this.setData({recommendSongs})
    })
    rankingStore.onState('newRanking',this.getRankingHandler(3779629))
    rankingStore.onState('originRanking',this.getRankingHandler(2884035))
    rankingStore.onState('upRanking',this.getRankingHandler(19723756))

    // 2.播放器监听
    playerStore.onStates(['currentSong','isPlaying'],({currentSong,isPlaying}) => {
      if(currentSong) this.setData({ currentSong })
      if(isPlaying !== undefined) this.setData({ isPlaying , playAnimState:isPlaying ? 'running' : 'paused'}) 
    })
  },
  // 第一种方法
  // getNewRankingHandler:function(res){
  //   // console.log(res)
  //   if(Object.keys(res).length === 0) return
  //   const name = res.name
  //   const coverImgUrl = res.coverImgUrl
  //   const playCount = res.playCount
  //   const songList = res.tracks.slice(0,3)
  //   const rankingObj = {name,coverImgUrl,songList,playCount}
  //   const originRankings = [...this.data.rankings]
  //   originRankings.push(rankingObj)
  //   this.setData({
  //     rankings:originRankings
  //   })
  // }
  // 第二种方法
  getRankingHandler:function(idx){
    return (res)=>{
      // console.log(res)
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0,3)
      const rankingObj = {name,coverImgUrl,songList,playCount}
      const newRankings = {...this.data.rankings,[idx]:rankingObj}
      this.setData({
        rankings:newRankings
      })
    }
  }
})