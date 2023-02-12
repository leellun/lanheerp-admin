import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface CouponHistorySearch extends PageSearch {
  couponId?: any;
  useStatus?: number;
  orderSn?: string;
}
export interface CouponHistory {
  id: any;
  couponId: any;
  orderId: any;
  memberId: any;
  couponCode: string;
  memberNickname: string;
  createTime: string;
  useTime: string;
  orderSn: string;
  getType: number;
  useStatus: number;
}
export function _getCouponHistoryPage(params: CouponHistorySearch) {
  return httpRequest<any, Page<CouponHistory>>({
    url: "/sms/couponHistory/list",
    method: "get",
    params: params,
  });
}
