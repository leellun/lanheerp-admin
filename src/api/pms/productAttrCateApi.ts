import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page,PageSearch } from "../types";
import type { ProductAttribute } from "./productAttrApi";
export interface ProductAttributeCategory {
  id: string;
  name: string;
  attributeCount: number;
  paramCount: number;
}
export interface ProductAttributeCategoryItemVo
  extends ProductAttributeCategory {
  productAttributeList: Array<ProductAttribute>;
}
export function _getPageAttributeCategory(params: PageSearch) {
  return httpRequest<any, Page<ProductAttributeCategory>>({
    url: "/pms/productAttribute/category/list",
    method: "get",
    params: params,
  });
}
export function _getTotalAttributeCategory() {
  return httpRequest<any, Array<ProductAttributeCategory>>({
    url: "/pms/productAttribute/category/all",
    method: "get"
  });
}

export function _createProductAttrCate(name: string) {
  return httpRequestWithMsg<any, any>({
    url: "/pms/productAttribute/category/create",
    method: "post",
    params: { name },
  });
}

export function _deleteProductAttrCate(id: string) {
  return httpRequestWithMsg<any,any>({
    url: "/pms/productAttribute/category/delete/" + id,
    method: "delete",
  });
}

export function _updateProductAttrCate(id: string, name: string) {
  return httpRequestWithMsg({
    url: "/pms/productAttribute/category/update/" + id,
    method: "put",
    params: { name },
  });
}
export function fetchListWithAttr() {
  return httpRequest<any,Array<ProductAttributeCategoryItemVo>>({
    url: "/pms/productAttribute/category/list/withAttr",
    method: "get",
  });
}
