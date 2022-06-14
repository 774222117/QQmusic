// components/song-menu/song-menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    // 获取屏幕宽度
    getScreenDemo:function(){
      const info = wx.getSystemInfoSync()
      console.log(info)
    }
  }
})
