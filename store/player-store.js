import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player' //歌曲详情页的网络请求
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state:{
    id:0,
    isFirstPlay:true,//是否是第一次播放
    isStoping:false,

    currentSong:{},
    durationTime:0,
    lyricInfos:[],

    currentTime:0,//当前时间
    currentLyricText:'',//当前播放的歌词
    currentLyricIndex:0,//当前歌词的索引

    isPlaying:false,//暂停播放

    playModeIndex: 0,//0：循环播放 1：单曲循环 2：随机播放

    playListSongs:[],//播放的歌曲列表
    playListIndex:0,//播放列表的索引
  },
  actions:{
    playMusicWithSongIdAction(ctx,{ id , isRefresh = false}){
      if(ctx.id == id && !isRefresh){
        this.dispatch('changeMusicPlayStatusAction',true)
        return
      }
      
      ctx.id = id
      // 0.修改播放的状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''

      // 1.请求歌曲详情
      getSongDetail(id).then(res => {
        // console.log(res)
        ctx.currentSong = res.data.songs[0]
        ctx.durationTime = res.data.songs[0].dt
        audioContext.title = res.data.songs[0].name
      })
      getSongLyric(id).then(res => {
        const lyricString = res.data.lrc.lyric
        // console.log(lyricString)
        const lyricStrings = lyricString.split("\n")
        const lyrics = parseLyric(lyricStrings)
        ctx.lyricInfos = lyrics
      })

      // 2.播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 3.监听audioContext一些事件
      if(ctx.isFirstPlay){
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(ctx){
       // 1.监听歌曲可以播放
        audioContext.onCanplay(()=>{
          audioContext.play()
        })

      // 2.监听时间改变
      audioContext.onTimeUpdate(()=>{
        // console.log(audioContext.currentTime)
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000
        //2. 根据当前时间修改currentTime
        // if(!this.data.isSliderChanging){
        //   const sliderValue = currentTime / this.data.durationTime * 100
        //   this.setData({ sliderValue,currentTime })
        // }
        ctx.currentTime = currentTime
        // 3.根据当前时间去查找播放的歌词
        if(!ctx.lyricInfos.length) return
        let i = 0
        for(;i < ctx.lyricInfos.length;i++){//这个分号不能删除
          const lyricInfo = ctx.lyricInfos[i]
          if(currentTime < lyricInfo.time){
            break
          }
        }

        // 设置当前歌词和索引的内容
        const currentIndex = i - 1
        if(ctx.currentLyricIndex !== currentIndex){
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          // console.log(currentLyricInfo.text)
          // this.setData({ currentLyricText: currentLyricInfo.text, 
          //               currentLyricIndex: currentIndex,
          //               lyricScrollTop: currentIndex * 35
          //               })
          ctx.currentLyricText = currentLyricInfo.text
          ctx.currentLyricIndex = currentIndex
        }
      })
      
      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })

      // 4.监听音乐暂停/播放
      // 播放
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    changeMusicPlayStatusAction(ctx,isPlaying = true){
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying && ctx.isStoping){
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = currentSong.name
        audioContext.startTime = ctx.currentTime / 1000
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx,isNext = true){
      // 1.获取当前索引
      let index = ctx.playListIndex

      // 2.根据不同的播放模式，获取下一首歌的索引
      switch(ctx.playModeIndex){
        case 0://顺序播放
          index = isNext ? index + 1 : index - 1
          if(index === -1) index = ctx.playListSongs.length - 1
          if(index === ctx.playListSongs.length) index = 0
          break
        case 1://单曲播放
          break
        case 2://随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      // 3.获取歌曲
      const currentSong = ctx.playListSongs[index]
      if(!currentSong){
        currentSong = ctx.currentSong
      }else{
        // 记录最新的索引
        ctx.playListIndex = index
      }

      // 4.播放新的歌曲
      this.dispatch('playMusicWithSongIdAction',{id:currentSong.id,isRefresh:true})
    },
  }
})

export {
  audioContext,
  playerStore
}