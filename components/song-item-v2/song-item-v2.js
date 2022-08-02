// components/song-item-v2/song-item-v2.js
import { playerStore} from '../../store/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:0
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
      const id = this.properties.item.id
      // 1.页面跳转
      wx.navigateTo({
        url: '/pages/music-player/music-player?id=' + id,
      })
      // 2.播放歌曲
      playerStore.dispatch('playMusicWithSongIdAction',{ id })
    }
  }
})
