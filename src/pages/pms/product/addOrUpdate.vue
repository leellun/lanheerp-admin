<template>
    <div class="main-container">
        <ProductInfoDetail v-model:value="productParam" :is-edit="false" />
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ProductAttrDetail from './modals/ProductAttrDetail.vue';
import ProductInfoDetail from './modals/ProductInfoDetail.vue';

import type { MemberPrice, PrefrenceAreaProductRelationDto, ProductAttributeValue, ProductAttrPic, ProductDto, ProductFullReduction, ProductLadder, SubjectProductRelationDto } from '@/api/pms/productApi'
import { SkuStock } from '@/api/pms/skuStockApi';
const productParam = ref<ProductDto>({
    productLadderList: new Array<ProductLadder>(),//商品阶梯价格
    productFullReductionList: new Array<ProductFullReduction>(), //商品满减价格
    memberPriceList: new Array<MemberPrice>(),//商品会员价格
    skuStockList: new Array<SkuStock | any>(), //商品的sku库存信息
    productAttributeValueList: new Array<ProductAttributeValue>(),//商品参数及自定义规格属性
    subjectProductRelationList: new Array<SubjectProductRelationDto>(),//专题和商品关系
    prefrenceAreaProductRelationList: new Array<PrefrenceAreaProductRelationDto>(), //优选专区和商品的关系
    productAttrPics: new Array<ProductAttrPic>() //属性图片
}) 
</script>
<style lang="less">

</style>