// components/song-item-v1/song-item-v1.js
import { playerStore } from '../../store/player-store'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick(){
      // console.log(this.properties.item)
      const id = this.properties.item.id
      // 页面跳转
      wx.navigateTo({
        url: '/pages/music-player/music-player?id=' + id,
      })
      // 对歌曲的数据请求和其他操作
      playerStore.dispatch('playMusicWithSongIdAction',{ id })
    }
  }
})
