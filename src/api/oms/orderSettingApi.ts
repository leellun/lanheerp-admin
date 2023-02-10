import request from '@/utils/request'
export function getOrderSetting(id) {
  return request({
    url:'/mall-admin-oms/orderSetting/'+id,
    method:'get',
  })
}

export function updateOrderSetting(id,data) {
  return request({
    url:'/mall-admin-oms/orderSetting/update/'+id,
    method:'post',
    data:data
  })
}
