import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface HomeHotProductSearch extends PageSearch {
  productName: string;
  recommendStatus: number;
}
export interface HomeHotProduct {
  id: any;
  productId: any;
  productName: string;
  recommendStatus: number;
  sort: number;
}
export function _getHomeRecommendProductPage(params: HomeHotProductSearch) {
  return httpRequest<any, Page<HomeHotProduct>>({
    url: "/sms/homeRecommendProduct/list",
    method: "get",
    params: params,
  });
}

export function _updateHotProductRecommendStatus(
  ids: Array<any>,
  recommendStatus: number
) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendProduct/update/recommendStatus",
    method: "post",
    params: {
      ids: ids.join(","),
      recommendStatus,
    },
  });
}

export function _deleteHotProduct(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendProduct/delete",
    method: "post",
    params: {
      ids: ids.join(","),
    },
  });
}

export function _createHotProduct(data: Array<HomeHotProduct>) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendProduct/create",
    method: "post",
    data: data,
  });
}

export function _updateHotProductSort(id: any, sort: number) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendProduct/update/sort/" + id,
    method: "post",
    params: { sort },
  });
}
