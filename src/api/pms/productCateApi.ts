import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "../types";
export interface ProductCategorySearch {
  pageNum: number;
  pageSize: number;
}
export interface ProductCategory {
  id: string;
  parentId: string;
  name: string;
  level: number;
  productCount: number;
  productUnit: string;
  navStatus: number;
  showStatus: number;
  sort: number;
  icon: string;
  keywords: string;
  description: string;
}
export interface ProductCategoryDto {
  parentId: string;
  productUnit: string;
  name: string;
  navStatus: number;
  showStatus: number;
  sort: number;
  icon: string;
  keywords: string;
  description: string;
  productAttributeIdList: Array<string>;
}
export interface ProductCategoryWithChildrenItemVo extends ProductCategory {
  children: Array<ProductCategory>;
}
export function fetchList(parentId: string, params: ProductCategorySearch) {
  return httpRequest<any, Page<ProductCategory>>({
    url: "/pms/productCategory/list/" + parentId,
    method: "get",
    params: params,
  });
}
export function deleteProductCate(id: string) {
  return httpRequestWithMsg({
    url: "/pms/productCategory/delete/" + id,
    method: "delete",
  });
}

export function createProductCate(data: ProductCategoryDto) {
  return httpRequestWithMsg({
    url: "/pms/productCategory/create",
    method: "post",
    data: data,
  });
}

export function updateProductCate(id: string, data: ProductCategoryDto) {
  return httpRequestWithMsg({
    url: "pms/productCategory/update/" + id,
    method: "put",
    data: data,
  });
}

export function getProductCate(id: string) {
  return httpRequest<any, ProductCategory>({
    url: "pms/productCategory/" + id,
    method: "get",
  });
}

export function updateShowStatus(data: ProductCategoryDto) {
  return httpRequestWithMsg({
    url: "pms/productCategory/update/showStatus",
    method: "put",
    data: data,
  });
}

export function updateNavStatus(data: ProductCategoryDto) {
  return httpRequestWithMsg({
    url: "pms/productCategory/update/navStatus",
    method: "put",
    data: data,
  });
}

export function _fetchListWithChildren() {
  return httpRequest<any,Array<ProductCategoryWithChildrenItemVo>>({
    url: "pms/productCategory/list/withChildren",
    method: "get",
  });
}
export const _getSubCategorys = (pid: string) => {
  return httpRequest<any, Array<ProductCategory>>({
    url: `pms/productCategory/sub/${pid}`,
    method: "get",
  });
};