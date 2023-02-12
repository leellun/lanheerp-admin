import { httpRequest, httpRequestWithMsg } from "@/utils/request";
export interface FlashPromotionSession {
  id: any
  name: string
  startTime: string
  endTime: string
  status: number
  createTime: string
}
export interface FlashPromotionSessionDetailVo extends FlashPromotionSession{
  productCount:number
}
export function _getFlashSessionList() {
  return httpRequest<any,Array<FlashPromotionSession>>({
    url: '/sms/flashPromotionSession/list',
    method: 'get',
  })
}

export function _getSessionSelectList(flashPromotionId:any) {
  return httpRequest<any,Array<FlashPromotionSessionDetailVo>>({
    url: '/sms/flashPromotionSession/selectList',
    method: 'get',
    params: {flashPromotionId}
  })
}

export function _updateFlashSessionStatus(id:any, status:number) {
  return httpRequestWithMsg({
    url: '/sms/flashPromotionSession/update/status/' + id,
    method: 'post',
    params: {status}
  })
}

export function _deleteSession(id:any) {
  return httpRequestWithMsg({
    url: '/sms/flashPromotionSession/delete/' + id,
    method: 'post'
  })
}

export function _createSession(data:FlashPromotionSession) {
  return httpRequestWithMsg({
    url: '/sms/flashPromotionSession/create',
    method: 'post',
    data: data
  })
}

export function _updateSession(id:any, data:FlashPromotionSession) {
  return httpRequestWithMsg({
    url: '/sms/flashPromotionSession/update/' + id,
    method: 'post',
    data: data
  })
}
