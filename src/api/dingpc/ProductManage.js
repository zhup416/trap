import request from '@/utils/request'

// 获取产品分类列表
export function getClassifyList(param) {
  return request({
    url: '/dingpc/product/productClassify.html',
    method: 'post',
    data: param
  })
}
// 删除分类
export function delClassify(param) {
  return request({
    url: '/dingpc/product/delProductClassify.html',
    method: 'post',
    data: param
  })
}
// 获取分类级层列表
export function getClassifyLevel(param) {
  return request({
    url: '/dingpc/product/clickProductAdd.html',
    method: 'post',
    data: param
  })
}
// 添加分类
export function addClassify(param) {
  return request({
    url: '/dingpc/product/addProductClassify.html',
    method: 'post',
    data: param
  })
}
/** *********************************/
// 获取产品列表数据
export function getProductList(param) {
  return request({
    url: '/dingpc/product/productManegeShow.html',
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
// 获取所有产品标签
export function productTag() {
  return request({
    url: '/dingpc/product/productTag',
    method: 'post'
  })
}
// 产品推荐不推荐修改
export function productRecommend(param) {
  return request({
    url: '/dingpc/product/productRecommend.html',
    method: 'post',
    data: param
  })
}
// 产品上下架
export function productUpDown(param) {
  return request({
    url: '/dingpc/product/upDown.html',
    method: 'post',
    data: param
  })
}
// 创建产品
export function addProduct(param) {
  return request({
    url: '/dingpc/product/createProduct',
    method: 'post',
    data: param
  })
}
// 获取产品分类
export function productCategory(param) {
  return request({
    url: '/dingpc/product/allProductClassify',
    method: 'post',
    data: param
  })
}
// 获取所有产品权限
export function allPowerData() {
  return request({
    url: '/dingpc/product/allPowerData',
    method: 'post'
  })
}
// 删除产品
export function delProduct(param) {
  return request({
    url: '/dingpc/product/delProduct.html',
    method: 'post',
    data: param
  })
}
