import request from '@/utils/request'

export function index(listQuery) {
  return request({
    url: '/admin/rbac/index.html',
    params: listQuery
  })
}

export function delete_(id) {
  return request({
    url: '/admin/rbac/roleDelete/id/' + id + '.html'
  })
}

export function roleAddPost(roleData) {
  return request({
    url: '/admin/rbac/roleAddPost.html',
    method: 'post',
    data: roleData
  })
}

export function roleEditPost(roleData) {
  return request({
    url: '/admin/rbac/roleEditPost.html',
    method: 'post',
    data: roleData
  })
}

export function authorizeGet(id) {
  return request({
    url: '/admin/rbac/authorize/id/' + id + '.html'
  })
}

export function authorizePost(postData) {
  return request({
    url: '/admin/rbac/authorizePost.html',
    method: 'post',
    data: postData
  })
}
