import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface HomeBrandSearch extends PageSearch{
  brandName: string;
  recommendStatus: number;
}
export interface HomeBrand {
  id: any;
  brandId: any;
  recommendStatus: number;
  sort: number;
  brandName: string;
}
export function _getBrandPage(params: HomeBrandSearch) {
  return httpRequest<any, Page<HomeBrand>>({
    url: "/sms/homeBrand/list",
    method: "get",
    params: params,
  });
}

export function _updateRecommendStatus(
  ids: Array<any>,
  recommendStatus: number
) {
  return httpRequestWithMsg({
    url: "/sms/homeBrand/update/recommendStatus",
    method: "post",
    params: {
      ids: ids.join(","),
      recommendStatus,
    },
  });
}

export function _deleteHomeBrand(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/sms/homeBrand/delete",
    method: "post",
    params: {
      ids: ids.join(","),
    },
  });
}

export function _createHomeBrand(data: HomeBrand[]) {
  return httpRequestWithMsg({
    url: "/sms/homeBrand/create",
    method: "post",
    data: data,
  });
}

export function _updateHomeBrandSort(id: any, sort: number) {
  return httpRequestWithMsg({
    url: "/sms/homeBrand/update/sort/" + id,
    method: "post",
    params: { sort },
  });
}
