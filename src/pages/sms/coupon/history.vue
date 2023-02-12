<template> 
    <div class="main-container">
        <div class="table-layout">
            <a-row>
                <a-col :span="4" class="table-cell-title">名称</a-col>
                <a-col :span="4" class="table-cell-title">优惠券类型</a-col>
                <a-col :span="4" class="table-cell-title">可使用商品</a-col>
                <a-col :span="4" class="table-cell-title">使用门槛</a-col>
                <a-col :span="4" class="table-cell-title">面值</a-col>
                <a-col :span="4" class="table-cell-title">状态</a-col>
            </a-row>
            <a-row>
                <a-col :span="4" class="table-cell">{{ coupon.name }}</a-col>
                <a-col :span="4" class="table-cell">{{ formatType(coupon.type ) }}</a-col>
                <a-col :span="4" class="table-cell">{{ formatUseType(coupon.useType) }}</a-col>
                <a-col :span="4" class="table-cell">满{{ coupon.minPoint }}元可用</a-col>
                <a-col :span="4" class="table-cell">{{ coupon.amount }}元</a-col>
                <a-col :span="4" class="table-cell">{{ formatStatus(coupon.endTime ) }}</a-col>
            </a-row>
            <a-row>
                <a-col :span="4" class="table-cell-title">有效期</a-col>
                <a-col :span="4" class="table-cell-title">总发行量</a-col>
                <a-col :span="4" class="table-cell-title">已领取</a-col>
                <a-col :span="4" class="table-cell-title">待领取</a-col>
                <a-col :span="4" class="table-cell-title">已使用</a-col>
                <a-col :span="4" class="table-cell-title">未使用</a-col>
            </a-row>
            <a-row>
                <a-col :span="4" class="table-cell" style="font-size: 13px">
                    {{ coupon.startTime }}至{{ coupon.endTime }}
                </a-col>
                <a-col :span="4" class="table-cell">{{ coupon.publishCount }}</a-col>
                <a-col :span="4" class="table-cell">{{ coupon.receiveCount }}</a-col>
                <a-col :span="4" class="table-cell">{{ coupon.publishCount - coupon.receiveCount }}</a-col>
                <a-col :span="4" class="table-cell">{{ coupon.useCount }}</a-col>
                <a-col :span="4" class="table-cell">{{ coupon.publishCount - coupon.useCount }}</a-col>
            </a-row>
        </div>
        <a-card class="filter-container" shadow="never">
            <!--工具栏-->
            <a-form layout="inline" :model="formRef">
                <a-form-item label="使用状态：">
                    <a-select v-model:value="formRef.useStatus" placeholder="全部" clearable style="width:300px">
                        <a-select-option v-for="item in useTypeOptions" :key="item.value" :value="item.value">{{
                            item.label
                        }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="订单编号：">
                    <a-input v-model:value="formRef.orderSn" class="input-width" placeholder="订单编号"
                        style="width:300px"></a-input>
                </a-form-item>
            </a-form>
            <div style="text-align:center;margin-top: 15px;">
                <a-button size="small" type="primary" @click="handleSearchList">
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
        </a-card>
        <div class="table-container">
            <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
                @change="handleTableChange" :scroll="{ x: 280 }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'getType'">
                        {{ record.getType === 1 ? '主动获取' : '后台赠送' }}
                    </template>
                    <template v-else-if="column.key === 'useStatus'">
                        {{ formatCouponHistoryUseType(record.useStatus) }}
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { _getCoupon } from '@/api/sms/couponApi';
import { _getCouponHistoryPage } from '@/api/sms/couponHistoryApi';
import type { Coupon } from '@/api/sms/couponApi';
import type { CouponHistory, CouponHistorySearch } from '@/api/sms/couponHistoryApi';
import { useRouter } from 'vue-router';
import { Form } from 'ant-design-vue';
import dayjs from 'dayjs'
const router = useRouter()
const couponId = router.currentRoute.value.query.id
const coupon = ref<Coupon>({ type: 0 } as any)
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const data = ref<Array<CouponHistory | any>>([]);
const formRef = ref<Partial<CouponHistorySearch>>({
    pageNo: 1,
    pageSize: 10,
    useStatus: undefined,
    orderSn: undefined,
    couponId: undefined
});
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
    { title: '优惠码', key: 'couponCode', dataIndex: 'couponCode', width: 100 },
    { title: '领取会员', dataIndex: 'memberNickname', key: 'memberNickname', width: 100 },
    { title: '领取方式', key: 'getType', width: 100 },
    { title: '领取时间', dataIndex: 'createTime',key: 'createTime', width: 100 },
    { title: '当前状态', key: 'useStatus', width: 100 },
    { title: '使用时间', key: 'useTime', dataIndex: 'useTime', width: 100 },
    { title: '订单编号', key: 'orderSn', dataIndex: 'orderSn', width: 100 },
];
const formatCouponHistoryUseType = (useType: number) => {
    if (useType === 0) {
        return '未使用';
    } else if (useType === 1) {
        return '已使用';
    } else {
        return '已过期';
    }
}
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
];

const useTypeOptions = [
    {
        label: "未使用",
        value: 0
    },
    {
        label: "已使用",
        value: 1
    },
    {
        label: "已过期",
        value: 2
    }
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
const formatStatus = (endTime: string) => {
    let now = Date.now();
    let end = dayjs(endTime, "YYYY-MM-DD HH:mm:ss").millisecond()
    if (end > now) {
        return '未过期'
    } else {
        return '已过期';
    }
}
const handleResetSearch = () => {
    resetFields()
}
const handleTableChange = (page: any, filters: any, sorter: any) => {
    formRef.value.pageNo = page.current
    getCouponHistory();
}
const handleSearchList = () => {
    formRef.value.pageNo = 1;
    getCouponHistory();
}
const getCouponHistory = () => {
    loading.value = true
    formRef.value.couponId = couponId
    _getCouponHistoryPage(formRef.value as any).then(res => {
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
if (couponId != undefined) {
    _getCoupon(couponId).then(res => {
        coupon.value = res.data;
    });
    getCouponHistory()
}

</script>
<style lang="less" scoped>
.main-container {
    width: 80%;
    margin: 0px auto;
}

.filter-container {
    margin-top: 20px;
}

.table-layout {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
}

.table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
}

.table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
}
</style>


