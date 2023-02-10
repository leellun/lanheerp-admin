<template>
    <a-modal v-model:visible="modalVisible" title="修改费用信息" @ok="handleOk" @cancel="handleCancel">
        <div class="table-layout">
            <a-row>
                <a-col :span="6" class="table-cell-title">商品合计</a-col>
                <a-col :span="6" class="table-cell-title">运费</a-col>
                <a-col :span="6" class="table-cell-title">优惠券</a-col>
                <a-col :span="6" class="table-cell-title">积分抵扣</a-col>
            </a-row>
            <a-row>
                <a-col :span="6" class="table-cell">￥{{ order.totalAmount }}</a-col>
                <a-col :span="6" class="table-cell">
                    <a-input v-model.number="moneyInfo.freightAmount"><template slot="prepend">￥</template></a-input>
                </a-col>
                <a-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</a-col>
                <a-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</a-col>
            </a-row>
            <a-row>
                <a-col :span="6" class="table-cell-title">活动优惠</a-col>
                <a-col :span="6" class="table-cell-title">折扣金额</a-col>
                <a-col :span="6" class="table-cell-title">订单总金额</a-col>
                <a-col :span="6" class="table-cell-title">应付款金额</a-col>
            </a-row>
            <a-row>
                <a-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</a-col>
                <a-col :span="6" class="table-cell">
                    <a-input v-model.number="moneyInfo.discountAmount"><template slot="prepend">-￥</template></a-input>
                </a-col>
                <a-col :span="6" class="table-cell">
                    <span class="color-danger">￥{{ order.totalAmount + moneyInfo.freightAmount }}</span>
                </a-col>
                <a-col :span="6" class="table-cell">
                    <span class="color-danger">￥{{
                        order.payAmount + moneyInfo.freightAmount - moneyInfo.discountAmount
                    }}</span>
                </a-col>
            </a-row>
        </div>
    </a-modal>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { _updateReceiverInfo, _updateMoneyInfo, _closeOrder, _updateOrderNote, _deleteOrder } from '@/api/oms/orderApi'
import type { Order, MoneyInfo } from '@/api/oms/orderApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    order: Order,
    moneyInfo: MoneyInfo
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
const handleOk = () => {
    _updateMoneyInfo(props.moneyInfo).then(res => {
        emit("update:visible", false)
        emit("ok")
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="less" scoped>

</style>