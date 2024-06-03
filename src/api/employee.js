import request from '@/utils/request'

// 获取员工列表
// 请求体参数通过data 地址参数通过params
export function getEmployeeList(params){
    return request({
        url:'/sys/user',
        method:'get',
        params
    })
}