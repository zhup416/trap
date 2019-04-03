import request from '@/utils/request'

export function clearCache() {
  return request({
    url: '/admin/setting/clearCache.html'
  })
}

export function upload() {
  return request({
    url: '/admin/setting/upload.html'
  })
}

export function uploadPost(uploadData) {
  return request({
    url: '/admin/setting/uploadPost.html',
    method: 'post',
    data: uploadData
  })
}

export function site() {
  return request({
    url: '/admin/setting/site.html'
  })
}

export function sitePost(options, cdn_settings, cmf_settings) {
  return request({
    url: '/admin/setting/sitePost.html',
    method: 'post',
    data: {
      options,
      cdn_settings,
      cmf_settings
    }
  })
}

export function passwordPost(passwordData) {
  return request({
    url: '/admin/setting/passwordPost.html',
    method: 'post',
    data: passwordData
  })
}

export function slideList(listQuery) {
  return request({
    url: '/admin/slide/index.html',
    method: 'get',
    params: listQuery
  })
}

export function slideAddPost(slideData) {
  return request({
    url: '/admin/slide/addPost.html',
    method: 'post',
    data: slideData
  })
}

export function slideEditPost(slideData) {
  return request({
    url: '/admin/slide/editPost.html',
    method: 'post',
    data: slideData
  })
}

export function slideDeletePost(id) {
  return request({
    url: '/admin/slide/delete.html',
    method: 'post',
    data: {
      id
    }
  })
}

export function slideItemList(slide_id) {
  return request({
    url: '/admin/slide_item/index.html',
    method: 'post',
    data: {
      slide_id
    }
  })
}

export function slideItemAddPost(slideItemData) {
  return request({
    url: '/admin/slide_item/addPost.html',
    method: 'post',
    data: {
      slideItemData
    }
  })
}

export function slideItemEditPost(slideItemData) {
  return request({
    url: '/admin/slide_item/editPost.html',
    method: 'post',
    data: {
      slideItemData
    }
  })
}

export function slideItemDeletePost(id) {
  return request({
    url: '/admin/slide_item/delete.html',
    method: 'post',
    data: {
      id
    }
  })
}

export function slideItemBanPost(id) {
  return request({
    url: '/admin/slide_item/ban.html',
    method: 'post',
    data: {
      id
    }
  })
}

export function slideItemCancelBanPost(id) {
  return request({
    url: '/admin/slide_item/cancelBan.html',
    method: 'post',
    data: {
      id
    }
  })
}

export function pluginList(listQuery) {
  return request({
    url: '/admin/plugin/index.html',
    method: 'get',
    params: listQuery
  })
}

export function pluginInstall(name) {
  return request({
    url: '/admin/plugin/install.html',
    method: 'get',
    params: {
      name
    }
  })
}

export function pluginUninstall(id) {
  return request({
    url: '/admin/plugin/uninstall.html',
    method: 'get',
    params: {
      id
    }
  })
}

export function fileStorage() {
  return request({
    url: '/admin/storage/index.html',
    method: 'get'
  })
}

export function fileStoragePost(type) {
  return request({
    url: '/admin/storage/settingPost.html',
    method: 'post',
    data: {
      type
    }
  })
}
