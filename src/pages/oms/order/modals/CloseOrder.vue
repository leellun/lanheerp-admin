<template>
    <a-modal v-model:visible="modalVisible" title="关闭订单" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="操作备注：" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.note">
                <a-textarea placeholder="请输入备注" v-model:value="form.note" :autoSize="{ minRows: 4, maxRows: 4 }" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form } from 'ant-design-vue';
import { _getOrderDetail, _updateReceiverInfo, _updateMoneyInfo, _closeOrder, _updateOrderNote, _deleteOrder } from '@/api/oms/orderApi'
import type { CloseOrder } from '@/api/oms/orderApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    ids: any
}>(), {
    visible: false
})
const modalVisible = computed<boolean>({
    get() {
        return props.visible
    },
    set(val) {
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
const form = reactive<Partial<CloseOrder>>({
})
form.ids = props.ids
const rulesRef = reactive({
    note: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        _closeOrder(form as CloseOrder).then(res => {
            emit("update:visible", false)
            emit("ok")
        })
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="less" scoped>

</style>