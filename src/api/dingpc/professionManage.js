import request from '@/utils/request'
// 设置公司升级条件
export function setUpCondition(param) {
  return request({
    url: '/dingpc/sales_person/setUpCondition.html',
    method: 'post',
    data: param
  })
}
// 获取职称列表
export function getProfessionList(param) {
  return request({
    url: '/dingpc/sales_person/getProfessionList.html',
    method: 'post',
    data: param
  })
}
// 删除职称
export function delProfession(param) {
  return request({
    url: '/dingpc/sales_person/delProfession.html',
    method: 'post',
    data: param
  })
}
// 添加职称
export function addProfessionTitle(param) {
  return request({
    url: '/dingpc/sales_person/addProfession.html',
    method: 'post',
    data: param
  })
}
// 编辑职称
export function editProfessionTitle(param) {
  return request({
    url: '/dingpc/sales_person/editProfession.html',
    method: 'post',
    data: param
  })
}
