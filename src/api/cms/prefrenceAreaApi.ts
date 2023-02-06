import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "../types";
export interface PrefrenceArea {
    id: string //优选专区id
    name: string //优选专区名称
    subTitle: string //子标题
    pic: string //展示图片
    sort: number //排序
    showStatus: number //显示状态
}
export function _getPrefrenceAreaAll() {
    return httpRequest<any, Array<PrefrenceArea>>({
        url: '/cms/prefrenceArea/listAll',
        method: 'get',
    })
}