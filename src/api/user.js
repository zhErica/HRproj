import request from '@/utils/request'

export function login(data){
  return request({
    url:"/sys/login",
    method:"post",
    data
  })
}
// 获取资料的接口
export function getUserInfo(){
  return request({
    url:"/sys/profile",
    method:'GET',
  })
}
//更新密码
export function updatePassword(data){
  return request({
    url:'/sys/user/updatePass',
    method:'PUT',
    data
  })
}