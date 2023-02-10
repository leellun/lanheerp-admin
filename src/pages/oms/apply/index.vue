<template>
  <div class="main-container">
    <!--工具栏-->
    <a-form layout="inline" :model="formRef" :gutter="24">
      <a-form-item label="输入搜索：">
        <a-input size="small" :span="8" v-model:value="formRef.id" style="width: 200px" placeholder="服务单号">
        </a-input>
      </a-form-item>
      <a-form-item label="处理状态：">
        <a-select v-model:value="formRef.status" placeholder="全部" style="width: 200px" size="small">
          <a-select-option v-for="item in statusOptions" :key="item.value" :value="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="申请时间：">
        <a-date-picker v-model:value="formRef.createTime" style="width: 200px" allowClear size="small"/>
      </a-form-item>
      <a-form-item label="操作人员：">
        <a-input v-model:value="formRef.handleMan" class="input-width" placeholder="全部" size="small" style="width: 200px"></a-input>
      </a-form-item>
      <a-form-item label="处理时间：">
        <a-date-picker v-model:value="formRef.handleTime" allowClear size="small" style="width: 200px"/>
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
      <a-button type="primary" danger size="small" style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
        @click="handleDeleteSelected"><delete-outlined />删除</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
      @change="handleTableChange" :scroll="{ x: 280 }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'productRealPrice'">
          {{ formatReturnAmount(record) }}
        </template>
        <template v-else-if="column.key === 'status'">
          {{ formatStatus(record.status) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a @click="(e?: Event) => handleViewRecord(e, record.id)">查看详情</a>
            <a-divider type="vertical"  v-if="record.status===3"/>
            <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否" @confirm="() => deleteApply([record.id])">
              <a v-if="record.status===3">删除</a>
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
import type { ReturnApplyQueryDto, OrderReturnApply } from '@/api/oms/returnApplyApi'
import { _getReturnApplyPage, _deleteApply } from '@/api/oms/returnApplyApi'
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<ReturnApplyQueryDto | any>>([]);
const statusOptions = [
  {
    label: '待处理',
    value: 0
  },
  {
    label: '退货中',
    value: 1
  },
  {
    label: '已完成',
    value: 2
  },
  {
    label: '已拒绝',
    value: 3
  }
]
const formRef = reactive<Partial<ReturnApplyQueryDto>>({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  receiverKeyword: undefined,
  status: undefined,
  createTime: undefined,
  handleMan: undefined,
  handleTime: undefined,
})
const columns = [
  {
    title: '服务单号',
    key: 'id',
    dataIndex: 'id',
    width: 100
  }, {
    title: '申请时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
  }, {
    title: '用户账号',
    dataIndex: 'memberUsername',
    key: 'memberUsername',
    width: 100
  }, {
    title: '退款金额',
    key: 'productRealPrice',
    width: 100
  }, {
    title: '申请状态',
    key: 'status',
    width: 100
  }, {
    title: '处理时间',
    dataIndex: 'handleTime',
    key: 'handleTime',
    width: 100
  }, {
    title: '操作',
    fixed: 'right',
    width: 180,
    key: 'action'
  }
];
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const formatReturnAmount = (row: OrderReturnApply) => {
  return row.productRealPrice * row.productCount;
}

const formatStatus = (status: number) => {
  switch (status) {
    case 0:
      return '待处理'
    case 1:
      return '退货中'
    case 2:
      return '已完成'
    default:
      return '未知'
  }
}
const getPageLists = () => {
  loading.value = true
  formRef.pageSize = pagination.pageSize
  _getReturnApplyPage(formRef as ReturnApplyQueryDto).then(res => {
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
const handleViewRecord = (e?: Event, id?: string) => {
  e?.preventDefault()
  router.push({
    name: 'returnApplyDetail',
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
      deleteApply(ids)
    },
  });
}
const deleteApply=(ids: string[])=>{
  _deleteApply(ids).then(res => {
        getPageLists()
      });
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

handleSearch()
</script>
<style lang="less" scoped>

</style>