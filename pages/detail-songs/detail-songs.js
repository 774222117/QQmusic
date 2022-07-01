import { rankingStore } from "../../store/ranking-store"
import { getRankings } from "../../service/api_music"

// pages/detail-songs/detail-songs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking:'',
    rankingInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options)
    const type = options.type
    if(type === 'menu'){
      const id = options.id
      // console.log(id)
      getRankings(id).then(res => {
        console.log(res)
      })
    }else if(type === 'rank'){
      const ranking = options.ranking
      this.setData({
        ranking
      })
      // 1.获取数据
      rankingStore.onState(ranking,this.getRankingDataHandler)
    }
  },
  onUnload() {
    if(this.data.ranking){
      rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
    }
  },
  getRankingDataHandler:function(res){
    // console.log(res)
    this.setData({
      rankingInfo:res
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})