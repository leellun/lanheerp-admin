import { httpRequest, httpRequestWithMsg } from "@/utils/request";
export interface OrderSetting {
  id: any;
  flashOrderOvertime: number;
  normalOrderOvertime: number;
  confirmOvertime: number;
  finishOvertime: number;
  commentOvertime: number;
}
export function _getOrderSetting(id: any) {
  return httpRequest<any, OrderSetting>({
    url: "/oms/orderSetting/" + id,
    method: "get",
  });
}

export function _updateOrderSetting(id: any, data: OrderSetting) {
  return httpRequestWithMsg({
    url: "/oms/orderSetting/update/" + id,
    method: "post",
    data: data,
  });
}
