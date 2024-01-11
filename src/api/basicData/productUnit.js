import request from '@/utils/request'
const api_name = '/api/product/productUnit'

export const QueryPage = (currnet, limit) => {
  return request.get(`${api_name}/page/${currnet}/${limit}`)
}

export const Save = productUnit => {
  return request.post(`${api_name}`, productUnit)
}

export const Update = productUnit => {
  return request.put(`${api_name}`, productUnit)
}

export const RemoveById = id => {
  return request.delete(`${api_name}/${id}`)
}

export const QueryById = id => {
  return request.get(`${api_name}/${id}`)
}

export const FindAllProductUnit = () => {
  return request.get(`${api_name}/findAll`)
}
