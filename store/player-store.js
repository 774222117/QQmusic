import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player' //歌曲详情页的网络请求
import { parseLyric } from '../utils/parse-lyric'

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state:{
    id:0,
    currentSong:{},
    durationTime:0,
    lyricInfos:[],

    currentTime:0,//当前时间
    currentLyricText:'',//当前播放的歌词
    currentLyricIndex:0,//当前歌词的索引

    playModeIndex: 0,//0：循环播放 1：单曲循环 2：随机播放
  },
  actions:{
    playMusicWithSongIdAction(ctx,{ id }){
      ctx.id = id
      // 1.请求歌曲详情
      getSongDetail(id).then(res => {
        // console.log(res)
        ctx.currentSong = res.data.songs[0]
        ctx.durationTime = res.data.songs[0].dt
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
      audioContext.autoplay = true

      // 3.监听audioContext一些事件
      this.dispatch('setupAudioContextListenerAction')
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
        if(!ctx.lyricInfos.length) return
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
    }
  }
})

export {
  audioContext,
  playerStore
}