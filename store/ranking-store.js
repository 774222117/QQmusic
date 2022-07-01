import { HYEventStore } from 'hy-event-store'

import { getRankings } from '../service/api_music'
import { getAllRankings } from '../service/api_music'

const rankingMap = {2884035:"originRanking",19723756:"upRanking",3779629:"newRanking"}

const rankingStore = new HYEventStore({
  state:{
    newRanking:{},//0:新歌
    hotRanking:{},//1:热门
    originRanking:{},//2:原创
    upRanking:{} //3:飙升
  },
  actions:{
    getRankingDataAction(ctx){
      getRankings(2884035).then(res => {
        // console.log(res)
        ctx.hotRanking = res.data.playlist
      }),
      // 飙升榜：19723756 "新歌榜":3779629 "原创榜":2884035 "热歌榜":3778678
      // 新歌榜
      getRankings(3779629).then(res => {
        // console.log(res.data.playlist)
        ctx.newRanking = res.data.playlist
      }),
      // 热歌榜
      getRankings(3778678).then(res => {
        // console.log(res.data.playlist)
        ctx.hotRanking = res.data.playlist
      }),
      // 原创榜
      getRankings(2884035).then(res => {
        // console.log(res.data.playlist)
        ctx.originRanking = res.data.playlist
      }),
      // 飙升榜
      getRankings(19723756).then(res => {
        // console.log(res.data.playlist)
        ctx.upRanking = res.data.playlist
      })
    },
  }
})


export {
  rankingStore,
  rankingMap
}