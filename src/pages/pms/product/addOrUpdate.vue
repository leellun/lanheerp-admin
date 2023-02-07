<template>
    <div class="main-container">
        <a-steps :current="currentTag">
            <a-step title="填写商品信息" />
            <a-step title="填写商品促销" />
            <a-step title="填写商品属性" />
            <a-step title="选择商品关联" />
        </a-steps>
        <ProductInfoDetail v-model:value="productParam" :is-edit="isEdit" @nextStep="nextStep"
            v-if="currentTag === 0" />
        <ProductSaleDetail v-model:value="productParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep"
            v-if="currentTag === 1" />
        <ProductAttrDetail v-model:value="productParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep"
            v-if="currentTag === 2" />
        <ProductRelationDetail v-model:value="productParam" :is-edit="isEdit" @finishCommit="finishCommit"
            @prevStep="prevStep" v-if="currentTag === 3" />
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductAttrDetail from './modals/ProductAttrDetail.vue';
import ProductInfoDetail from './modals/ProductInfoDetail.vue';
import ProductRelationDetail from './modals/ProductRelationDetail.vue';
import ProductSaleDetail from './modals/ProductSaleDetail.vue';
import type { MemberPrice, PrefrenceAreaProductRelationDto, ProductAttributeValue, ProductAttrPic, ProductDto, ProductFullReduction, ProductLadder, SubjectProductRelationDto } from '@/api/pms/productApi'
import { SkuStock } from '@/api/pms/skuStockApi';
import { _createProduct, _updateProduct, _getProduct } from '@/api/pms/productApi'
import { Modal } from 'ant-design-vue';
import events from '@/utils/eventBus'
const productId = ref<string>('')
const productParam = ref<ProductDto | any>()
const resetProductParam = () => {
    productParam.value = {
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
    }
}
resetProductParam()
const router = useRouter()
const routeName = router.currentRoute.value.name
watch(() =>
    router.currentRoute.value,
    (route) => {
        if (route.name === routeName) {
            console.log(route.fullPath)
            if (route.query.id != undefined) {
                if (route.query.id != productParam.value.id) {
                    productParam.value.id = route.query.id
                    _getProduct(route.query.id as string).then(res => {
                        resetProductParam()
                        let data = res.data as any
                        Object.keys(data).forEach(key => {
                            if (data[key] != null) {
                                productParam.value[key] = data[key]
                            }
                        })
                    })
                }
            }
        }
    }, { immediate: true, deep: true })
const isEdit = computed(() => productId.value != '')
const showStatus = ref([true, false, false, false])
const currentTag = ref<number>(0)
const prevStep = () => {
    if (currentTag.value > 0 && currentTag.value < 4) {
        currentTag.value--;
    }
}
const nextStep = () => {
    console.log(productParam.value)
    if (currentTag.value < showStatus.value.length - 1) {
        currentTag.value++;
    }
}
const finishCommit = (isEdit: boolean) => {
    Modal.confirm({
        title: "提示",
        content: "是否要提交该产品",
        okText: "确定",
        type: "warning",
        cancelText: "取消",
        onOk: () => {
            if (isEdit) {
                _updateProduct(productId.value, productParam.value).then(res => {
                    events.emit("multiTab.close")
                });
            } else {
                _createProduct(productParam.value).then(res => {
                    events.emit("multiTab.close")
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