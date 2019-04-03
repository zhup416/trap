import request from '@/utils/request'

export function index(listQuery) {
  return request({
    url: '/admin/user/index.html',
    params: listQuery
  })
}

export function roles() {
  return request({
    url: '/admin/user/roles.html'
  })
}

export function addPost(userData) {
  return request({
    url: '/admin/user/addPost.html',
    method: 'post',
    data: userData
  })
}

export function edit(id) {
  return request({
    url: '/admin/user/edit/id/' + id + '.html'
  })
}

export function editPost(userData) {
  return request({
    url: '/admin/user/editPost.html',
    method: 'post',
    data: userData
  })
}

export function delete_(id) {
  return request({
    url: '/admin/user/delete/id/' + id + '.html'
  })
}

export function ban(id) {
  return request({
    url: '/admin/user/ban/id/' + id + '.html'
  })
}

export function cancelBan(id) {
  return request({
    url: '/admin/user/cancelBan/id/' + id + '.html'
  })
}

export function userInfoPost(userData) {
  return request({
    url: '/admin/user/userInfoPost.html',
    method: 'post',
    data: userData
  })
}

export function userInfo() {
  return request({
    url: '/admin/user/userInfo.html'
  })
}

