<template>
    <a-card>
        <a-form :model="form">
            <a-form-item label="属性名称：">
                <a-input v-model:value="form.name"></a-input>
            </a-form-item>
            <a-form-item label="商品类型：">
                <a-select v-model:value="form.productAttributeCategoryId" placeholder="请选择">
                    <a-select-option v-for="item in productAttrCateList" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="分类筛选样式:">
                <a-radio-group v-model:value="form.filterType">
                    <a-radio :value="0">普通</a-radio>
                    <a-radio :value="1">颜色</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="能否进行检索:">
                <a-radio-group v-model:value="form.searchType">
                    <a-radio :value="0">不需要检索</a-radio>
                    <a-radio :value="1">关键字检索</a-radio>
                    <a-radio :value="2">范围检索</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="商品属性关联:">
                <a-radio-group v-model:value="form.relatedStatus">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="属性是否可选:">
                <a-radio-group v-model:value="form.selectType">
                    <a-radio :value="0">唯一</a-radio>
                    <a-radio :value="1">单选</a-radio>
                    <a-radio :value="2">复选</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="属性值的录入方式:">
                <a-radio-group v-model:value="form.inputType">
                    <a-radio :value="0">手工录入</a-radio>
                    <a-radio :value="1">从下面列表中选择</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="属性值可选值列表:">
                <a-input :autosize="true" type="textarea" v-model:value="inputListFormat"></a-input>
            </a-form-item>
            <a-form-item label="是否支持手动新增:">
                <a-radio-group v-model:value="form.handAddStatus">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="排序属性：">
                <a-input v-model:value="form.sort"></a-input>
            </a-form-item>
            <a-form-item style="text-align:center">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button v-if="id === undefined" @click="resetForm" style="margin-left:15px">重置</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { _getPageAttributeCategory } from '@/api/pms/productAttrCateApi'
import { _createProductAttr, _getProductAttr, _updateProductAttr } from '@/api/pms/productAttrApi'
import type { ProductAttributeDto } from '@/api/pms/productAttrApi'
import type { ProductAttributeCategory } from '@/api/pms/productAttrCateApi'
import { cloneDeep } from "lodash";
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const useForm = Form.useForm
const form = reactive<ProductAttributeDto>({
    filterType: 0,
    handAddStatus: 0,
    inputList: '',
    inputType: 0,
    name: '',
    productAttributeCategoryId: undefined as any,
    relatedStatus: 0,
    searchType: 0,
    selectType: 0,
    sort: 0,
    type: 0
})
const inputListFormat = ref<string>('')
const productAttrCateList = ref<Array<ProductAttributeCategory>>([])
const defaultProductAttr = cloneDeep(form);
const rulesRef = reactive({
    name: [
        { required: true, message: '请输入属性名称', trigger: 'blur' },
        { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
    ]
})
const { validate, validateInfos, resetFields } = useForm(form, rulesRef)
const route = useRoute()
const id = route.query.id as any
const resetProductAttr = () => {
    Object.assign(form, defaultProductAttr);
    form.productAttributeCategoryId = Number(route.query.cid) as any;
    form.type = Number(route.query.type);
}
if (id != undefined) {
    _getProductAttr(id).then(res => {
        Object.assign(form, res.data);
        inputListFormat.value = form.inputList.replace(/,/g, '\n');
    });
} else {
    resetProductAttr()
}
watch(() => inputListFormat.value, (val) => {
    let newVal = val.replace(/\n/g, ',')
    form.inputList = newVal
})
const getCateList = () => {
    let listQuery = { pageNo: 1, pageSize: 100 };
    _getPageAttributeCategory(listQuery as any).then(res => {
        productAttrCateList.value = res.data.records;
    });
}
getCateList()
const onSubmit = () => {
    validate().then(() => {
        Modal.confirm({
            title: "提示",
            content: "是否提交数据",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                if (id != undefined) {
                    _updateProductAttr(id, form as any).then(res => {
                        resetForm()
                        router.push({
                            name: 'addProductAttr', query: {
                                cid: form.productAttributeCategoryId,
                                type: form.type
                            }
                        })
                    });
                } else {
                    _createProductAttr(form as any).then(res => {
                        resetForm()
                        router.push({
                            name: 'addProductAttr', query: {
                                cid: form.productAttributeCategoryId,
                                type: form.type
                            }
                        })
                    });
                }
            },
        });
    })
}
const resetForm = () => {
    resetFields();
    resetProductAttr();
}
</script>

<style scoped>

</style>
