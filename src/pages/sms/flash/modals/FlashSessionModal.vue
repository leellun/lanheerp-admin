<template>
    <a-modal v-model:visible="modalVisible" :title="flashPromotionSession ? '编辑时间段' : '添加时间段'" @ok="handleOk"
        @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="秒杀时间段名称：" v-bind="validateInfos.name">
                <a-input v-model:value="form.name" style="width: 250px"></a-input>
            </a-form-item>
            <a-form-item label="每日开始时间：" v-bind="validateInfos.startTime">
                <a-time-picker v-model:value="startTime" type="date" placeholder="请选择时间">
                </a-time-picker>
            </a-form-item>
            <a-form-item label="每日结束时间：" v-bind="validateInfos.endTime">
                <a-time-picker v-model:value="endTime" type="date" placeholder="请选择时间">
                </a-time-picker>
            </a-form-item>
            <a-form-item label="是否启用" v-bind="validateInfos.status">
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="0">禁用</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form } from 'ant-design-vue';
import {_createSession,_updateSession} from '@/api/sms/flashSessionApi';
import type {FlashPromotionSession} from '@/api/sms/flashSessionApi';
import dayjs from 'dayjs';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    flashPromotionSession?: FlashPromotionSession
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
const form = reactive<Partial<FlashPromotionSession>>({
    name: undefined,
    startTime: undefined,
    endTime: undefined,
    status: 1
})
Object.assign(form, props.flashPromotionSession)
const startTime = computed({
    get() {
        if(form.startTime===undefined)return undefined
        return dayjs(form.startTime, "HH:mm:ss")
    }, set(newValue) {
        form.startTime = newValue!.format("HH:mm:ss")
    }
})
const endTime = computed({
    get() {
        if(form.endTime===undefined)return undefined
        return dayjs(form.endTime, "HH:mm:ss")
    }, set(newValue) {
        form.endTime = newValue!.format("HH:mm:ss")
    }
})
const rulesRef = reactive({
    name: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    startTime: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    endTime: [{
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
        if (props.flashPromotionSession) {
            _updateSession(form.id, form as FlashPromotionSession).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _createSession(form as FlashPromotionSession).then(res => {
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