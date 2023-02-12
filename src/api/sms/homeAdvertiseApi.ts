import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface AdvertiseSearch extends PageSearch {
  name: string;
  type: number;
  endTime: string;
}
export interface HomeAdvertise {
  id: any;
  name: string;
  pic: string;
  startTime: string;
  endTime: string;
  url: string;
  note: string;
  type: number;
  status: number;
  clickCount: number;
  orderCount: number;
  sort: number;
}
export function _getAdvertisePage(params: AdvertiseSearch) {
  return httpRequest<any, Page<HomeAdvertise>>({
    url: "/sms/homeAdvertise/list",
    method: "get",
    params: params,
  });
}
export function _updateAdvertiseStatus(id: any, status: number) {
  return httpRequestWithMsg({
    url: "/sms/homeAdvertise/update/status/" + id,
    method: "post",
    params: { status },
  });
}
export function _deleteHomeAdvertise(data: Array<any>) {
  return httpRequestWithMsg({
    url: "/sms/homeAdvertise/delete",
    method: "delete",
    data: data,
  });
}
export function _createHomeAdvertise(data: HomeAdvertise) {
  return httpRequestWithMsg({
    url: "/sms/homeAdvertise/create",
    method: "post",
    data: data,
  });
}
export function _getHomeAdvertise(id: any) {
  return httpRequest<any, HomeAdvertise>({
    url: "/sms/homeAdvertise/" + id,
    method: "get",
  });
}

export function _updateHomeAdvertise(id: any, data: HomeAdvertise) {
  return httpRequestWithMsg({
    url: "/sms/homeAdvertise/update/" + id,
    method: "post",
    data: data,
  });
}
