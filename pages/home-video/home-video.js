// pages/home-video/home-video.js
import { getTopMV } from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs:[],//存放音乐数据
    hasMore:true,//下拉是否还有音乐数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // const res = await getTopMV(0)
    // this.setData({ topMVs:res.data.data})
    this.getTopMVData(0)

    // 封装方法
    // getTopMV(0).then(res => {
    //   this.setData({topMVs:res.data.data})
    // })

    
    // 原始方法
    // wx.request({
    //   url: 'http://123.207.32.32:9001/top/mv',
    //   data:{
    //     offset:0,
    //     limit:10
    //   },
    //   success:function(res){
    //     console.log(res)
    //     _this.setData({
    //       topMVs:res.data.data
    //     })
    //   },
    //   fail:function(err){
    //     console.log(err)
    //   }
    // })
  },
  // 封装网络请求方法
  getTopMVData:async function(offset){
    // 判断是否可以请求
    if(!this.data.hasMore) return

    // 展示加载动画
    wx.showNavigationBarLoading()

    // 真正的数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if(offset === 0){
      newData = res.data.data
    }else{
      newData = newData.concat(res.data.data)
    }
    // 设置数据
    this.setData({topMVs:newData})
    this.setData({hasMore:res.data.hasMore})
    wx.hideNavigationBarLoading()
    if(offset === 0){
      wx.stopPullDownRefresh()
    }
  },
  // 封装点击item方法
  handleVideoItemClick(event){
    // console.log(event.currentTarget.dataset.item)
    // 获取id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: `/pages/detail-video/detail-video?id=${id}`,
    })
  },
  // 下拉刷新周期
  onPullDownRefresh:async function(){
    // const res = await getTopMV(0)
    // this.setData({topMVs:res.data.data})
    this.getTopMVData(0)
  },
  // 当达到底部时触发
  onReachBottom:async function(){
    // if(!this.data.hasMore) return
    // const res = await getTopMV(this.data.topMVs.length / 10)
    // this.setData({
    //   topMVs:this.data.topMVs.concat(res.data.data),
    //   hasMore:res.data.hasMore
    // })
    this.getTopMVData(this.data.topMVs.length / 10)
  }
})