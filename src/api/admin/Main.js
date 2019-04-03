import request from '@/utils/request'

export function sysInfo() {
  return request({
    url: '/admin/main/sysInfo.html'
  })
}

