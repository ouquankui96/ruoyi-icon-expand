import request from '@/utils/request'

//根据ID获取
export function queryById() {
  return request({
    url: '/system/allocation/queryById',
    method: 'get',
  })
}

// 查询参数详细
export function getAllocation(id) {
  return request({
    url: '/system/allocation/' + id,
    method: 'get'
  })
}

//修改数据
export function updateAllocation(data) {
  return request({
    url: '/system/allocation',
    method: 'put',
    data: data
  })
}
