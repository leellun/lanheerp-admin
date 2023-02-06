import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page } from "../types";
export interface ProductAttributeSearchDto {
  pageNum: number;
  pageSize: number;
  type: number;
}
export interface ProductAttributeDto {
  productAttributeCategoryId: string;
  name: string;
  selectType: number;
  inputType: number;
  inputList: string;
  sort: number;
  filterType: number;
  searchType: number;
  relatedStatus: number;
  handAddStatus: number;
  type: number;
}
export interface ProductAttribute {
  id: string;
  productAttributeCategoryId: string;
  name: string;
  selectType: number;
  inputType: number;
  inputList: string;
  sort: number;
  filterType: number;
  searchType: number;
  relatedStatus: number;
  handAddStatus: number;
  type: number;
  hasPic: number;
}

export interface ProductAttrInfoVo extends ProductAttribute {
  attributeId: string;
  attributeCategoryId: string;
}
export const fetchList = (cid: string, params: ProductAttributeSearchDto) => {
  return httpRequest<any, Page<ProductAttribute>>({
    url: `/pms/productAttribute/list/${cid}`,
    method: "get",
    params: params,
  });
};
export const _getProductCateAttribute = (cid: string,type:number) => {
  return httpRequest<any, Array<ProductAttribute>>({
    url: `/pms/productAttribute/all/${cid}`,
    method: "get",
    params:{
      type
    }
  });
};

export const deleteProductAttr = (data: Array<string>) => {
  return httpRequestWithMsg<any, any>({
    url: "/pms/productAttribute/delete",
    method: "delete",
    data: data,
  });
};

export const createProductAttr = (data: ProductAttributeDto) => {
  return httpRequestWithMsg<any, any>({
    url: "/pms/productAttribute/create",
    method: "post",
    data: data,
  });
};

export const updateProductAttr = (id: string, data: ProductAttributeDto) => {
  return httpRequestWithMsg<any, any>({
    url: `/pms/productAttribute/update/${id}`,
    method: "put",
    data: data,
  });
};
export const getProductAttr = (id: string) => {
  return httpRequest<any, ProductAttribute>({
    url: `/pms/productAttribute/${id}`,
    method: "get",
  });
};

export const getProductAttrInfo = (productCategoryId: string) => {
  return httpRequest<any, ProductAttrInfoVo>({
    url: `/pms/productAttribute/attrInfo/${productCategoryId}`,
    method: "get",
  });
};
