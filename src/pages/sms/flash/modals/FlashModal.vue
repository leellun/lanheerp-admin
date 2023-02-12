<template>
    <a-modal v-model:visible="modalVisible" :title="flashPromotion ? '编辑活动' : '添加活动'" @ok="handleOk"
        @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="活动标题：" v-bind="validateInfos.title">
                <a-input v-model:value="form.title" style="width: 250px"></a-input>
            </a-form-item>
            <a-form-item label="开始时间：" v-bind="validateInfos.startDate">
                <a-date-picker v-model:value="startDate" type="date" placeholder="请选择时间">
                </a-date-picker>
            </a-form-item>
            <a-form-item label="结束时间：" v-bind="validateInfos.endDate">
                <a-date-picker v-model:value="endDate" type="date" placeholder="请选择时间">
                </a-date-picker>
            </a-form-item>
            <a-form-item label="上线/下线" v-bind="validateInfos.status">
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="1">上线</a-radio>
                    <a-radio :value="0">下线</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form } from 'ant-design-vue';
import type { FlashPromotion } from '@/api/sms/flashApi'
import { _createFlash, _updateFlash } from '@/api/sms/flashApi'
import dayjs from 'dayjs';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    flashPromotion?: FlashPromotion
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
const form = reactive<Partial<FlashPromotion>>({
    title: undefined,
    startDate: undefined,
    endDate: undefined,
    status: 1
})
Object.assign(form, props.flashPromotion)
const startDate = computed({
    get() {
        if(form.startDate===undefined)return undefined
        return dayjs(form.startDate, "YYYY-MM-DD")
    }, set(newValue) {
        form.startDate = newValue!.format("YYYY-MM-DD")
    }
})
const endDate = computed({
    get() {
        if(form.endDate===undefined)return undefined
        return dayjs(form.endDate, "YYYY-MM-DD")
    }, set(newValue) {
        form.endDate = newValue!.format("YYYY-MM-DD")
    }
})
const rulesRef = reactive({
    title: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    startDate: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    endDate: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    status: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        if (props.flashPromotion) {
            _updateFlash(form.id, form as FlashPromotion).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _createFlash(form as FlashPromotion).then(res => {
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