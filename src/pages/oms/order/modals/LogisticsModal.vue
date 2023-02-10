<template>
    <a-modal v-model:visible="modalVisible"  title="订单跟踪" @ok="handleOk" @cancel="handleCancel">
        <a-steps :current="6" direction="vertical">
            <a-step :title="item.name"  v-for="item in defaultLogisticsList" :key="item.name">
                <template #description>
                    <span>{{ item.time }}</span>
                </template>
            </a-step>
        </a-steps>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
const defaultLogisticsList = [
    { name: '订单已提交，等待付款', time: '2017-04-01 12:00:00 ' },
    { name: '订单付款成功', time: '2017-04-01 12:00:00 ' },
    { name: '在北京市进行下级地点扫描，等待付款', time: '2017-04-01 12:00:00 ' },
    { name: '在分拨中心广东深圳公司进行卸车扫描，等待付款', time: '2017-04-01 12:00:00 ' },
    { name: '在广东深圳公司进行发出扫描', time: '2017-04-01 12:00:00 ' },
    { name: '到达目的地网点广东深圳公司，快件将很快进行派送', time: '2017-04-01 12:00:00 ' },
    { name: '订单已签收，期待再次为您服务', time: '2017-04-01 12:00:00 ' }
];
const emit = defineEmits(["update:visible", "ok", "cancel"])
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
const handleOk = () => {
    emit("update:visible", false)
    emit("cancel")
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="less" scoped>

</style>