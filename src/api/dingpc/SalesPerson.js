import request from '@/utils/request'

export function getUserData() {
  return request({
    url: '/dingpc/sales_person/getUserData.html',
    method: 'post',
    data: { 'companyId': 1 }
  })
}

export function getNetSpot() {
  return request({
    url: '/dingpc/sales_person/getNetSpot.html',
    method: 'post',
    data: { 'companyId': 1 }
  })
}

export function getProfession() {
  return request({
    url: '/dingpc/sales_person/getProfessionList.html',
    method: 'post',
    data: { 'companyId': 1, '·': 99 }
  })
}

export function getTag() {
  return request({
    url: '/dingpc/sales_person/getStaffTag.html',
    method: 'post',
    data: { 'companyId': 1 }
  })
}

export function searchPerson(param) {
  return request({
    url: '/dingpc/sales_person/getUserList.html',
    method: 'post',
    data: param
  })
}
// 获取网点所在城市
export function getNetCity(param) {
  return request({
    url: '/dingpc/sales_person/getNetSpotCity.html',
    method: 'post',
    data: param
  })
}
// 添加展业员-标签选择
export function getPeopleTag(param) {
  return request({
    url: '/dingpc/tag/getGroupTag.html',
    method: 'post',
    data: param
  })
}
// 添加展业员
export function addSalesPerson(param) {
  return request({
    url: '/dingpc/sales_person/addSalesPerson.html',
    method: 'post',
    data: param
  })
}
// 编辑展业员
export function editSalesPerson(param) {
  return request({
    url: '/dingpc/sales_person/editSalesPerson.html',
    method: 'post',
    data: param
  })
}

