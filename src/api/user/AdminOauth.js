import request from '@/utils/request'

export function index(listQuery) {
  return request({
    url: '/user/admin_oauth/index.html',
    params: listQuery
  })
}

export function delete_(id) {
  return request({
    url: '/user/admin_oauth/delete/id/' + id + '.html'
  })
}

