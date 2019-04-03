import request from '@/utils/request'

export function index() {
  return request({
    url: '/admin/mailer/index.html'
  })
}

export function indexPost(mailerInfo) {
  return request({
    url: '/admin/mailer/indexPost.html',
    method: 'post',
    data: mailerInfo
  })
}

export function test(testMailer) {
  return request({
    url: '/admin/mailer/test.html',
    method: 'post',
    data: testMailer
  })
}

export function template() {
  return request({
    url: '/admin/mailer/template.html?template_key=verification_code'
  })
}

export function templatePost(templateData) {
  return request({
    url: '/admin/mailer/templatePost.html',
    method: 'post',
    data: templateData
  })
}

