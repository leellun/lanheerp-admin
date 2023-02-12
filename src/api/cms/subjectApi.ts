import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page,PageSearch } from "../types";
export interface Subject {
    id: string //专题id
    categoryId: string //分类id
    categoryName: string  //专题分类名称
    title: string //标题
    pic: string //专题主图
    productCount: number //关联产品数量
    recommendStatus: number //推荐状态
    createTime: string
    collectCount: number //收藏数
    readCount: number //阅读数
    commentCount: number //评论数
    albumPics: string //画册图片用逗号分割
    showStatus: number //显示状态：0->不显示；1->显示
    description: string
    content: string
    forwardCount: number //转发数
}
export interface SubjectParam extends PageSearch {
    keyword?: string
}
export function _getSubjectAll() {
    return httpRequest<any, Array<Subject>>({
        url: '/cms/subject/listAll',
        method: 'get',
    })
}

export function _getPageSubjects(params: SubjectParam) {
    return httpRequest<any, Page<Subject>>({
        url: '/cms/subject/list',
        method: 'get',
        params: params
    })
}