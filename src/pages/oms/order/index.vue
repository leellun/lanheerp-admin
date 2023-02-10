<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" :gutter="24">
            <a-form-item label="输入搜索：">
                <a-input size="small" :span="8" v-model:value="formRef.orderSn" style="width: 200px" placeholder="订单编号">
                </a-input>
            </a-form-item>
            <a-form-item label="收货人：">
                <a-input size="small" v-model:value="formRef.receiverKeyword" style="width: 200px"
                    placeholder="收货人姓名/手机号码">
                </a-input>
            </a-form-item>
            <a-form-item label="订单状态：">
                <a-select v-model:value="formRef.status" size="small" style="width: 200px" placeholder="请选择" clearable>
                    <a-select-option v-for="item in statusOptions" :key="item.value" :value="item.value">{{
                        item.label
                    }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="订单分类：">
                <a-select v-model:value="formRef.orderType" size="small" style="width: 200px" placeholder="请选择">
                    <a-select-option v-for="item in orderTypeOptions" :key="item.value" :value="item.value">{{
                        item.label
                    }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="订单来源：">
                <a-select v-model:value="formRef.sourceType" size="small" style="width: 200px" placeholder="状态">
                    <a-select-option v-for="item in sourceTypeOptions" :key="item.value" :value="item.value">{{
                        item.label
                    }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <div style="text-align:center;margin-top: 15px;">
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
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" danger size="small" style="margin-left:10px"
                :disabled="selectedRowKeys.length == 0" @click="handleDeleteSelected"><delete-outlined />删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'payType'">
                    {{ formatPayType(record.payType) }}
                </template>
                <template v-else-if="column.key === 'sourceType'">
                    {{ record.sourceType === 1 ? 'APP订单' : 'PC订单' }}
                </template>
                <template v-else-if="column.key === 'status'">
                    {{ formatStatus(record.status) }}
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleViewRecord(e, record.id)">查看订单</a>
                        <a-divider type="vertical" />
                        <a v-if="record.status === 0" @click="handleCloseOrder([record.id])">关闭订单</a>
                        <a v-else-if="record.status === 1" @click="handleDeliveryOrder(record)">订单发货</a>
                        <a v-else-if="record.status === 2 || record.status === 3"
                            @click="handleViewLogistics(record)">订单跟踪</a>
                        <a v-else @click="handleDeleteRecord([record.id])"> 删除订单</a>
                    </span>
                </template>
            </template>
        </a-table>
        <CloseOrder :ids="modalIds" v-model:visible="modalVisible" v-if="modalVisible"  @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { OrderSearch, Order, _closeOrder } from '@/api/oms/orderApi'
import { _getOrderPageLists, _deleteOrder } from '@/api/oms/orderApi'
import { Form, Modal } from 'ant-design-vue';
import CloseOrder from './modals/CloseOrder.vue';
const modalVisible = ref<boolean>(false)
const modalIds = ref<Array<string>>()
const router = useRouter()
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Order | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<OrderSearch>>({
    orderSn: undefined,
    receiverKeyword: undefined,
    status: undefined,
    orderType: undefined,
    sourceType: undefined,
    createTime: undefined,
})
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const statusOptions = [
    {
        label: '待付款',
        value: 0
    },
    {
        label: '待发货',
        value: 1
    },
    {
        label: '已发货',
        value: 2
    },
    {
        label: '已完成',
        value: 3
    },
    {
        label: '已关闭',
        value: 4
    }
]
const orderTypeOptions = [
    {
        label: '正常订单',
        value: 0
    },
    {
        label: '秒杀订单',
        value: 1
    }
]
const sourceTypeOptions = [
    {
        label: 'PC订单',
        value: 0
    },
    {
        label: 'APP订单',
        value: 1
    }
]
const columns = [
    {
        title: '订单编号',
        key: 'orderSn',
        dataIndex: 'orderSn',
        width: 100
    }, {
        title: '提交时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100
    }, {
        title: '用户账号',
        dataIndex: 'memberUsername',
        key: 'memberUsername',
        width: 100
    }, {
        title: '订单金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: 100
    }, {
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
        width: 100
    }, {
        title: '订单来源',
        dataIndex: 'sourceType',
        key: 'sourceType',
        width: 100
    }, {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 100
    }, {
        title: '操作',
        fixed: 'right',
        width: 180,
        key: 'action'
    }
];
const formatPayType = (value: number) => {
    if (value === 1) {
        return '支付宝';
    } else if (value === 2) {
        return '微信';
    } else {
        return '未支付';
    }
}
const formatStatus = (value: number) => {
    if (value === 1) {
        return '待发货';
    } else if (value === 2) {
        return '已发货';
    } else if (value === 3) {
        return '已完成';
    } else if (value === 4) {
        return '已关闭';
    } else if (value === 5) {
        return '无效订单';
    } else {
        return '待付款';
    }
}
const onSelectChange = (keys: string[]) => {
    selectedRowKeys.value = keys;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageLists()
}
const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getOrderPageLists(formRef as OrderSearch).then(res => {
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
const handleTableChange = (page: any, filters: any, sorter: any) => {
    formRef.pageNo = page.current
    getPageLists();
}
const handleResetSearch = () => {
    resetFields()
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    router.push({
        name: 'addProduct',
    })
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        Modal.confirm({
            title: "系统提示",
            content: "是否删除选中？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                handleDeleteRecord(selectedRowKeys.value)
            },
        });

    }
}
const handleViewRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    router.push({
        name: 'updateProduct',
        query: {
            id
        }
    })
}
const handleDeleteRecord = (ids: string[]) => {
    Modal.confirm({
        title: "提示",
        content: "是否要进行该删除操作?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _deleteOrder(ids).then(res => {
                getPageLists()
            });
        },
    });

}
const handleCloseOrder = (ids: string[]) => {
    modalIds.value = ids
    modalVisible.value = true
}
const handleDeliveryOrder = (record: Order) => {

}
const handleViewLogistics = (record: Order) => {

}
const handleOk = () => {
    handleSearch()
};
handleSearch()
</script>
<style lang="less" scoped>

</style>