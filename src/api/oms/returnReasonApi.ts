import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";

export interface OrderReturnReason {
  id: string;
  name: string;
  sort: number;
  status: number;
  createTime: string;
}
export function _getReturnReasonPage(params: PageSearch) {
  return httpRequest<any, Page<OrderReturnReason>>({
    url: "/oms/returnReason/list",
    method: "get",
    params: params,
  });
}

export function _deleteReason(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/oms/returnReason/delete",
    method: "post",
    params: { ids: ids.join(",") },
  });
}

export function _updateStatus(ids: Array<any>, status: number) {
  return httpRequestWithMsg({
    url: "/oms/returnReason/update/status",
    method: "post",
    params: { ids: ids.join(","), status },
  });
}

export function _addReason(data: OrderReturnReason) {
  return httpRequestWithMsg({
    url: "/oms/returnReason/create",
    method: "post",
    data: data,
  });
}

export function getReasonDetail(id: any) {
  return httpRequest({
    url: "/oms/returnReason/" + id,
    method: "get",
  });
}

export function _updateReason(id: any, data: OrderReturnReason) {
  return httpRequestWithMsg({
    url: "/oms/returnReason/update/" + id,
    method: "post",
    data: data,
  });
}
