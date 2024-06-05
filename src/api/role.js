import request from "@/utils/request"

// 获取角色列表
export function getRoleList(params) {
    return request({
        url: '/sys/role',
        method: 'GET',
        params
    })
}
// 新增角色
export function addRole(data) {
    return request({
        url: '/sys/role',
        method: 'POST',
        data
    })
}

// 更新角色
export function updateRole(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'PUT',
        data
    })
}

//删除角色
export function delRole(id) {
    return request({
        url:`/sys/role/${id}`,
        method:'DELETE',
    })
}

// 获取角色详情
export function getRoleDetail(id) {
    return request ({
        url:`/sys/role/${id}`
    })
}