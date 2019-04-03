import request from '@/utils/request'

export function login(username, password, device_type, captcha) {
  return request({
    url: '/admin/public/login.html',
    method: 'post',
    data: {
      username,
      password,
      device_type,
      captcha
    }
  })
}

export function handleLogin(data) {
  return request({
    url: '/home/index/getUserInfo',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/public/userInfo.html',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/public/logout.html',
    method: 'post'
  })
}

export function captchaUrl() {
  return request({
    url: '/admin/public/captchaUrl.html'
  })
}
