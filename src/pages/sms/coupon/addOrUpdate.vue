<template>
    <a-card>
        <a-form :model="coupon" size="small" :labelCol="{ style: { width: '100px' } }"
            style="max-width:800px;margin:0 auto">
            <a-form-item label="优惠券类型：">
                <a-select v-model:value="coupon.type">
                    <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">{{
                        item.label
                    }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="优惠券名称：" v-bind="validateInfos.name">
                <a-input v-model:value="coupon.name"></a-input>
            </a-form-item>
            <a-form-item label="适用平台：">
                <a-select v-model:value="coupon.platform">
                    <a-select-option v-for="item in platformOptions" :key="item.value" 
                        :value="item.value">{{item.label}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="总发行量：" v-bind="validateInfos.publishCount">
                <a-input-number v-model:value="coupon.publishCount" placeholder="只能输入正整数"></a-input-number>
            </a-form-item>
            <a-form-item label="面额：" v-bind="validateInfos.amount">
                <a-input-number v-model:value="coupon.amount" placeholder="面值只能是数值，限2位小数">
                    <template slot="append">元</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="每人限领：">
                <a-input-number v-model:value="coupon.perLimit" placeholder="只能输入正整数">
                    <template slot="append">张</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="使用门槛：" v-bind="validateInfos.minPoint">
                <a-input-number v-model:value="coupon.minPoint" placeholder="只能输入正整数">
                    <template slot="prepend">满</template>
                    <template slot="append">元可用</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="有效期：">
                <a-date-picker type="date" placeholder="选择日期" v-model:value="startTime"
                    style="width: 150px"></a-date-picker>
                <span style="margin-left: 20px;margin-right: 20px">至</span>
                <a-date-picker type="date" placeholder="选择日期" v-model:value="endTime"
                    style="width: 150px"></a-date-picker>
            </a-form-item>
            <a-form-item label="可使用商品：">
                <a-tabs v-model:activeKey="coupon.useType" type="card">
                    <a-tab-pane :key="0" tab="全场通用"> </a-tab-pane>
                    <a-tab-pane :key="1" tab="指定分类">
                        <a-tree-select v-model:value="selectProductCate" style="width:200px" placeholder="请选择..."
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="productCateOptions">
                        </a-tree-select>
                        <a-button @click="handleAddProductCategoryRelation()" style="margin-left:10px">添加</a-button>
                        <a-table :columns="cateColumns" :data-source="coupon.productCategoryRelationList"
                            style="width: 100%;margin-top: 20px" borderd>
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <a-button size="mini" type="text"
                                        @click="handleDeleteProductCateRelation(index, record)">删除
                                    </a-button></template>
                                    <template v-else-if="column.key === 'productCategoryName'">
                                    {{record.parentCategoryName}}>{{record.productCategoryName}}
                                    </template>
                            </template>
                        </a-table>
                    </a-tab-pane>
                    <a-tab-pane :key="2" tab="指定商品">
                        <a-select v-model:value="selectProduct" show-search placeholder="商品名称/商品货号" style="width: 80%"
                            :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                            :not-found-content="null" @search="searchProductMethod" @change="handleChange">
                            <a-select-option v-for="item in selectProductOptions" :key="item.productId"
                                :value="item.productId">
                                <div class="product-option">
                                    <p class="product">{{ item.productName }}</p>
                                    <p>NO.{{ item.productSn }}</p>
                                </div>
                            </a-select-option>
                        </a-select>
                        <a-button @click="handleAddProductRelation" style="margin-left:10px">添加</a-button>
                        <a-table :columns="productColumns" :data-source="coupon.productRelationList"
                            style="width: 100%;margin-top: 20px" borderd>
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <a-button size="small" type="text"
                                        @click="handleDeleteProductRelation(index, record)">删除
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                    </a-tab-pane>
                </a-tabs>
            </a-form-item>
            <a-form-item label="备注：">
                <a-input type="textarea" :rows="5" placeholder="请输入内容" v-model:value="coupon.note">
                </a-input>
            </a-form-item>
            <a-form-item style="text-align:center">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button v-if="couponId === undefined" @click="resetForm" style="margin-left:15px">重置</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>
<script setup lang="ts">
import { reactive, ref,computed } from 'vue'
import type { CouponDto, CouponProductCategoryRelation } from '@/api/sms/couponApi';
import { _createCoupon, _getCoupon, _updateCoupon } from '@/api/sms/couponApi';
import { _getProductSimpleList } from '@/api/pms/productApi';
import { _fetchListWithChildren } from '@/api/pms/productCateApi'
import { Form, message, TreeSelectProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs'
const useForm = Form.useForm
const router = useRouter()
const couponId = router.currentRoute.value.query.id
const coupon = reactive<Partial<CouponDto>>({
    type: 0,
    name: undefined,
    platform: 0,
    amount: undefined,
    perLimit: 1,
    minPoint: undefined,
    startTime: undefined,
    endTime: undefined,
    useType: 0,
    note: undefined,
    publishCount: undefined,
    productRelationList: [],
    productCategoryRelationList: []
})
const startTime = computed({
    get() {
        if(coupon.startTime===undefined)return undefined
        return dayjs(coupon.startTime, "YYYY-MM-DD")
    }, set(newValue) {
        coupon.startTime = newValue!.format("YYYY-MM-DD")
    }
})
const endTime = computed({
    get() {
        if(coupon.endTime===undefined)return undefined
        return dayjs(coupon.endTime, "YYYY-MM-DD")
    }, set(newValue) {
        coupon.endTime = newValue!.format("YYYY-MM-DD")
    }
})
const typeOptions = [{ label: '全场赠券', value: 0 }, { label: '会员赠券', value: 1 }, { label: '购物赠券', value: 2 }, { label: '注册赠券', value: 3 }];
const platformOptions = [{ label: '全平台', value: 0 }, { label: '移动平台', value: 1 }, { label: 'PC平台', value: 2 }];
const selectProductOptions = ref<Array<any>>([])
const selectProduct = ref<any>()
const selectProductCate = ref<any>()
const productCategoryOptions = ref<Array<any>>([])
//商品属性分类下拉选项
const productCateOptions = ref<TreeSelectProps['treeData']>([]);
const cateColumns = [
    { title: '分类名称', key: 'productCategoryName', dataIndex: 'productCategoryName', width: 100 },
    { title: '操作', key: 'action', width: 100 },
]
const productColumns = [
    { title: '商品名称', key: 'productName', dataIndex: 'productName', width: 150 },
    { title: '货号', key: 'productSn', dataIndex: 'productSn', width: 100 },
    { title: '操作', key: 'action', width: 100 },
]
const getProductCateList = () => {
    _fetchListWithChildren().then(res => {
        let list = res.data;
        productCateOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
                for (let j = 0; j < list[i].children.length; j++) {
                    children.push({ title: list[i].children[j].name, key: list[i].children[j].id, value: list[i].children[j].id });
                }
            }
            productCateOptions.value.push({ title: list[i].name, key: list[i].id, value: list[i].id, children: children, selectable: children.length === 0 });
        }
    });
}
const rulesRef = reactive({
    name: [
        { required: true, message: '请输入优惠券名称', trigger: 'blur' },
        { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
    ],
    publishCount: [
        { type: 'number', required: true, message: '只能输入正整数', trigger: 'blur' }
    ],
    amount: [
        { type: 'number', required: true, message: '面值只能是数值，0.01-10000，限2位小数', trigger: 'blur' }
    ],
    minPoint: [
        { type: 'number', required: true, message: '只能输入正整数', trigger: 'blur' }
    ]
})
const { validate, validateInfos, resetFields } = useForm(coupon, rulesRef)
const onSubmit = () => {
    validate().then(() => {
        if (couponId != undefined) {
            _updateCoupon(couponId, coupon as any).then(res => {
                router.push({ name: 'coupon' })
            });
        } else {
            _createCoupon(coupon as any).then(res => {
                router.push({ name: 'coupon' })
            });
        }
    })
}
const resetForm = () => {
    resetFields();
}
const searchProductMethod = (keyword: string) => {
    if (keyword !== '') {
        _getProductSimpleList(keyword).then(response => {
            let productList = response.data;
            selectProductOptions.value = [];
            for (let i = 0; i < productList.length; i++) {
                let item = productList[i];
                selectProductOptions.value.push({ productId: item.id, productName: item.name, productSn: item.productSn });
            }
        });
    } else {
        selectProductOptions.value = [];
    }
}
const handleChange = (keyword: string) => {
}
const getProductById = (id: any) => {
    for (let i = 0; i < selectProductOptions.value.length; i++) {
        if (id === selectProductOptions.value[i].productId) {
            return selectProductOptions.value[i];
        }
    }
    return null;
}
const handleAddProductRelation = () => {
    if (selectProduct === undefined) {
        message.warning('请先选择商品')
        return
    }
    if (coupon.productRelationList === undefined) {
        coupon.productRelationList = []
    }
    coupon.productRelationList.push(getProductById(selectProduct.value));
    selectProduct.value = undefined;
}
const handleDeleteProductRelation = (index: number, row: any) => {
    coupon?.productRelationList?.splice(index, 1);
}
const getProductCateByIds = (id: any) => {
    let name;
    let parentName;
    console.log(productCategoryOptions.value)
    if (productCateOptions.value === undefined) return {};
    const options = productCateOptions.value as any
    out: for (let i = 0; i < options.length; i++) {
        parentName = options[i].title;
        for (let j = 0; j < options[i].children.length; j++) {
            if (options[i].children[j].value === id) {
                name = options[i].children[j].title;
                break out
            }
        }
    }
    return { productCategoryId: id, productCategoryName: name, parentCategoryName: parentName };
}
const handleAddProductCategoryRelation = () => {
    if (selectProductCate.value === undefined) {
        message.warning('请先选择商品分类')
        return
    }
    coupon?.productCategoryRelationList?.push(getProductCateByIds(selectProductCate.value) as CouponProductCategoryRelation);
    selectProductCate.value = undefined;
}
const handleDeleteProductCateRelation = (index: number, row: any) => {
    coupon?.productCategoryRelationList?.splice(index, 1);
}
if (couponId != undefined) {
    _getCoupon(couponId).then(res => {
        Object.assign(coupon, res.data)
        if (coupon.startTime === null) {
            coupon.startTime = undefined
        }
        if (coupon.endTime === null) {
            coupon.endTime = undefined
        }
    });
}
getProductCateList()
</script>
<style lang='less' scoped>
.product-option {
    display: flex;

    .product {
        width: 100%
    }
}
</style>


