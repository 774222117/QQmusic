// pages/music-player/music-player.js
// import { getSongDetail, getSongLyric } from '../../service/api_player'
import { audioContext,playerStore } from '../../store/index'
// import { parseLyric } from '../../utils/parse-lyric'

const playModeNames = ['order','repeat','random']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,

    currentSong:{},//当前要播放的歌曲
    durationTime:0,//播放时长
    lyricInfos:[],//歌词

    currentTime:0,//当前时间
    currentLyricText:'',//当前播放的歌词
    currentLyricIndex:0,//当前歌词的索引

    playModeIndex:0,//播放模式
    playModeName:'order',

    currentPage:0,
    contentHeight:0,
    isMusicLyric:true,
    sliderValue:0,//进度条值
    isSliderChanging:false,//当进度条被拖动时为true
    lyricScrollTop:0,//歌词往上滚动的距离
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    // 1.获取传入的id
    const id = options.id
    // console.log(id)
    this.setData({ id })

    // 2.根据id获取歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight,isMusicLyric : deviceRadio >= 2 })
    
    // 4.使用audioContext播放歌曲
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true

    // 5.audioContext的事件监听
    // this.setupAudioContextListener()
  },
  // ====================  网络请求  ====================
  // getPageData:function(id){
  //   getSongDetail(id).then(res => {
  //     // console.log(res)
  //     this.setData({ currentSong:res.data.songs[0], durationTime: res.data.songs[0].dt})
  //     // console.log(this.data.currentSong)
  //   })
  //   getSongLyric(id).then(res => {
  //     const lyricString = res.data.lrc.lyric
  //     // console.log(lyricString)
  //     const lyricStrings = lyricString.split("\n")
  //     const lyrics = parseLyric(lyricStrings)
  //     this.setData({ lyricInfos:lyrics })
  //   })
  // },
  // ====================  audioContext事件监听  ====================
  // setupAudioContextListener:function(){
  //   // 1.监听歌曲可以播放
  //   audioContext.onCanplay(()=>{
  //     audioContext.play()
  //   })

  //   // 2.监听时间改变
  //   audioContext.onTimeUpdate(()=>{
  //     // console.log(audioContext.currentTime)
  //     // 1.获取当前时间
  //     const currentTime = audioContext.currentTime * 1000
  //     //2. 根据当前时间修改currentTime/sliderValue
  //     if(!this.data.isSliderChanging){
  //       const sliderValue = currentTime / this.data.durationTime * 100
  //       this.setData({ sliderValue,currentTime })
  //     }

  //     // 3.根据当前时间去查找播放的歌词
  //     if(!this.data.lyricInfos.length) return
  //     let i = 0
  //     for(;i < this.data.lyricInfos.length;i++){//这个分号不能删除
  //       const lyricInfo = this.data.lyricInfos[i]
  //       if(currentTime < lyricInfo.time){
  //         break
  //       }
  //     }

  //     // 设置当前歌词和索引的内容
  //     const currentIndex = i - 1
  //     if(!this.data.lyricInfos.length) return
  //     if(this.data.currentLyricIndex !== currentIndex){
  //       const currentLyricInfo = this.data.lyricInfos[currentIndex]
  //       // console.log(currentLyricInfo.text)
  //       this.setData({ currentLyricText: currentLyricInfo.text, 
  //                      currentLyricIndex: currentIndex,
  //                      lyricScrollTop: currentIndex * 35
  //                     })
  //     }
  //   })
  // },
  // ====================  事件处理  ====================
  handleSwiperChange(event){
    // console.log(event)
    const current = event.detail.current
    this.setData({ currentPage:current })
  },
  handleSliderchanging:function(event){
    const value  = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging:true,currentTime })
  },
  handleSliderChange:function(event){
    // 1.获取slider变化的值
    const value = event.detail.value

    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100
    this.setData({ currentTime })
    // 3.设置context播放currentTime位置的音乐
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // 4.记录最新的sliderValue
    this.setData({ sliderValue:value,isSliderChanging:false })
  },
  handleBackBtnClick:function(){
    wx.navigateBack()
  },
  handleModeBtnClick:function(){
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex === 3) playModeIndex = 0
    // console.log(playModeIndex)
    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex',playModeIndex)
  },
  // 从playerStore中获取数据
  // ====================  数据监听  ====================
  setupPlayerStoreListener(){
    playerStore.onStates(['currentSong','durationTime','lyricInfos'],({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if(currentSong) this.setData({ currentSong })
      if(durationTime) this.setData({ durationTime })
      if(lyricInfos) this.setData({ lyricInfos })
    })

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(['currentTime','currentLyricIndex','currentLyricText'],({
      currentTime,
      currentLyricIndex,
      currentLyricText
    })=> {
      // 时间变化
      if(currentTime && !this.data.isSliderChanging){
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime,sliderValue })
      }
      // 歌词变化
      if(currentLyricIndex){
        this.setData({ currentLyricIndex,lyricScrollTop: currentLyricIndex * 35})
      }
      if(currentLyricText){
        this.setData({ currentLyricText })
      }
    })

    // 3.监听播放模式相关的数据
    playerStore.onState('playModeIndex',(playModeIndex) => {
      this.setData({ playModeIndex,playModeName:playModeNames[playModeIndex]})
    })
  },
  onUnload() {

  },
})