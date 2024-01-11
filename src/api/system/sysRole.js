import request from '@/utils/request'

// 分页查询
export const QueryPage = (page, limit, queryDto) => {
  return request.post(`/api/system/sysRole/page/${page}/${limit}`, queryDto)
}
// 查询一个
export const QueryRole = id => {
  return request.get(`/api/system/sysRole/${id}`)
}

// 添加
export const SaveRole = sysRole => {
  return request.post(`/api/system/sysRole`, sysRole)
}
// 修改
export const UpdateRole = sysRole => {
  return request.put(`/api/system/sysRole`, sysRole)
}
// 删除
export const RemoveRole = id => {
  return request.delete(`/api/system/sysRole/${id}`)
}

// 获取已分配的权限信息
export const GetAssignedRole = userId => {
  return request({
    url: `/api/system/sysRole/getAssignedRole/${userId}`,
    method: `GET`,
  })
}

// 更新权限分配
export const AssignRole = assignRoleDto => {
  return request({
    url: `/api/system/sysRole/assignRole`,
    method: `POST`,
    data: assignRoleDto,
  })
}
