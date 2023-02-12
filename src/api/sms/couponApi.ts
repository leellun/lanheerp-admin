import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface CouponSearch extends PageSearch {
  type: number;
  name: string;
}
export interface Coupon {
  id: any;
  type: number;
  name: string;
  platform: number;
  count: number;
  amount: number;
  perLimit: number;
  minPoint: number;
  startTime: string;
  note: string;
  endTime: string;
  enableTime: string;
  code: string;
  useType: number;
  publishCount: number;
  useCount: number;
  receiveCount: number;
  memberLevel: number;
}
export interface CouponProductRelation {
  id: any;
  couponId: any;
  productId: any;
  productName: string;
  productSn: string;
}
export interface CouponProductCategoryRelation {
  id: any;
  couponId: any;
  productCategoryId: any;
  productCategoryName: string;
  parentCategoryName: string;
}
export interface CouponDto extends Coupon {
  productRelationList: Array<CouponProductRelation>;
  productCategoryRelationList: Array<CouponProductCategoryRelation>;
}
export function _getCouponPage(params: CouponSearch) {
  return httpRequest<any, Page<Coupon>>({
    url: "/sms/coupon/list",
    method: "get",
    params: params,
  });
}

export function _createCoupon(data: CouponDto) {
  return httpRequestWithMsg({
    url: "/sms/coupon/create",
    method: "post",
    data: data,
  });
}

export function _getCoupon(id: any) {
  return httpRequest<any, CouponDto>({
    url: "/sms/coupon/" + id,
    method: "get",
  });
}

export function _updateCoupon(id: any, data: CouponDto) {
  return httpRequestWithMsg({
    url: "/sms/coupon/update/" + id,
    method: "post",
    data: data,
  });
}

export function _deleteCoupon(id: any) {
  return httpRequestWithMsg({
    url: "/sms/coupon/delete/" + id,
    method: "post",
  });
}
