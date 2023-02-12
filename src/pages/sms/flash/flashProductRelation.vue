<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>添加</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                    {{ record.product.name }}
                </template>
                <template v-else-if="column.key === 'productSn'">
                    {{ record.product.productSn }}
                </template>
                <template v-else-if="column.key === 'price'">
                    {{ record.product.price }}
                </template>
                <template v-else-if="column.key === 'stock'">
                    {{ record.product.stock }}
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleUpdate(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否" @confirm="() => handleDelete(record)">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <FlashProductRelationModal v-model:visible="modalVisible" v-if="modalVisible"
            :flashPromotionProduct="flashPromotionProduct" @ok="handleOk" />
        <FlashProductSelectModal v-model:visible="productModalVisible" v-if="productModalVisible"
            :flashPromotionId="formRef.flashPromotionId" :flashPromotionSessionId="formRef.flashPromotionSessionId"
            @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FlashPromotionProductVo, FlashPromotionProductRelationSearch } from '@/api/sms/flashProductRelationApi'
import { _getFlashPromotionProductRelationPage, _deleteFlashProductRelation } from '@/api/sms/flashProductRelationApi'
import FlashProductRelationModal from './modals/FlashProductRelationModal.vue';
import FlashProductSelectModal from './modals/FlashProductSelectModal.vue';
const router = useRouter()
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const selectedRowKeys = ref<string[]>([]);
const flashPromotionProduct = ref<FlashPromotionProductVo>()

const modalVisible = ref<boolean>(false)
const productModalVisible = ref<boolean>(false)
const data = ref<Array<FlashPromotionProductVo | any>>([]);
const formRef = reactive<Partial<FlashPromotionProductRelationSearch>>({
    pageNo: 1,
    pageSize: 10,
})
formRef.flashPromotionId = router.currentRoute.value.query.flashPromotionId
formRef.flashPromotionSessionId = router.currentRoute.value.query.flashPromotionSessionId
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 100 },
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '货号', dataIndex: 'productSn', key: 'productSn', width: 100 },
    { title: '商品价格', dataIndex: 'price', key: 'price', width: 100 },
    { title: '剩余数量', dataIndex: 'stock', key: 'stock', width: 100 },
    { title: '秒杀价格', dataIndex: 'flashPromotionPrice', key: 'flashPromotionPrice', width: 100 },
    { title: '秒杀数量', dataIndex: 'flashPromotionCount', key: 'flashPromotionCount', width: 100 },
    { title: '限购数量', dataIndex: 'flashPromotionLimit', key: 'flashPromotionLimit', width: 100 },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 100 },
    { title: '操作', fixed: 'right', width: 180, key: 'action' }
];
const loading = ref<boolean>(false)
const handleUpdate = (row: FlashPromotionProductVo) => {
    flashPromotionProduct.value = Object.assign({}, row);
    modalVisible.value = true;
}

const handleDelete = (row: FlashPromotionProductVo) => {
    _deleteFlashProductRelation(row.id).then(res => {
        handleSearch()
    });
}

const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getFlashPromotionProductRelationPage(formRef as FlashPromotionProductRelationSearch).then(res => {
        pagination.current = res.data.current
        pagination.pageSize = res.data.size
        pagination.total = res.data.total
        data.value = res.data.records
    }).finally(() => {
        loading.value = false
    })
}
const onSelectChange = (keys: string[]) => {
    selectedRowKeys.value = keys;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageLists()
}
const handleTableChange = (page: any, filters: any, sorter: any) => {
    formRef.pageNo = page.current
    getPageLists();
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    productModalVisible.value = true
}
const handleOk = () => {
    handleSearch()
}

handleSearch()
</script>
<style lang="less" scoped>

</style>