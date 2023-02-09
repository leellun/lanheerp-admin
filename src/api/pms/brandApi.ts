import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page,PageSearch } from "../types";
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
export interface BrandSearch extends  PageSearch{
    keyword?:string
}
export function _getBrandList(params: BrandSearch) {
  return httpRequest<any, Page<Brand>>({
    url: 'pms/brand/list',
    method: 'get',
    params
  })
}
export function _getAllBrandList(keyword?: string) {
  return httpRequest<any, Array<Brand>>({
    url: 'pms/brand/listAll',
    method: 'get',
    params: { keyword }
  })
}
export function _createBrand(data: Brand) {
  return httpRequestWithMsg({
    url: 'pms/brand/create',
    method: 'post',
    data: data
  })
}
export function _updateShowStatus(data: any) {
  return httpRequestWithMsg({
    url: 'pms/brand/update/showStatus',
    method: 'put',
    data: data
  })
}

export function _updateFactoryStatus(data: any) {
  return httpRequestWithMsg({
    url: 'pms/brand/update/factoryStatus',
    method: 'put',
    data: data
  })
}

export function _deleteBrand(id: string) {
  return httpRequestWithMsg({
    url: 'pms/brand/delete/' + id,
    method: 'delete',
  })
}

export function _getBrand(id: string) {
  return httpRequest({
    url: 'pms/brand/' + id,
    method: 'get',
  })
}

export function _updateBrand(id: string, data: Brand) {
  return httpRequestWithMsg({
    url: 'pms/brand/update/' + id,
    method: 'put',
    data: data
  })
}