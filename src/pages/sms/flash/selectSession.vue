<template>
    <div class="main-container">
        <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading" :scroll="{ x: 280 }"
            borderd>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleShowRelation(record)">商品列表</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getSessionSelectList } from '@/api/sms/flashSessionApi';
import type { FlashPromotionSessionDetailVo } from '@/api/sms/flashSessionApi';
const router = useRouter()
const flashPromotionId = router.currentRoute.value.query.flashPromotionId
const data = ref<Array<FlashPromotionSessionDetailVo | any>>([]);
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 100 },
    { title: '秒杀时间段名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '每日开始时间', dataIndex: 'startTime', key: 'startTime', width: 100 },
    { title: '每日结束时间', dataIndex: 'endTime', key: 'endTime', width: 100 },
    { title: '商品数量', dataIndex: 'productCount', key: 'productCount', width: 100 },
    { title: '操作', fixed: 'right', width: 180, key: 'action' }
];
const loading = ref<boolean>(false)

const getPageLists = () => {
    loading.value = true
    _getSessionSelectList(flashPromotionId).then(res => {
        data.value = res.data
    }).finally(() => {
        loading.value = false
    })
}
const handleShowRelation = (row: FlashPromotionSessionDetailVo) => {
    router.push({
        name: 'flashProductRelation', query: { flashPromotionId: flashPromotionId, flashPromotionSessionId: row.id }
    })
}
getPageLists()
</script>
<style lang="less" scoped>

</style>