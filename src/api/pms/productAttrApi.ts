import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page,PageSearch } from "../types";
export interface ProductAttributeSearchDto extends PageSearch {
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
export const _getProductAttrPage = (cid: string, params: ProductAttributeSearchDto) => {
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

export const _deleteProductAttr = (data: Array<string>) => {
  return httpRequestWithMsg<any, any>({
    url: "/pms/productAttribute/delete",
    method: "delete",
    data: data,
  });
};

export const _createProductAttr = (data: ProductAttributeDto) => {
  return httpRequestWithMsg<any, any>({
    url: "/pms/productAttribute/create",
    method: "post",
    data: data,
  });
};

export const _updateProductAttr = (id: string, data: ProductAttributeDto) => {
  return httpRequestWithMsg<any, any>({
    url: `/pms/productAttribute/update/${id}`,
    method: "put",
    data: data,
  });
};
export const _getProductAttr = (id: string) => {
  return httpRequest<any, ProductAttribute>({
    url: `/pms/productAttribute/${id}`,
    method: "get",
  });
};

export const _getProductAttrInfo = (productCategoryId: string) => {
  return httpRequest<any, Array<ProductAttrInfoVo>>({
    url: `/pms/productAttribute/attrInfo/${productCategoryId}`,
    method: "get",
  });
};
