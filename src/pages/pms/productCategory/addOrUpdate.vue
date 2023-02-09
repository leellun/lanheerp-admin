<template>
    <a-card class="form-container" shadow="never">
        <a-form :model="form" :labelCol="{ style: { width: '150px' } }">
            <a-form-item label="分类名称：">
                <a-input v-model:value="form.name"></a-input>
            </a-form-item>
            <a-form-item label="上级分类：">
                <a-select v-model:value="form.parentId" placeholder="请选择分类" style="width: 300px">
                    <a-select-option v-for="item in selectProductCateList" :key="item.id" :value="item.id">{{
                        item.name
                    }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="数量单位：">
                <a-input v-model:value="form.productUnit"></a-input>
            </a-form-item>
            <a-form-item label="排序：">
                <a-input v-model:value="form.sort"></a-input>
            </a-form-item>
            <a-form-item label="是否显示：">
                <a-radio-group v-model:value="form.showStatus">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="是否显示在导航栏：">
                <a-radio-group v-model:value="form.navStatus">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="分类图标：">
                <single-upload v-model:value="form.icon"></single-upload>
            </a-form-item>
            <a-form-item v-for="(filterProductAttr, index) in filterProductAttrList" :label="index === 0 ? '筛选属性' : ''"
                :style="{ 'margin-left': (index === 0 ? '0px' : '150px') }" :key="filterProductAttr.key">
                <a-tree-select v-model:value="filterProductAttr.value" style="width: 300px" placeholder="请选择..."
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="filterAttrs">
                </a-tree-select>
                <a-button style="margin-left: 20px" @click.prevent="removeFilterAttr(filterProductAttr)">删除</a-button>
            </a-form-item>
            <a-form-item>
                <a-button style="margin-left:150px" size="small" type="primary"
                    @click="handleAddFilterAttr()">新增</a-button>
            </a-form-item>
            <a-form-item label="关键词：">
                <a-input v-model:value="form.keywords"></a-input>
            </a-form-item>
            <a-form-item label="分类描述：">
                <a-input type="textarea" :autosize="true" v-model:value="form.description"></a-input>
            </a-form-item>
            <a-form-item style="text-align:center">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button v-if="categoryId != undefined" @click="resetForm" style="margin-left:15px">重置</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getPageProductCategorys, _createProductCate, _updateProductCate, _getProductCate } from '@/api/pms/productCateApi';
import type { ProductCategoryDto } from '@/api/pms/productCateApi';
import { fetchListWithAttr } from '@/api/pms/productAttrCateApi';
import { _getProductAttrInfo } from '@/api/pms/productAttrApi';
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import { Form, message, Modal } from 'ant-design-vue';
import { cloneDeep } from "lodash";
const useForm = Form.useForm
const form = ref<Partial<ProductCategoryDto>>({
    description: '',
    icon: '',
    keywords: '',
    name: '',
    navStatus: 0,
    parentId: undefined,
    productUnit: '',
    showStatus: 0,
    sort: 0,
    productAttributeIdList: []
})
var defaultProductCate = cloneDeep(form.value)
const rulesRef = reactive({
    name: [
        { required: true, message: '请输入品牌名称', trigger: 'blur' },
        { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
    ]
})
const { validate, validateInfos, resetFields } = useForm(form, rulesRef)
const selectProductCateList = ref<Array<any>>([])
const filterAttrs = ref<Array<any>>([])
const filterProductAttrList = ref<Array<any>>([{ value: undefined }])
const categoryId = ref<any>()
const route = useRouter().currentRoute.value
const router = useRouter();
if (route.query != undefined) {
    categoryId.value = route.query.id
}
const getSelectProductCateList = () => {
    _getPageProductCategorys('0', { pageSize: 100, pageNo: 1 }).then(res => {
        selectProductCateList.value = res.data.records;
    });
}
const getProductAttrCateList = () => {
    fetchListWithAttr().then(response => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
            let productAttrCate = list[i];
            let children = [];
            if (productAttrCate.productAttributeList != undefined && productAttrCate.productAttributeList != null && productAttrCate.productAttributeList.length > 0) {
                for (let j = 0; j < productAttrCate.productAttributeList.length; j++) {
                    children.push({
                        label: productAttrCate.productAttributeList[j].name,
                        value: productAttrCate.productAttributeList[j].id,
                        parent: productAttrCate
                    })
                }
            }
            filterAttrs.value.push({ label: productAttrCate.name, value: productAttrCate.id, children: children, selectable: false });
        }
    });
}
const getProductAttributeIdList = () => {
    //获取选中的筛选商品属性
    let productAttributeIdList: Array<any> = [];
    for (let i = 0; i < filterProductAttrList.value.length; i++) {
        let item = filterProductAttrList.value[i];
        if (item.value !== null && item.value != undefined) {
            productAttributeIdList.push(item.value);
        }
    }
    return productAttributeIdList;
}
const removeFilterAttr = (productAttributeId: any) => {
    if (filterProductAttrList.value.length === 1) {
        message.warning('至少要留一个')
        return;
    }
    var index = filterProductAttrList.value.indexOf(productAttributeId);
    if (index !== -1) {
        filterProductAttrList.value.splice(index, 1)
    }
}
const handleAddFilterAttr = () => {
    if (filterProductAttrList.value.length === 3) {
        message.warning('最多添加三个')
        return;
    }
    filterProductAttrList.value.push({
        value: null,
        key: Date.now()
    });
}
if (categoryId.value != undefined) {
    _getProductCate(categoryId.value).then(res => {
        form.value = res.data as any;
        defaultProductCate = cloneDeep(form.value)
    })
    _getProductAttrInfo(categoryId.value).then(res => {
        if (res.data != null && res.data.length > 0) {
            filterProductAttrList.value = [];
            for (let i = 0; i < res.data.length; i++) {
                filterProductAttrList.value.push({
                    key: Date.now() + i,
                    value: res.data[i].attributeId
                })
            }
        }
    });
}
const resetForm = () => {
    form.value = cloneDeep(defaultProductCate) as any
}
const onSubmit = () => {
    validate().then(() => {
        Modal.confirm({
            title: "提示",
            content: "是否提交数据",
            okText: "确定",
            cancelText: "取消",
            type: 'warning',
            onOk: () => {
                form.value.productAttributeIdList = getProductAttributeIdList();
                if (categoryId.value != undefined) {
                    _updateProductCate(categoryId.value, form.value as ProductCategoryDto).then(res => {
                        resetFields()
                        router.push({ name: 'productCategory' })
                    });
                } else {
                    _createProductCate(form.value as ProductCategoryDto).then(res => {
                        router.push({ name: 'productCategory' })
                    });
                }
            },
        });
    })
}
getSelectProductCateList()
getProductAttrCateList()
</script>

<style scoped>

</style>
