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

// 导入员工上传接口
export function uploadExcel(data){
    return request({
        url:'/sys/user/import',
        method:'POST',
        data   //  form-data类型 因为要上传文件类型

    })
}

// 删除员工数据
export function delEmployee(id){
    return request({
        url:`/sys/user/${id}`,
        method:'delete',
    })
}

// 新增员工
export function addEmployee(data) {
    return request({
        url:'/sys/user',
        method:'post',
        data
    })
}

// 获取员工详情
export function getEmployeeDetail(id) {
    return request({
        url:`/sys/user/${id}`
    })
}