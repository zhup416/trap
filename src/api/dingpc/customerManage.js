import request from '@/utils/request'
// 获取个人客户数据列表
export function getPersonalCustomerData(param) {
  return request({
    url: '/dingpc/customer/showCustomer.html',
    method: 'post',
    data: param
  })
}
// 获取网点列表数据
export function getNet(param) {
  return request({
    url: '/dingpc/sales_person/getNetSpot.html',
    method: 'post',
    data: param
  })
}
// 删除客户
export function delCustomer(param) {
  return request({
    url: '/dingpc/customer/delcustomer.html',
    method: 'post',
    data: param
  })
}
// 获取标签
export function getSubTag(param) {
  return request({
    url: '/dingpc/tag/getTag.html',
    method: 'post',
    data: param
  })
}
// 获取所有展业员
export function getSalesPerson(param) {
  return request({
    url: '/dingpc/customer/allPerson.html',
    method: 'post',
    data: param
  })
}
// 获取展业员对应的网点及城市
export function getNetCity(param) {
  return request({
    url: '/dingpc/customer/getNetCity.html',
    method: 'post',
    data: param
  })
}
// 创建客户-获取标签
export function getCustomerTag(param) {
  return request({
    url: '/dingpc/tag/getGroupTag.html',
    method: 'post',
    data: param
  })
}
// 创建个人客户
export function addCustomer(param) {
  return request({
    url: '/dingpc/customer/addCompanyCustomer.html',
    method: 'post',
    data: param
  })
}

// 客户详情-基本信息展示
export function getCustomerInfo(param) {
  return request({
    url: '/dingpc/customer/showCustomerBase.html',
    method: 'post',
    data: param
  })
}

// 客户详情-获取所有展业员
export function getAllPerson(param) {
  return request({
    url: '/dingpc/net_spot/allPerson.html',
    method: 'post',
    data: param
  })
}
// 客户详情-获取客户订单记录
export function customerRecord(param) {
  return request({
    url: '/dingpc/customer/customerRecord.html',
    method: 'post',
    data: param
  })
}
// 客户详情-修改信息
export function saveCustomerBase(param) {
  return request({
    url: '/dingpc/customer/saveCustomerBase.html',
    method: 'post',
    data: param
  })
}
// 新增个人客户
export function addPersonCustomer(param) {
  return request({
    url: '/dingpc/customer/addPersonCustomer.html',
    method: 'post',
    data: param
  })
}
