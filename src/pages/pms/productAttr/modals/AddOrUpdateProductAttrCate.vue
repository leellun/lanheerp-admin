<template>
    <a-modal v-model:visible="modalVisible" :title="id ? '编辑属性分类' : '新增属性分类'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.name">
                <a-input placeholder="请输入名称" v-model:value="form.name" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive,computed } from 'vue'
import { Form } from 'ant-design-vue';
import { _createProductAttrCate, _updateProductAttrCate } from '@/api/pms/productAttrCateApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: any,
    name?: string
}>(), {
    visible: false
})
const modalVisible = computed<boolean>({
    get(){
        return props.visible
    },
    set(val){
        emit("update:visible", val)
    }
})
const labelCol = {
    xs: { span: 24 },
    sm: { span: 5 },
}
const wrapperCol = {
    xs: { span: 24 },
    sm: { span: 16 },
}
const form = reactive<Partial<any>>({
    name: undefined
})
form.id=props.id
form.name=props.name
console.log(form)
const rulesRef = reactive({
    name: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        if (props.id) {
            _updateProductAttrCate(form.id, form.name).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _createProductAttrCate(form.name).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        }
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="less" scoped>

</style>