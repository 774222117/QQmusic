// pages/detail-search/detail-search.js
import { getSearchHot,getSearchSuggest } from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300)

Page({

  data: {
    hotKeywords:[],
    suggestSongs:[],
    suggestSongsNodes:[],
    searchValue:''
  },

  onLoad(options) {
    this.getPageData()
  },
  // 网络请求
  getPageData:function(){
    getSearchHot().then(res => {
      // console.log(res.data.result.hots)
      this.setData({
        hotKeywords:res.data.result.hots
      })
    })
  },
  // 事件处理
  handleSearchChange:function(event){
    // console.log(event.detail)
    // 1.获取输入的关键字
    const searchValue = event.detail
    // 2.保存关键字
    this.setData({searchValue})
    // 如果没有搜索长度，则不进行搜索请求
    // 3.判断关键字为空字符串的处理逻辑
    if(!searchValue.length){
      this.setData({
        suggestSongs:[]
      })
      return
    } 
    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // console.log(res.data.result.allMatch)
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.data.result.allMatch
      this.setData({ suggestSongs })

      // 2.转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      // console.log(suggestKeywords)
      for(const keyword of suggestKeywords){
        const nodes = stringToNodes(keyword,searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
    })
  }
})