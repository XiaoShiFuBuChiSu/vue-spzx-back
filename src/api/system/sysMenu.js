import request from '@/utils/request'

// 分页查询
export const GetMenuTree = () => {
  return request.get(`/api/system/sysMenu/menuTree`)
}

// 查询一个
export const QueryMenu = id => {
  return request.get(`/api/system/sysMenu/${id}`)
}

// 添加
export const SaveMenu = sysMenu => {
  return request.post(`/api/system/sysMenu`, sysMenu)
}
// 修改
export const UpdateMenu = sysMenu => {
  return request.put(`/api/system/sysMenu`, sysMenu)
}
// 删除
export const RemoveMenu = id => {
  return request.delete(`/api/system/sysMenu/${id}`)
}

// 获取权限对应菜单树
export const GetRoleMenuTree = ruleId => {
  return request.get(`/api/system/sysMenu/getRoleMenuTree/${ruleId}`)
}

// 保存权限菜单信息
export const saveRoleMenuTree = assignMenuDto => {
  return request.put(`/api/system/sysMenu/assignRoleMenu`,assignMenuDto)
}
