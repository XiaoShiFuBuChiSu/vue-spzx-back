import request from '@/utils/request'

const api_name = '/api/product/brand'

// 分页列表
export const GetBrandPageList = (page, limit) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
  })
}

// 保存品牌
export const SaveBrand = brand => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: brand,
  })
}

// 根据id删除品牌
export const DeleteBrandById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}

//根据id查询
export const GetBrandById = id => {
  return request({
    url: `${api_name}/getById/${id}`,
    method: 'get',
  })
}

// 修改信息
export const UpdateBrandById = brand => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: brand,
  })
}

// 查询所有的品牌数据
export const FindAllBrand = () => {
  return request({
    url: `${api_name}/findAll`,
    method: 'get',
  })
}

// 根据分类Id查询所有品牌
export const FindBrandByCategoryId = categoryId => {
  return request({
    url: `${api_name}/findAll`,
    method: `get`,
    params: {
      categoryId:categoryId
    },
  })
}
