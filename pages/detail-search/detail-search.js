// pages/detail-search/detail-search.js
import { getSearchHot,getSearchSuggest,getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300)

Page({

  data: {
    hotKeywords:[],
    suggestSongs:[],
    suggestSongsNodes:[],
    searchValue:'',
    resultSongs:[],
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
        suggestSongs:[],
        resultSongs:[]
      })
      // 取消后面的请求函数
      debounceGetSearchSuggest.cancel()
      return
    } 
    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // console.log(res.data.result.allMatch)
      // ### 阻止BUG
      // if(!this.data.searchValue.length){
      //   console.log('searchValue没有值')
      //   return
      // }
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.data.result.allMatch
      this.setData({ suggestSongs })

      // 2.转成nodes节点
      if(!suggestSongs) return
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      // console.log(suggestKeywords)
      for(const keyword of suggestKeywords){
        const nodes = stringToNodes(keyword,searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
    })
  },
  handleSearchAction(){
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      // console.log(res.data.result.songs)
      this.setData({resultSongs:res.data.result.songs})
    })
  },
  handleSuggestItemClick(event){
    // console.log(event.currentTarget.dataset.index)
    // 1.获取点击的关键字
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword

    // 2.将关键字设置到searchValue中
    this.setData({ searchValue:keyword})

    // 3.发送网络请求
    this.handleSearchAction()
  },
  // 点击热门搜索中的推荐歌曲
  handleTagItemClick(event){
    // console.log(event.currentTarget.dataset.item)
    const keyword = event.currentTarget.dataset.item
    this.setData({ searchValue:keyword })
    this.handleSearchAction()
  }
})