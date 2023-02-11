import { httpRequest, httpRequestWithMsg } from "@/utils/request";
export interface FlashPromotionSession {
  id: any
  name: string
  startTime: string
  endTime: string
  status: number
  createTime: string
}
export function _getList() {
  return httpRequest<any,Array<FlashPromotionSession>>({
    url: '/flashPromotionSession/list',
    method: 'get',
  })
}

export function _getSelectList(flashPromotionId:any) {
  return httpRequest<any,Array<FlashPromotionSession>>({
    url: '/flashPromotionSession/selectList',
    method: 'get',
    params: {flashPromotionId}
  })
}

export function _updateStatus(id:any, status:number) {
  return httpRequestWithMsg({
    url: '/flashPromotionSession/update/status/' + id,
    method: 'post',
    params: {status}
  })
}

export function _deleteSession(id:any) {
  return httpRequestWithMsg({
    url: '/flashPromotionSession/delete/' + id,
    method: 'post'
  })
}

export function _createSession(data:FlashPromotionSession) {
  return httpRequestWithMsg({
    url: '/flashPromotionSession/create',
    method: 'post',
    data: data
  })
}

export function _updateSession(id:any, data:FlashPromotionSession) {
  return httpRequestWithMsg({
    url: '/flashPromotionSession/update/' + id,
    method: 'post',
    data: data
  })
}
