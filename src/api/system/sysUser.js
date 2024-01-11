import request from '@/utils/request'

// 分页查询
export const QueryPage = (page, limit, queryDto) => {
  return request.post(`/api/system/sysUser/page/${page}/${limit}`, queryDto)
}

// 查询一个
export const QueryUser = id => {
  return request.get(`/api/system/sysUser/${id}`)
}

// 添加
export const SaveUser = sysUser => {
  return request.post(`/api/system/sysUser`, sysUser)
}
// 修改
export const UpdateUser = sysUser => {
  return request.put(`/api/system/sysUser`, sysUser)
}
// 删除
export const RemoveUser = id => {
  return request.delete(`/api/system/sysUser/${id}`)
}
