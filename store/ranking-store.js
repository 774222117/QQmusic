import { HYEventStore } from 'hy-event-store'

import { getRankings } from '../service/api_music'

const rankingStore = new HYEventStore({
  state:{
    hotRanking:{}
  },
  actions:{
    getRankingDataAction(ctx){
      getRankings(2884035).then(res => {
        // console.log(res)
        ctx.hotRanking = res.data.playlist
      })
    },
  }
})


export {
  rankingStore,
}