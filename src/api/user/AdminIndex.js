import request from '@/utils/request'

export function index(listQuery) {
  return request({
    url: '/user/admin_index/index.html',
    params: listQuery
  })
}

export function ban(id) {
  return request({
    url: '/user/admin_index/ban/id/' + id + '.html'
  })
}

export function cancelBan(id) {
  return request({
    url: '/user/admin_index/cancelBan/id/' + id + '.html'
  })
}
