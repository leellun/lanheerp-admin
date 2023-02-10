import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface Order {
  id: string;
  memberId: string;
  couponId: string;
  orderSn: string;
  createTime: string;
  memberUsername: string;
  totalAmount: number;
  payAmount: number;
  freightAmount: number;
  promotionAmount: number;
  integrationAmount: number;
  couponAmount: number;
  discountAmount: number;
  payType: number;
  sourceType: number;
  status: number;
  orderType: number;
  deliveryCompany: string;
  deliverySn: string;
  autoConfirmDay: number;
  integration: number;
  growth: number;
  promotionInfo: string;
  billHeader: string;
  billContent: string;
  billReceiverPhone: string;
  billType: number;
  billReceiverEmail: string;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode: string;
  receiverCity: string;
  receiverProvince: string;
  receiverRegion: string;
  receiverDetailAddress: string;
  note: string;
  deliveryTime: string;
  paymentTime: string;
  receiveTime: string;
  commentTime: string;
  modifyTime: string;
  confirmStatus: number;
  deleteStatus: number;
  useIntegration: number;
}
export interface OrderItem {
  id: any;
  orderId: any;
  orderSn: string;
  productId: any;
  productPic: string;
  productName: string;
  productBrand: string;
  productSn: string;
  productPrice: number;
  productQuantity: number;
  productSkuId: any;
  productCategoryId: any;
  productSkuCode: string;
  promotionName: string;
  promotionAmount: number;
  couponAmount: number;
  integrationAmount: number;
  realAmount: number;
  giftIntegration: number;
  giftGrowth: number;
  productAttr: string;
}
export interface OrderOperateHistory {
  id: any;
  orderId: any;
  operateMan: string;
  createTime: string;
  orderStatus: number;
  note: string;
}
export interface OrderDetailVo extends Order {
  orderItemList: Array<OrderItem>;
  historyList: Array<OrderOperateHistory>;
}
export interface OrderSearch extends PageSearch {
  orderSn: string;
  receiverKeyword: string;
  status: number;
  orderType: number;
  sourceType: number;
  createTime: string;
}
export interface CloseOrder {
  ids: Array<string>;
  note: string;
}
export interface DeliveryOrder {
  orderId: string;
  orderSn: string;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode: string;
  address: string;
  deliveryCompany: string;
  deliverySn: string;
}
export interface ReceiverAddress {
  orderId: string;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode: string;
  receiverDetailAddress: string;
  receiverProvince: string;
  receiverCity: string;
  receiverRegion: string;
  status: number;
}
export interface MoneyInfo {
  orderId: string;
  freightAmount: number;
  discountAmount: number;
  status: number;
}
export interface OrderDeliveryDto {
  orderId:any
  deliveryCompany:string
  deliverySn:string
}
export function _getOrderPageLists(params: OrderSearch) {
  return httpRequest<any, Page<Order>>({
    url: "/oms/order/list",
    method: "get",
    params: params,
  });
}

export function _closeOrder(params: CloseOrder) {
  return httpRequestWithMsg({
    url: "/oms/order/update/close",
    method: "post",
    params: {
      ids: params.ids.join(","),
      note: params.note,
    },
  });
}

export function _deleteOrder(ids: Array<string>) {
  return httpRequestWithMsg({
    url: "/oms/order/delete",
    method: "delete",
    params: { ids: ids.join(",") },
  });
}

export function _deliveryOrder(data: Array<OrderDeliveryDto>) {
  return httpRequestWithMsg({
    url: "/oms/order/update/delivery",
    method: "post",
    data: data,
  });
}

export function _getOrderDetail(id: string) {
  return httpRequest<any,OrderDetailVo>({
    url: "/oms/order/" + id,
    method: "get",
  });
}

export function _updateReceiverInfo(data: ReceiverAddress) {
  return httpRequestWithMsg({
    url: "/oms/order/update/receiverInfo",
    method: "post",
    data: data,
  });
}

export function _updateMoneyInfo(data: MoneyInfo) {
  return httpRequestWithMsg({
    url: "/oms/order/update/moneyInfo",
    method: "post",
    data: data,
  });
}

export function _updateOrderNote(params: {
  id: string;
  note: string;
  status: number;
}) {
  return httpRequestWithMsg({
    url: "/oms/order/update/note",
    method: "post",
    params: params,
  });
}
