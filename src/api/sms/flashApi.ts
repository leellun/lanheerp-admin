import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page,PageSearch } from "../types";
export interface FlashPromotion {
  id:any
  title:string
  startDate:string
  endDate:string
  status:number
  createTime:string
}
export interface FlashPromotionSearch extends PageSearch{
  keyword:string
}
export function _getFlashPromotionPage(params:FlashPromotionSearch) {
  return httpRequest<any,Page<FlashPromotion>>({
    url:'/sms/flashPromotion/list',
    method:'get',
    params:params
  })
}
export function _updateFlashStatus(id:any,status:number) {
  return httpRequestWithMsg({
    url:'/sms/flashPromotion/update/status/'+id,
    method:'post',
    params:{status}
  })
}
export function _deleteFlash(id:any) {
  return httpRequestWithMsg({
    url:'/sms/flashPromotion/delete/'+id,
    method:'post'
  })
}
export function _createFlash(data:FlashPromotion) {
  return httpRequestWithMsg({
    url:'/sms/flashPromotion/create',
    method:'post',
    data:data
  })
}
export function _updateFlash(id:any,data:FlashPromotion) {
  return httpRequestWithMsg({
    url:'/sms/flashPromotion/update/'+id,
    method:'post',
    data:data
  })
}
