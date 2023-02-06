import { httpRequest, httpRequestWithMsg } from "@/utils/request";
export interface SkuStock {
  id: string;
  productId: string; //商品id
  skuCode: string; //sku编码
  price: number; //价格
  stock: number; //库存
  lowStock: number; //预警库存
  pic: string; //展示图片
  sale: number; //销量
  promotionPrice: number; //单品促销价格
  lockStock: number; //锁定库存
  spData: string; //商品销售属性，json格式
}
export function fetchList(pid: string, keyword: string) {
  return httpRequest<any, Array<SkuStock>>({
    url: "/pms/skuStock/" + pid,
    method: "get",
    params: { keyword },
  });
}

export function update(pid: string, data: SkuStock) {
  return httpRequest({
    url: "/pms/skuStock/update/" + pid,
    method: "post",
    data: data,
  });
}
