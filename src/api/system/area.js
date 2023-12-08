import request from '@/utils/request'

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/system/area/list',
    method: 'get',
    params: query
  })
}

// 查询区域详细
export function getArea(id) {
  return request({
    url: '/system/area/' + id,
    method: 'get'
  })
}

// 新增区域
export function addArea(data) {
  return request({
    url: '/system/area',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateArea(data) {
  return request({
    url: '/system/area',
    method: 'put',
    data: data
  })
}

// 删除区域
export function delArea(id) {
  return request({
    url: '/system/area/' + id,
    method: 'delete'
  })
}
