
import request from '@/utils/request'

//获取幻灯片列表
export function slideGroupList (prama){
    return request({
      url:'/dingpc/slide/slideGroupList',
      method:'post',
      data:prama
    })
}

//删除幻灯片
export function delSlideList (param){
    return request({
      url:'/dingpc/slide/delSlide',
      method:'get',
      params: param
    })
}

//创建/编辑幻灯片组(后端)
export function addAndEditSlide (param){
  return request({
    url:'/dingpc/slide/addAndEditSlide',
    method:'post',
    data: param
  })
}

//搜索幻灯片组(后端)
export function slideManage (param){
  return request({
    url:'/dingpc/slide/slideManage',
    method:'post',
    data: param
  })
}

//编辑显示(后端)
export function showEdit (param){
  return request({
    url:'/dingpc/slide/showEdit',
    method:'get',
    params: param
  })
}

//获取幻灯片城市列表
export function allNet (){
  return request({
    url:'/dingpc/slide/allNet',
    method:'get',
  })
}
//获取显示状态切换
export function showStatus (param){
  return request({
    url:'/dingpc/slide/showStatus',
    method:'get',
    params:param
  })
}
///////////////////////////////////////////////////////

//获取网点
export function showNet (){
  return request({
    url:'/dingpc/banner/showNet',
    method:'get'
  })
}
//获取广告列表
export function showBannerManner (parma){
  return request({
    url:'/dingpc/banner/showBannerManner',
    method:'post',
    data:parma
  })
}
//添加广告组
export function addBanner (parma){
  return request({
    url:'/dingpc/banner/addBanner',
    method:'post',
    data:parma
  })
}
//显示编辑广告图数据(后端)
export function showEditBanner (param){
  return request({
    url:'/dingpc/banner/showEditBanner',
    method:'get',
    params:param
  })
}
//删除广告图(后端)
export function delBanner (param){
  return request({
    url:'/dingpc/banner/delBanner',
    method:'post',
    data:param
  })
}

//编辑广告图(后端)
export function editBanner (param){
  return request({
    url:'/dingpc/banner/editBanner',
    method:'post',
    data:param
  })
}

//控制显示 (后端)
export function showAdStatus (param){
  return request({
    url:'/dingpc/banner/showStatus',
    method:'get',
    params:param
  })
}

////////////////////////////////

//平台设置信息
export function platformSetupInfo (){
  return request({
    url:'/dingpc/company/platformSetupInfo',
    method:'get',
  })
}

//改变设置
export function platformSetup (param){
  return request({
    url:'/dingpc/company/platformSetup',
    method:'post',
    data:param
  })
}

