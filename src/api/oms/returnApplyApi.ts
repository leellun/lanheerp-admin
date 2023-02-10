import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface ReturnApplyQueryDto extends PageSearch {
  id: any;
  receiverKeyword: string;
  status: number;
  createTime: string;
  handleMan: string;
  handleTime: string;
}
export interface OrderReturnApply {
  id: any;
  orderId: any;
  companyAddressId: any;
  productId: any;
  orderSn: string;
  createTime: string;
  memberUsername: string;
  returnAmount: number;
  returnName: string;
  returnPhone: string;
  handleTime: string;
  productPic: string;
  productName: string;
  productBrand: string;
  productAttr: string;
  status: number;
  productCount: number;
  productPrice: number;
  productRealPrice: number;
  reason: string;
  description: string;
  proofPics: string;
  handleNote: string;
  handleMan: string;
  receiveMan: string;
  receiveTime: string;
  receiveNote: string;
}

export function _getReturnApplyPage(data: ReturnApplyQueryDto) {
  return httpRequest<any,Page<OrderReturnApply>>({
    url: "/oms/orderReturnApply/list",
    method: "post",
    data,
  });
}

export function _deleteApply(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/oms/orderReturnApply/delete",
    method: "post",
    params: { ids: ids.join(",") },
  });
}
export function _updateApplyStatus(id: any, data: OrderReturnApply) {
  return httpRequestWithMsg({
    url: "/oms/orderReturnApply/update/status/" + id,
    method: "post",
    data: data,
  });
}

export function _getApplyDetail(id: any) {
  return httpRequest({
    url: "/oms/orderReturnApply/" + id,
    method: "get",
  });
}
