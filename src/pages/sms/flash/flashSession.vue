<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>添加</a-button>

        </div>
        <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading" :scroll="{ x: 280 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                    <a-switch @change="handleStatusChange(record)" :active-value="1" :inactive-value="0"
                        :checked="record.status === 1">
                    </a-switch>
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
        <FlashSessionModal v-model:visible="modalVisible" v-if="modalVisible"
            :flash-promotion-session="flashPromotionSession" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getFlashSessionList, _updateFlashSessionStatus, _deleteSession, _createSession, _updateSession } from '@/api/sms/flashSessionApi';
import type { FlashPromotionSession } from '@/api/sms/flashSessionApi';
import { Modal } from 'ant-design-vue';
import FlashSessionModal from './modals/FlashSessionModal.vue';
const router = useRouter()
const modalVisible = ref<boolean>(false)
const flashPromotionSession = ref<FlashPromotionSession>()
const data = ref<Array<FlashPromotionSession | any>>([]);
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 100 },
    { title: '秒杀时间段名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '每日开始时间', dataIndex: 'startTime', key: 'startTime', width: 100 },
    { title: '每日结束时间', dataIndex: 'endTime', key: 'endTime', width: 100 },
    { title: '启用', key: 'status', width: 100 },
    { title: '操作', fixed: 'right', width: 180, key: 'action' }
];
const loading = ref<boolean>(false)

const handleStatusChange = (row: FlashPromotionSession) => {
    Modal.confirm({
        title: "提示",
        content: "是否要修改该状态?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _updateFlashSessionStatus(row.id, row.status === 1 ? 0 : 1).then(res => {
                row.status = row.status === 1 ? 0 : 1
                getPageLists()
            });
        },
    });
}
const handleUpdate = (row: FlashPromotionSession) => {
    flashPromotionSession.value = row
    modalVisible.value = true;
}
const handleDelete = (row: FlashPromotionSession) => {
    _deleteSession(row.id).then(res => {
        getPageLists()
    });
}

const getPageLists = () => {
    loading.value = true
    _getFlashSessionList().then(res => {
        data.value = res.data
        data.value.forEach(item => {
            item.key = item.id
        })
    }).finally(() => {
        loading.value = false
    })
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    flashPromotionSession.value = undefined
    modalVisible.value = true
}
const handleOk = () => {
    getPageLists()
}

getPageLists()
</script>
<style lang="less" scoped>

</style>