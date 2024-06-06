import request from '@/utils/request'

//获取首页数据
 export function getHomeData(){
    return request({
        url:'/home/data'
    })
 }

 // 获取首页信息数据
 export function getHomeNotice(){
    return request({
        url:'/home/notice'
    })
 }