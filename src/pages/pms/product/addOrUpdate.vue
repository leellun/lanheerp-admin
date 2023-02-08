<template>
    <div class="main-container">
        <a-steps :current="currentTag">
            <a-step title="填写商品信息" />
            <a-step title="填写商品促销" />
            <a-step title="填写商品属性" />
            <a-step title="选择商品关联" />
        </a-steps>
        <ProductInfoDetail v-model:value="productParam" @nextStep="nextStep" v-show="currentTag === 0"
            v-if="showStatus" />
        <ProductSaleDetail v-model:value="productParam" @nextStep="nextStep" @prevStep="prevStep"
            v-show="currentTag === 1" v-if="showStatus" />
        <ProductAttrDetail v-model:value="productParam" @nextStep="nextStep" @prevStep="prevStep"
            v-show="currentTag === 2" v-if="showStatus" />
        <ProductRelationDetail v-model:value="productParam" @finishCommit="finishCommit" @prevStep="prevStep"
            v-show="currentTag === 3" v-if="showStatus" />
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { Router, useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router'
import ProductAttrDetail from './modals/ProductAttrDetail.vue';
import ProductInfoDetail from './modals/ProductInfoDetail.vue';
import ProductRelationDetail from './modals/ProductRelationDetail.vue';
import ProductSaleDetail from './modals/ProductSaleDetail.vue';
import type { MemberPrice, PrefrenceAreaProductRelationDto, ProductAttributeValue, ProductAttrPic, ProductDto, ProductFullReduction, ProductLadder, SubjectProductRelationDto } from '@/api/pms/productApi'
import { SkuStock } from '@/api/pms/skuStockApi';
import { _createProduct, _updateProduct, _getProduct } from '@/api/pms/productApi'
import { Modal } from 'ant-design-vue';
import { cloneDeep } from "lodash";
const productParam = ref<ProductDto | any>({
    productLadderList: [],//商品阶梯价格
    productFullReductionList: [], //商品满减价格
    memberPriceList: new Array<MemberPrice>(),//商品会员价格
    skuStockList: new Array<SkuStock | any>(), //商品的sku库存信息
    productAttributeValueList: new Array<ProductAttributeValue>(),//商品参数及自定义规格属性
    subjectProductRelationList: new Array<SubjectProductRelationDto>(),//专题和商品关系
    prefrenceAreaProductRelationList: new Array<PrefrenceAreaProductRelationDto>(), //优选专区和商品的关系
    productAttrPics: new Array<ProductAttrPic>(), //属性图片
    id: undefined,
    brandId: undefined,
    productCategoryId: undefined,
    feightTemplateId: undefined,
    productAttributeCategoryId: undefined,
    name: undefined,
    pic: null,
    productSn: undefined,
    publishStatus: undefined,
    newStatus: undefined,
    recommendStatus: undefined,
    verifyStatus: undefined,
    sort: undefined,
    sale: undefined,
    price: undefined,
    promotionPrice: undefined,
    giftGrowth: undefined,
    giftPoint: undefined,
    usePointLimit: undefined,
    originalPrice: undefined,
    subTitle: undefined,
    description: undefined,
    serviceIds: undefined,
    keywords: undefined,
    note: undefined,
    unit: undefined,
    albumPics: null,
    detailTitle: undefined,
    detailDesc: undefined,
    detailHtml: undefined,
    detailMobileHtml: undefined,
    promotionStartTime: undefined,
    brandName: undefined,
    productCategoryName: undefined,
    stock: undefined,
    lowStock: undefined,
    weight: undefined,
    previewStatus: undefined,
    promotionPerLimit: undefined,
    promotionType: undefined
})
const resetProductParam = () => {
    Object.keys(productParam.value).forEach(key => {
        if (productParam.value[key] != undefined) {
            if (typeof productParam.value[key] !== 'object') {
                productParam.value[key] = undefined
            }
        }
    })
    productParam.value.productLadderList.splice(0, productParam.value.productLadderList.length)
    productParam.value.productFullReductionList.splice(0, productParam.value.productFullReductionList.length)
    productParam.value.memberPriceList.splice(0, productParam.value.memberPriceList.length)
    productParam.value.skuStockList.splice(0, productParam.value.skuStockList.length)
    productParam.value.productAttributeValueList.splice(0, productParam.value.productAttributeValueList.length)
    productParam.value.subjectProductRelationList.splice(0, productParam.value.subjectProductRelationList.length)
    productParam.value.prefrenceAreaProductRelationList.splice(0, productParam.value.prefrenceAreaProductRelationList.length)
    productParam.value.productAttrPics.splice(0, productParam.value.productAttrPics.length)
}
const restoreProductParam = (route: RouteLocationNormalizedLoaded) => {
    let key = `${route.query.id === undefined ? 0 : route.query.id}`
    if (pageParams[key] != undefined) {
        currentTag.value = pageTabs[key]
        Object.keys(pageParams[key]).forEach(k => {
            productParam.value[k] = pageParams[key][k]
        })
        return true
    } else {
        currentTag.value = 0
        resetProductParam()
        return false
    }
}
const router = useRouter()
if (router.currentRoute.value.name === 'updateProduct' && router.currentRoute.value.query.id === undefined) {
    router.push({ name: 'product', params: { closepath: router.currentRoute.value.fullPath } })
}
const currentTag = ref<number>(0)
const showStatus = ref<boolean>(true)
const pageParams: any = {}
const pageTabs: any = {}
watch(() =>
    router.currentRoute.value,
    (route) => {
        if (route.name === 'updateProduct'||route.name === 'addProduct') {
            console.log(showStatus.value+":"+currentTag.value)
            pageParams[`${productParam.value.id === undefined ? 0 : productParam.value.id}`] = cloneDeep(productParam.value)
            pageTabs[`${productParam.value.id === undefined ? 0 : productParam.value.id}`] = currentTag.value
            showStatus.value = false
            if (route.query.id != undefined) {
                if (route.query.id != `${productParam.value.id}`) {
                    if (restoreProductParam(route)) {
                        showStatus.value = true
                        return;
                    }
                    productParam.value.id = route.query.id
                    _getProduct(route.query.id as string).then(res => {
                        let data = res.data as any
                        Object.keys(data).forEach(key => {
                            if (data[key] != null) {
                                productParam.value[key] = data[key]
                            }
                        })
                    })
                }
            } else {
                restoreProductParam(route)
            }
            showStatus.value = true
        }
    }, { immediate: true, deep: true })
const prevStep = () => {
    if (currentTag.value > 0 && currentTag.value < 4) {
        currentTag.value--;
    }
}
const nextStep = () => {
    if (currentTag.value < 4) {
        currentTag.value++;
    }
}
const finishCommit = () => {
    Modal.confirm({
        title: "提示",
        content: "是否要提交该产品",
        okText: "确定",
        type: "warning",
        cancelText: "取消",
        onOk: () => {
            if (productParam.value.id != '' && productParam.value.id != undefined && productParam.value.id != null) {
                _updateProduct(productParam.value.id, productParam.value).then(res => {
                    router.push({ name: 'product', params: { closepath: router.currentRoute.value.fullPath } })
                });
            } else {
                _createProduct(productParam.value).then(res => {
                    router.push({ name: 'product', params: { closepath: router.currentRoute.value.fullPath } })
                });
            }
        },
    });
}
</script>
<style lang="less">
.main-container>.ant-steps {
    margin-bottom: 30px;
    max-width: 750px;
}
</style>