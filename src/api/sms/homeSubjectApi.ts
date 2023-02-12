import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
export interface HomeRecommendSubjectSearch extends PageSearch {
  subjectName: string;
  recommendStatus: number;
}
export interface HomeRecommendSubject {
  id: any;
  subjectId: any;
  subjectName: string;
  recommendStatus: number;
  sort: number;
}
export function _getHomeRecommendSubjectPage(
  params: HomeRecommendSubjectSearch
) {
  return httpRequest<any, Page<HomeRecommendSubject>>({
    url: "/sms/homeRecommendSubject/list",
    method: "get",
    params: params,
  });
}

export function _updateRecommendSubjectStatus(
  ids: Array<any>,
  recommendStatus: number
) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendSubject/update/recommendStatus",
    method: "post",
    params: {
      ids: ids.join(","),
      recommendStatus,
    },
  });
}

export function _deleteHomeSubject(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendSubject/delete",
    method: "post",
    params: {
      ids: ids.join(","),
    },
  });
}

export function _createHomeSubject(data: Array<HomeRecommendSubject>) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendSubject/create",
    method: "post",
    data: data,
  });
}

export function _updateHomeSubjectSort(id: any, sort: number) {
  return httpRequestWithMsg({
    url: "/sms/homeRecommendSubject/update/sort/" + id,
    method: "post",
    params: { sort },
  });
}
