<template>
    <a-modal v-model:visible="modalVisible" :title="form.id != undefined ? '修改退货原因' : '添加退货原因'" @ok="handleOk"
        @cancel="handleCancel">
        <a-form :model="form" :labelCol="{ style: { width: '100px' } }">
            <a-form-item label="原因类型：">
                <a-input v-model:value="form.name" class="input-width"></a-input>
            </a-form-item>
            <a-form-item label="排序：">
                <a-input v-model:value="form.sort" class="input-width"></a-input>
            </a-form-item>
            <a-form-item label="是否启用：">
                <a-switch v-model:checked="statusValue"> </a-switch>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form } from 'ant-design-vue';
import type { OrderReturnReason } from '@/api/oms/returnReasonApi'
import { _addReason, _updateReason } from '@/api/oms/returnReasonApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    reason?: OrderReturnReason
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
const statusValue = computed({
    get() {
        return form.status === 1
    },
    set(newValue) {
        form.status = (newValue ? 1 : 0)
    }
})
const form = reactive<Partial<OrderReturnReason>>({
    name: undefined,
    sort: 0,
    status: 1
})
if (props.reason != undefined) {
    Object.assign(form, props.reason)
}
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
        if (form.id!=undefined) {
            _updateReason(form.id, form as OrderReturnReason).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addReason(form as OrderReturnReason).then(res => {
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