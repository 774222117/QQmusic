import hyRequest from './index'

export function getBanners(){
   return hyRequest.get('/banner',{
     type:2
   })
}

export function getRankings(id){
  return hyRequest.get('/playlist/detail',{
    id
  })
}

// 所有榜单
export function getAllRankings(){
  return hyRequest.get('/toplist',{
    
  })
}

export function getSongMenu(cat='全部',limit=6,offset=0){
  return hyRequest.get('/top/playlist',{
    cat,
    limit,
    offset
  })
}
