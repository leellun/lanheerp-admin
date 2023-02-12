<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" :gutter="24">
            <a-form-item label="筛选搜索：">
                <a-input size="small" :span="8" v-model:value="formRef.keyword" style="width: 200px" placeholder="活动名称">
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button size="small" type="primary" @click="handleSearch">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                    搜索
                </a-button>
                <a-button size="small" style="margin-left:15px" type="primary" @click="handleResetSearch">
                    <template #icon><undo-outlined /></template>
                    重置
                </a-button>
            </a-form-item>
        </a-form>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>添加活动</a-button>
            <a-button type="primary" danger size="small" style="margin-left:10px"
                @click="handleShowSessionList"><delete-outlined />秒杀时间段列表</a-button>

        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'activeStatus'">
                    {{ formatActiveStatus(record) }}
                </template>
                <template v-else-if="column.key === 'status'">
                    <a-switch @change="handleStatusChange(record)" :active-value="1" :inactive-value="0"
                        :checked="record.status === 1">
                    </a-switch>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleSelectSession(record)">设置商品</a>
                        <a-divider type="vertical" />
                        <a @click="(e?: Event) => handleUpdate(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDelete(record)">
                            <a >删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <FlashModal v-model:visible="modalVisible" v-if="modalVisible" :flash-promotion="flashPromotion" @ok="handleOk"/>
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FlashPromotion, FlashPromotionSearch } from '@/api/sms/flashApi'
import { _getFlashPromotionPage, _deleteFlash, _updateFlashStatus } from '@/api/sms/flashApi'
import { Form, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
import FlashModal from './modals/FlashModal.vue';
const router = useRouter()
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const selectedRowKeys = ref<string[]>([]);
const flashPromotion = ref<FlashPromotion>()
const modalVisible = ref<boolean>(false)
const data = ref<Array<FlashPromotion | any>>([]);
const formRef = reactive<Partial<FlashPromotionSearch>>({
    pageNo: 1,
    pageSize: 10,
    keyword: undefined
})
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 100 },
    { title: '活动标题', dataIndex: 'title', key: 'title', width: 100 },
    { title: '活动状态', key: 'activeStatus', width: 100 },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate', width: 100 },
    { title: '结束时间', dataIndex: 'endDate', key: 'endDate', width: 100 },
    { title: '上线/下线', key: 'status', width: 100 },
    { title: '操作', fixed: 'right', width: 180, key: 'action' }
];
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)

const formatActiveStatus = (row: FlashPromotion)=> {
    let nowTime = new Date().getTime();
    let start = dayjs(row.startDate, 'YYYY-MM-DD').millisecond()
    let end = dayjs(row.endDate, 'YYYY-MM-DD').millisecond()
    if (nowTime >= start && nowTime <= end) {
        return '活动进行中';
    } else if (nowTime > end) {
        return '活动已结束';
    } else {
        return '活动未开始';
    }
}
const handleStatusChange = (row: FlashPromotion) => {
    Modal.confirm({
        title: "提示",
        content: "是否要修改该状态?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            row.status = row.status === 1 ? 0 : 1
            _updateFlashStatus(row.id, row.status === 1 ? 0 : 1).then(res => {
                handleSearch()
            });
        },
    });
}
const handleSelectSession = (row: FlashPromotion) => {
    router.push({ name: 'selectSession', query: { flashPromotionId: row.id } })
}
const handleUpdate = (row: FlashPromotion) => {
    flashPromotion.value = Object.assign({}, row);
    modalVisible.value = true;
}
const handleDelete = (row: FlashPromotion)=> {
    _deleteFlash(row.id).then(res => {
                handleSearch()
            });
}

const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getFlashPromotionPage(formRef as FlashPromotionSearch).then(res => {
        pagination.current = res.data.current
        pagination.pageSize = res.data.size
        pagination.total = res.data.total
        data.value = res.data.records
        data.value.forEach(item => {
            item.key = item.id
        })
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
const handleResetSearch = () => {
    resetFields()
}
const handleShowSessionList = () => {
    router.push({ name: 'flashSession' })
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    flashPromotion.value=undefined
    modalVisible.value=true
}
const handleOk = () => {
    handleSearch()
}

handleSearch()
</script>
<style lang="less" scoped>

</style>