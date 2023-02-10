import { httpRequest, httpRequestWithMsg } from "@/utils/request";
export interface CompanyAddress{
  id:any
  addressName:string
  sendStatus:number
  receiveStatus:number
  name:string
  phone:string
  province:string
  city:string
  region:string
  detailAddress:string
}
export function _getCompanyAddresList() {
  return httpRequest<any,Array<CompanyAddress>>({
    url:'/oms/companyAddress/list',
    method:'get'
  })
}
