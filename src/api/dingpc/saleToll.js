import request from '@/utils/request'

//获取试题列表
export function allHealthTest (prama){
    return request({
      url:'/dingpc/health/allHealthTest',
      method:'post',
      pramas:prama
    })
}
//编辑列表
export function showEdit (prama){
  return request({
    url:'/dingpc/health/showEdit',
    method:'get',
    pramas:prama
  })
}

//报告列表
export function reportList (){
  return request({
    url:'/dingpc/health/reports',
    method:'get',
  })
}

//报告详情
export function takeDetails (param){
  return request({
    url:'/dingpc/health/report',
    method:'get',
    params:param
  })
}

//删除报告
export function delHealth (param){
  return request({
    url:'/dingpc/health/delHealth',
    method:'get',
    params:param
  })
}