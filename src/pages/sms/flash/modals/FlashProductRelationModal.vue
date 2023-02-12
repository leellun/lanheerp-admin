<template>
    <a-modal v-model:visible="modalVisible" title="编辑秒杀商品信息" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form" size="small">
            <a-form-item label="商品名称：">
                <span>{{ form?.product?.name }}</span>
            </a-form-item>
            <a-form-item label="货号：">
                <span>NO.{{ form?.product?.productSn }}</span>
            </a-form-item>
            <a-form-item label="商品价格：">
                <span>￥{{ form?.product?.price }}</span>
            </a-form-item>
            <a-form-item label="秒杀价格：">
                <a-input-number v-model:value="form.flashPromotionPrice" class="input-width">
                    <template slot="prepend">￥</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="剩余数量：">
                <span>{{ form?.product?.stock }}</span>
            </a-form-item>
            <a-form-item label="秒杀数量：">
                <a-input-number v-model:value="form.flashPromotionCount" class="input-width"></a-input-number>
            </a-form-item>
            <a-form-item label="限购数量：">
                <a-input-number v-model:value="form.flashPromotionLimit" class="input-width"></a-input-number>
            </a-form-item>
            <a-form-item label="排序：">
                <a-input-number v-model:value="form.sort" class="input-width"></a-input-number>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form } from 'ant-design-vue';
import type { FlashPromotionProductVo } from '@/api/sms/flashProductRelationApi'
import { _updateFlashProductRelation } from '@/api/sms/flashProductRelationApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    flashPromotionProduct?: FlashPromotionProductVo
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
const form = reactive<Partial<FlashPromotionProductVo>>({
})
Object.assign(form, props.flashPromotionProduct)
const rulesRef = reactive({
    flashPromotionPrice: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    flashPromotionCount: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    sort: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        _updateFlashProductRelation(form.id, form as any).then(res => {
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