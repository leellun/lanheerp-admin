<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef">

            <a-form-item label="广告名称：">
                <a-input size="small" :span="8" v-model:value="formRef.name" style="width: 200px" placeholder="广告名称">
                </a-input>
            </a-form-item>
            <a-form-item label="广告位置：">
                <a-select v-model:value="formRef.type" placeholder="全部" :allowClear="true" style="width:200px">
                    <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">{{
                        item.label
                    }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="到期时间：">
                <a-date-picker type="date" placeholder="选择日期" v-model:value="endTime"
                    style="width: 200px"></a-date-picker>
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
                </template>添加</a-button>

        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" 
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'type'">
                    {{ formatType(record.type) }}
                </template>
                <template v-else-if="column.key === 'pic'">
                    <a-image :width="100" :src="record.pic" />
                </template>
                <template v-else-if="column.key === 'startTime'">
                    <p>开始时间：{{ record.startTime }}</p>
                    <p>到期时间：{{ record.endTime }}</p>
                </template>
                <template v-else-if="column.key === 'status'">
                    <a-switch @change="handleUpdateStatus(record)" :active-value="1" :inactive-value="0"
                        :checked="record.status === 1">
                    </a-switch>
                </template>
                <template v-else-if="column.key === 'platform'">
                    {{ formatPlatform(record.platform) }}元
                </template>
                <template v-else-if="column.key === 'startTime'">
                    {{ record.startTime }}至{{ record.endTime }}
                </template>
                <template v-else-if="column.key === 'endTime'">
                    {{ formatStatus(record.endTime) }}
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
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { HomeAdvertise, AdvertiseSearch } from '@/api/sms/homeAdvertiseApi'
import { _getAdvertisePage, _deleteHomeAdvertise, _updateAdvertiseStatus } from '@/api/sms/homeAdvertiseApi'
import dayjs from 'dayjs';
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<HomeAdvertise | any>>([]);
const formRef = reactive<Partial<AdvertiseSearch>>({
    pageNo: 1,
    pageSize: 10,
    name: undefined,
    type: undefined,
    endTime: undefined
})
const typeOptions = [{ label: 'PC首页轮播', value: 0 }, { label: 'APP首页轮播', value: 1 }]
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 50,align:'center' },
    { title: '广告名称', dataIndex: 'name', key: 'name', width: 150 ,align:'center' },
    { title: '广告位置', key: 'type', width: 100 ,align:'center' },
    { title: '广告图片', key: 'pic', width: 100,align:'center'  },
    { title: '时间', key: 'startTime', width: 150 ,align:'center' },
    { title: '上线/下线', key: 'status', width: 100 ,align:'center' },
    { title: '点击次数', key: 'clickCount', dataIndex: 'clickCount', width: 80 ,align:'center' },
    { title: '生成订单', key: 'orderCount', dataIndex: 'orderCount', width: 80 ,align:'center' },
    { title: '操作', fixed: 'right', width: 150, key: 'action' ,align:'center' }
];
const formatType = (type: number) => {
    for (let i = 0; i < typeOptions.length; i++) {
        if (type === typeOptions[i].value) {
            return typeOptions[i].label;
        }
    }
    return '';
}
const formatPlatform = (platform: number) => {
    if (platform === 1) {
        return '移动平台';
    } else if (platform === 2) {
        return 'PC平台';
    } else {
        return '全平台';
    }
}
const formatStatus = (endTime: string) => {
    let now = Date.now();
    let end = dayjs(endTime, "YYYY-MM-DD HH:mm:ss").millisecond()
    if (end > now) {
        return '未过期'
    } else {
        return '已过期';
    }
}
const endTime = computed({
    get() {
        if (formRef.endTime === undefined) return undefined
        return dayjs(formRef.endTime, "YYYY-MM-DD")
    }, set(newValue) {
        formRef.endTime = newValue!.format("YYYY-MM-DD")
    }
})
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)

const handleDelete = (row: HomeAdvertise) => {
    _deleteHomeAdvertise([row.id]).then(res => {
        handleSearch()
    });
}

const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getAdvertisePage(formRef as AdvertiseSearch).then(res => {
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
const handleUpdateStatus = (row: HomeAdvertise) => {
    Modal.confirm({
        title: "提示",
        content: "是否要进行此操作?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _updateAdvertiseStatus(row.id, row.status === 1 ? 0 : 1).then(res => {
                getPageLists()
            });
        },
    });
}
const handleUpdate = (row: HomeAdvertise) => {
    router.push({
        name: 'updateAdvertise', query: {
            id: row.id
        }
    })
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    router.push({ name: 'addAdvertise' })
}
handleSearch()
</script>
<style lang="less" scoped>

</style>