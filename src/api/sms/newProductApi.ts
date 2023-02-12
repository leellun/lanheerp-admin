import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface HomeNewProductSearch extends PageSearch {
  productName: string;
  recommendStatus: number;
}
export interface HomeNewProduct {
  id: any;
  productId: any;
  productName: string;
  recommendStatus: number;
  sort: number;
}
export function _getHomeNewProductPage(params: HomeNewProductSearch) {
  return httpRequest<any, Page<HomeNewProduct>>({
    url: "/sms/homeNewProduct/list",
    method: "get",
    params: params,
  });
}

export function _updateNewProductRecommendStatus(ids:Array<any>,recommendStatus:number) {
  return httpRequestWithMsg({
    url: "/sms/homeNewProduct/update/recommendStatus",
    method: "post",
    params:{
      ids:ids.join(","),
      recommendStatus
    },
  });
}

export function _deleteNewProduct(ids:Array<any>) {
  return httpRequestWithMsg({
    url: "/sms/homeNewProduct/delete",
    method: "post",
    params:{
      ids:ids.join(","),
    },
  });
}

export function _createNewProduct(data:Array<HomeNewProduct>) {
  return httpRequestWithMsg({
    url: "/sms/homeNewProduct/create",
    method: "post",
    data: data,
  });
}

export function _updateNewProductSort(id:any,sort:number) {
  return httpRequestWithMsg({
    url: "/sms/homeNewProduct/update/sort/" + id,
    method: "post",
    params: {sort},
  });
}
