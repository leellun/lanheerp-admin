<template> 
    <a-card >
        <a-form :model="brand" :labelCol="{ style: { width: '150px' } }">
            <a-form-item label="品牌名称：" v-bind="validateInfos.name">
                <a-input v-model:value="brand.name"></a-input>
            </a-form-item>
            <a-form-item label="品牌首字母：">
                <a-input v-model:value="brand.firstLetter"></a-input>
            </a-form-item>
            <a-form-item label="品牌LOGO：" v-bind="validateInfos.logo">
                <single-upload v-model:value="brand.logo"></single-upload>
            </a-form-item>
            <a-form-item label="品牌专区大图：">
                <single-upload v-model:value="brand.bigPic"></single-upload>
            </a-form-item>
            <a-form-item label="品牌故事：">
                <a-input placeholder="请输入内容" type="textarea" v-model:value="brand.brandStory" :autosize="true"></a-input>
            </a-form-item>
            <a-form-item label="排序：" v-bind="validateInfos.sort">
                <a-input-number v-model:value="brand.sort"></a-input-number>
            </a-form-item>
            <a-form-item label="是否显示：">
                <a-radio-group v-model:value="brand.showStatus">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="品牌制造商：">
                <a-radio-group v-model:value="brand.factoryStatus">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item style="text-align:center">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button v-if="id===undefined" @click="resetForm" style="margin-left:15px">重置</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Brand, _createBrand, _getBrand, _updateBrand } from '@/api/pms/brandApi'
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import { cloneDeep } from "lodash";
import { Form } from 'ant-design-vue';
const useForm = Form.useForm
const router = useRouter()
const brand = reactive<Partial<Brand>>({
    bigPic: '',
    brandStory: '',
    factoryStatus: 0,
    firstLetter: '',
    logo: '',
    name: '',
    showStatus: 0,
    sort: 0
})
const id = router.currentRoute.value.query.id as string
const defaultBrand = cloneDeep(brand);
const rulesRef = reactive({
    name: [
        { required: true, message: '请输入品牌名称', trigger: 'blur' },
        { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
    ],
    logo: [
        { required: true, message: '请输入品牌logo', trigger: 'blur' }
    ],
    sort: [
        { type: 'number', message: '排序必须为数字' }
    ],
})
const { validate, validateInfos, resetFields } = useForm(brand, rulesRef)

const resetForm = () => {
    resetFields()
    Object.assign(brand, defaultBrand)
}
const onSubmit = () => {
    validate().then(() => {
        if (id === undefined) {
            _createBrand(brand as Brand).then(res => {
                router.push({ name: 'brand' })
            });
        } else {
            _updateBrand(id, brand as Brand).then(res => {
                router.push({ name: 'brand' })
            });
        }
    })
}
if (id) {
    _getBrand(id).then(res => {
        Object.assign(brand, res.data);
    });
} else {
    Object.assign(brand, defaultBrand);
}
</script>
<style>

</style>


