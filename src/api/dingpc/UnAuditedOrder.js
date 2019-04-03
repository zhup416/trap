import request from '@/utils/request'

// 获取待审核订单列表
export function getOrderList(param) {
  return request({
    url: '/dingpc/order/auditingOrder.html',
    method: 'post',
    data: param
  })
}

// 生成订单号
export function getOrderNum() {
  return request({
    url: '/dingpc/order/getOrderNum',
    method: 'post'
  })
}

// 所有产品
export function showAllProduct() {
  return request({
    url: '/dingpc/order/showAllProduct',
    method: 'post'
  })
}
