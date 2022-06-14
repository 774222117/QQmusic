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