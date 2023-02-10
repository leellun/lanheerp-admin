<template>v-model:value=
    <a-modal v-model:visible="modalVisible" title="修改收货人信息" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form" label-width="150px">
            <a-form-item label="收货人姓名：" v-bind="validateInfos.receiverName">
                <a-input v-model:value="form.receiverName" style="width: 200px"></a-input>
            </a-form-item>
            <a-form-item label="手机号码：" v-bind="validateInfos.receiverPhone">
                <a-input v-model:value="form.receiverPhone" style="width: 200px">
                </a-input>
            </a-form-item>
            <a-form-item label="邮政编码：">
                <a-input v-model:value="form.receiverPostCode" style="width: 200px">
                </a-input>
            </a-form-item>
            <a-form-item label="所在区域：">
                <AreaSelect :province="form.receiverProvince" :city="form.receiverCity" :area="form.receiverRegion"
                    @selectRegion="onSelectRegion" />
            </a-form-item>
            <a-form-item label="详细地址：">
                <a-textarea placeholder="请输入备注" v-model:value="form.receiverDetailAddress"
                    :autoSize="{ minRows: 3, maxRows: 3 }" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form } from 'ant-design-vue';
import AreaSelect from '@/components/Area/AreaSelect.vue';
import { _updateReceiverInfo } from '@/api/oms/orderApi'
import type { ReceiverAddress } from '@/api/oms/orderApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    receiverAddress: ReceiverAddress
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
const form = reactive<Partial<ReceiverAddress>>({
    receiverName: undefined,
    receiverPhone: undefined,
    receiverPostCode: undefined,
    receiverDetailAddress: undefined,
    receiverProvince: undefined,
    receiverCity: undefined,
    receiverRegion: undefined,
})
Object.assign(form, props.receiverAddress);
const rulesRef = reactive({
    receiverName: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    receiverPhone: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const { validate, validateInfos } = useForm(form, rulesRef)
const onSelectRegion = (data: any) => {
    form.receiverProvince = data.province;
    form.receiverCity = data.city;
    form.receiverRegion = data.area;
}
const handleOk = () => {
    validate().then(async () => {
        _updateReceiverInfo(form as ReceiverAddress).then(res => {
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