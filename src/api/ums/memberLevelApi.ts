import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "../types";
export interface MemberLevel {
  id: string //会员等级id
  name: string //会员等级名称
  growthPoint: number //增长点
  defaultStatus: number //是否为默认等级：0->不是；1->是
  freeFreightPoint: number //免运费标准
  commentGrowthPoint: number //每次评价获取的成长值
  priviledgeFreeFreight: number //是否有免邮特权
  priviledgeSignIn: number //是否有签到特权
  priviledgeComment: number //是否有评论获奖励特权
  priviledgePromotion: number //是否有专享活动特权
  priviledgeMemberPrice: number //是否有会员价格特权
  priviledgeBirthday: number //是否有生日特权
  note: string //备注
}
export function _getMemberLevels(defaultStatus: number) {
  return httpRequest<any, Array<MemberLevel>>({
    url: '/ums/memberLevel/list',
    method: 'get',
    params: { defaultStatus }
  })
}
export function _getAllMemberLevels() {
  return httpRequest<any, Array<MemberLevel>>({
    url: '/ums/memberLevel/all',
    method: 'get'
  })
}
