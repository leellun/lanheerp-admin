<template>
    <a-modal v-model:visible="modalVisible" title="发送站内信" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form" ref="receiverInfoForm" >
            <a-form-item label="标题：" v-bind="validateInfos.title">
                <a-input v-model:value="form.title" style="width: 200px"></a-input>
            </a-form-item>
            <a-form-item label="内容：" v-bind="validateInfos.content">
                <a-textarea placeholder="请输入备注" v-model:value="form.content" :autoSize="{ minRows: 3, maxRows: 3 }" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form, message } from 'ant-design-vue';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
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
const form = reactive<Partial<any>>({
    title: undefined,
    content:undefined
})
const rulesRef = reactive({
    title: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    content: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        message.success("发送成功")
        emit("update:visible", false)
        emit("ok", false)
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="less" scoped>

</style>