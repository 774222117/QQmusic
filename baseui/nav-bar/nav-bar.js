// baseui/nav-bar/nav-bar.js
Component({
  options:{
    multipleSlots:true
  },
  properties: {
    title:{
      type:String,
      value:'默认标题'
    }
  },

  data: {
    statusBarHeight:getApp().globalData.statusBarHeight,
    navBarHeight:getApp().globalData.navBarHeight
  },
  lifetimes:{
   
  },
  onLoad:{

  },
  methods: {
    handleLeftClick:function(){
      this.triggerEvent('click')
    },
  }
})
