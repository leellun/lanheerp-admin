import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface FlashPromotionProductRelation {
  id: any
  flashPromotionId: any
  flashPromotionSessionId: any
  productId: any
  flashPromotionPrice: number
  flashPromotionCount: number
  flashPromotionLimit: number
  sort: number
}
export interface FlashPromotionProductRelationSearch extends PageSearch {
  flashPromotionId: any
  flashPromotionSessionId: any
}
export function _getFlashPromotionProductRelationPage(params: FlashPromotionProductRelationSearch) {
  return httpRequest<any, Page<FlashPromotionProductRelation>>({
    url: '/flashPromotionProductRelation/list',
    method: 'get',
    params: params
  })
}
export function _createFlashProductRelation(data: Array<FlashPromotionProductRelation>) {
  return httpRequestWithMsg({
    url: '/flashPromotionProductRelation/create',
    method: 'post',
    data: data
  })
}
export function _deleteFlashProductRelation(id: any) {
  return httpRequestWithMsg({
    url: '/flashPromotionProductRelation/delete/' + id,
    method: 'post'
  })
}
export function _updateFlashProductRelation(id: any, data: FlashPromotionProductRelation) {
  return httpRequestWithMsg({
    url: '/flashPromotionProductRelation/update/' + id,
    method: 'post',
    data: data
  })
}
