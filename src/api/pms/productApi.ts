import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "../types";
import type {SkuStock} from './skuStockApi'
export interface ProductSearchDto {
  pageNo: number;
  pageSize: number;
  publishStatus: number;
  verifyStatus: number;
  keyword: number;
  productSn: number;
  productCategoryId: number;
  brandId: number;
}
export interface Product {
  id: string;
  brandId: string;
  productCategoryId: string;
  feightTemplateId: string;
  productAttributeCategoryId: string;
  name: string;
  pic: string|null;
  productSn: string;
  publishStatus: number;
  newStatus: number;
  recommendStatus: number;
  verifyStatus: number;
  sort: number;
  sale: number;
  price: number;
  promotionPrice: number;
  giftGrowth: number;
  giftPoint: number;
  usePointLimit: number;
  originalPrice: number;
  subTitle: string;
  description: string;
  serviceIds: string;
  keywords: string;
  note: string;
  unit: string;
  albumPics: string|null;
  detailTitle: string;
  detailDesc: string;
  detailHtml: string;
  detailMobileHtml: string;
  promotionStartTime: string;
  promotionEndTime: string;
  brandName: string;
  productCategoryName: string;
  stock: number;
  lowStock: number;
  weight: number;
  previewStatus: number;
  promotionPerLimit: number;
  promotionType: number;
}
export interface ProductLadder{
  id:string
  productId:string //商品id
  count:number //满足的商品数量
  discount:number //折扣
  price:number //折后价格
}
export interface ProductFullReduction{
  id:string
  productId:string //商品id
  fullPrice:number //满减金额
  reducePrice:number //降低金额
}
export interface MemberPrice{
  id:string
  productId:string //商品id
  memberLevelId:string //会员等级id
  memberPrice:number //会员价格
  memberLevelName:string //会员等级名
}
export interface ProductAttributeValue{
  id?:string
  productId?:string //商品id
  productAttributeId:string //商品属性id
  value:string //手动添加规格或参数的值，参数单值，规格有多个时以逗号隔开
}
//主题
export interface SubjectProductRelationDto{
  id:string
  subjectId:string
  productId:string
}
//优选专区
export interface PrefrenceAreaProductRelationDto{
  id:string
  prefrenceAreaId:string
  productId:string
}
export interface ProductAttrPic{
  id: string;
  name:string;
  productId:string;
  productAttributeId:string;
  pic:string;
  value:string;
}
export interface ProductDto extends Product{
  productLadderList:Array<ProductLadder> //商品阶梯价格
  productFullReductionList:Array<ProductFullReduction> //商品满减价格
  memberPriceList:Array<MemberPrice> //商品会员价格
  skuStockList:Array<SkuStock> //商品的sku库存信息
  productAttributeValueList:Array<ProductAttributeValue> //商品参数及自定义规格属性
  subjectProductRelationList:Array<SubjectProductRelationDto> //专题和商品关系
  prefrenceAreaProductRelationList:Array<PrefrenceAreaProductRelationDto> //优选专区和商品的关系
  productAttrPics:Array<ProductAttrPic> //属性图片
}
export interface ProductDetailVo extends ProductDto{
  cateParentId:string //商品所选分类的父id
}
export const _productList = (params: ProductSearchDto) => {
  return httpRequest<any, Page<Product>>({
    url: `/pms/product/list`,
    method: "get",
    params,
  });
};
export const _getProductSimpleList = (keyword: string) => {
  return httpRequest<any,Array<Product>>({
    url: "/pms/product/simpleList",
    method: "get",
    params: {keyword},
  });
};

export const _updateDeleteStatus = (data: any) => {
  return httpRequestWithMsg({
    url: "/pms/product/update/deleteStatus",
    method: "put",
    data
  });
};

export const _updateNewStatus = (params: any) => {
  params["ids"]=params["ids"].join(",")
  return httpRequestWithMsg({
    url: "/pms/product/update/newStatus",
    method: "put",
    params: params,
  });
};

export const _updateRecommendStatus = (params: any) => {
  params["ids"]=params["ids"].join(",")
  return httpRequestWithMsg({
    url: "/pms/product/update/recommendStatus",
    method: "put",
    params: params,
  });
};

export const _updatePublishStatus = (params: any) => {
  params["ids"]=params["ids"].join(",")
  return httpRequestWithMsg({
    url: "/pms/product/update/publishStatus",
    method: "put",
    params,
  });
};

export const _createProduct = (data: ProductDto) => {
  return httpRequestWithMsg({
    url: "/pms/product/create",
    method: "post",
    data: data,
  });
};

export const _updateProduct = (id: string, data: ProductDto) => {
  return httpRequestWithMsg({
    url: "/pms/product/update/" + id,
    method: "put",
    data: data,
  });
};

export const _getProduct = (id: string) => {
  return httpRequest<any,ProductDetailVo>({
    url: "/pms/product/updateInfo/" + id,
    method: "get",
  });
};
