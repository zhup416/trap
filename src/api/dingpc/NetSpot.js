import request from '@/utils/request'
// 获取网点数据及列表
export function getNetData(param) {
  return request({
    url: '/dingpc/net_spot/showNetManage.html',
    method: 'post',
    data: param
  })
}
// 获取标签列表
export function getTagList(param) {
  return request({
    url: '/dingpc/net_spot/allTag.html',
    method: 'post',
    data: param
  })
}
// 删除网点
export function delNet(param) {
  return request({
    url: '/dingpc/net_spot/delNet.html',
    method: 'post',
    data: param
  })
}
// 网点营业停业设置
export function netStatus(param) {
  return request({
    url: '/dingpc/net_spot/netStatus.html',
    method: 'post',
    data: param
  })
}
// 创建网点-获取标签
export function getNetTag(param) {
  return request({
    url: '/dingpc/net_spot/findTag.html',
    method: 'post',
    data: param
  })
}
// 创建网点-返回所有展业员
export function getAllPerson(param) {
  return request({
    url: '/dingpc/net_spot/allPerson.html',
    method: 'post',
    data: param
  })
}
// 创建/编辑网点
export function addNetSpot(param) {
  return request({
    url: '/dingpc/net_spot/addNet.html',
    method: 'post',
    data: param
  })
}
// 网点详情
export function netDetail(param) {
  return request({
    url: '/dingpc/net_spot/netShow',
    method: 'post',
    data: param
  })
}
// 设置展业员数据
export function setPeoson(param) {
  return request({
    url: '/dingpc/net_spot/setPeoson',
    method: 'post',
    data: param
  })
}
// 获取公司列表
export function companyList(param) {
  return request({
    url: '/dingpc/company/index',
    method: 'post',
    data: param
  })
}
// 修改公司数据
export function companyEdit(param) {
  return request({
    url: '/dingpc/company/edit',
    method: 'post',
    data: param
  })
}
// 新增公司数据
export function companyAdd(param) {
  return request({
    url: '/dingpc/company/add',
    method: 'post',
    data: param
  })
}
// 删除公司数据
export function companyDel(param) {
  return request({
    url: '/dingpc/company/delete',
    method: 'get',
    param: param
  })
}

