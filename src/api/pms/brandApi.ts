import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "../types";
export interface Brand {
  id: string;
  name: string;
  firstLetter: string;
  sort: number;
  factoryStatus: number;
  showStatus: number;
  productCount: number;
  productCommentCount: number;
  logo: string;
  bigPic: string;
  brandStory: string;
}
export function _getBrandList(keyword?: string) {
  return httpRequest<any, Page<Brand>>({
    url: 'pms/brand/list',
    method: 'get',
    params: { keyword }
  })
}
export function _getAllBrandList(keyword?: string) {
  return httpRequest<any, Array<Brand>>({
    url: 'pms/brand/listAll',
    method: 'get',
    params: { keyword }
  })
}
export function createBrand(data: Brand) {
  return httpRequestWithMsg({
    url: 'pms/brand/create',
    method: 'post',
    data: data
  })
}
export function updateShowStatus(data: any) {
  return httpRequestWithMsg({
    url: 'pms/brand/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateFactoryStatus(data: any) {
  return httpRequestWithMsg({
    url: 'pms/brand/update/factoryStatus',
    method: 'post',
    data: data
  })
}

export function deleteBrand(id: string) {
  return httpRequestWithMsg({
    url: 'pms/brand/delete/' + id,
    method: 'get',
  })
}

export function getBrand(id: string) {
  return httpRequest({
    url: 'pms/brand/' + id,
    method: 'get',
  })
}

export function updateBrand(id: string, data: Brand) {
  return httpRequestWithMsg({
    url: 'pms/brand/update/' + id,
    method: 'post',
    data: data
  })
}