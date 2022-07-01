// components/song-menu/song-menu-area.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'默认歌单'
    },
    sontMenu:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth:app.globalData.screenWidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取屏幕宽度
    getScreenDemo:function(){
      const info = wx.getSystemInfoSync()
      console.log(info)
    },
    handleMenuItemClick(event){
      console.log('歌单item的点击')
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail-songs/detail-songs?id=${item.id}&type=menu`,
      })
    }
  }
})
