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

// 导出员工excel表
export function exportEmployee(){
    return request({
        url:'/sys/user/export',
        method:'get',
        responseType:'blob'  // 使用blob接收二进制文件流
    })
}

//下载员工的导入模板

export function getExportTemplate(){
    return request({
        url:'/sys/user/import/template',
        method:'get',
        responseType:'blob'
    })
}