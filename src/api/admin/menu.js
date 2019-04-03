import request from '@/utils/request'

export function getMenuList() {
  return request({
    url: '/admin/menu/index.html'
  })
}

export function addMenu(parent_id) {
  return request({
    url: '/admin/menu/add/parent_id/' + parent_id + '.html'
  })
}

export function addMenuPost(postData) {
  return request({
    url: '/admin/menu/addPost.html',
    method: 'post',
    data: postData
  })
}

export function editMenu(id) {
  return request({
    url: '/admin/menu/edit/id/' + id + '.html'
  })
}

export function editMenuPost(postData) {
  return request({
    url: '/admin/menu/editPost.html',
    method: 'post',
    data: postData
  })
}

export function deleteMenu(id) {
  return request({
    url: '/admin/menu/delete/id/' + id + '.html'
  })
}
