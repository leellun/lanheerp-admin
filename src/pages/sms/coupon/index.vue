<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" >
            <a-form-item label="筛选搜索：">
                <a-input size="small" :span="8" v-model:value="formRef.name" style="width: 200px" placeholder="活动名称">
                </a-input>
            </a-form-item>
            <a-form-item label="优惠券类型：">
                <a-select v-model:value="formRef.type" placeholder="全部" :allowClear="true" style="width:100px">
                    <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">{{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <div style="text-align:center;margin-top: 15px;">
            <a-button size="small" type="primary" @click="handleSearch" >
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
                <template v-else-if="column.key === 'useType'">
                    {{ formatUseType(record.useType) }}
                </template>
                <template v-else-if="column.key === 'minPoint'">
                    满{{ record.minPoint }}元可用
                </template>
                <template v-else-if="column.key === 'amount'">
                    {{ record.amount }}元
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
                        <a @click="(e?: Event) => handleView(record)">查看</a>
                        <a-divider type="vertical" />
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { Coupon, CouponSearch } from '@/api/sms/couponApi'
import { _getCouponPage, _deleteCoupon } from '@/api/sms/couponApi'
import dayjs from 'dayjs';
import { Form } from 'ant-design-vue';
const router = useRouter()
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Coupon | any>>([]);
const formRef = reactive<Partial<CouponSearch>>({
    pageNo: 1,
    pageSize: 10,
    name:undefined,
    type:undefined
})
const typeOptions = [
    {
        label: '全场赠券',
        value: 0
    },
    {
        label: '会员赠券',
        value: 1
    },
    {
        label: '购物赠券',
        value: 2
    },
    {
        label: '注册赠券',
        value: 3
    }
]
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 100 },
    { title: '优惠劵名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '优惠券类型', key: 'type', width: 100 },
    { title: '可使用商品', key: 'useType', width: 100 },
    { title: '使用门槛', key: 'minPoint', width: 100 },
    { title: '面值', key: 'amount', width: 100 },
    { title: '适用平台', key: 'platform', width: 100 },
    { title: '有效期', key: 'startTime', width: 100 },
    { title: '状态', key: 'endTime', width: 100 },
    { title: '操作', fixed: 'right', width: 180, key: 'action' }
];
const formatType = (type: number) => {
    for (let i = 0; i < typeOptions.length; i++) {
        if (type === typeOptions[i].value) {
            return typeOptions[i].label;
        }
    }
    return '';
}
const formatUseType = (useType: number) => {
    if (useType === 0) {
        return '全场通用';
    } else if (useType === 1) {
        return '指定分类';
    } else {
        return '指定商品';
    }
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
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)

const handleDelete = (row: Coupon) => {
    _deleteCoupon(row.id).then(res => {
        handleSearch()
    });
}

const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getCouponPage(formRef as CouponSearch).then(res => {
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
const handleView = (row: Coupon) => {
    router.push({name:'couponHistory',query:{
        id:row.id
    }})
}
const handleUpdate = (row: Coupon) => {
    router.push({name:'updateCoupon',query:{
        id:row.id
    }})
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    router.push({name:'addCoupon'})
}
handleSearch()
</script>
<style lang="less" scoped>

</style>