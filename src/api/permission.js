import request from '@/utils/request'
// 获取权限列表
export function getPermissionList() {
    return request({
        url:'/sys/permission'
    })
    
}

//删除 权限
export function delPermission(id){
    return request({
        url:`/sys/permission/${id}`,
        method:'DELETE'
    })
}