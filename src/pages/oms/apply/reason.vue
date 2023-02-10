<template>
  <div class="main-container">
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button type="primary" size="small" @click="handleAdd"><template #icon>
          <plus-outlined />
        </template>添加</a-button>
      <a-button type="primary" danger size="small" style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
        @click="handleDeleteSelected"><delete-outlined />删除</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
      @change="handleTableChange" :scroll="{ x: 280 }" :row-selection="{ selectedRowKeys: selectedRowKeys }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-switch :checked="record.status === 1" @change="handleStatusChange(record)" />
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a @click="(e?: Event) => handleEditRecord(record, e)">编辑</a>
            <a-divider type="vertical" />

            <a-divider type="vertical" />
            <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否" @confirm="() => handleDeleteRecord([record.id])">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
    <ReasonModal :reason="orderReturnReason" v-model:visible="modalVisible" v-if="modalVisible" @ok="handleOk" />
  </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getReturnReasonPage, _deleteReason, _updateStatus } from '@/api/oms/returnReasonApi'
import type { OrderReturnReason } from '@/api/oms/returnReasonApi'
import type { PageSearch } from '@/api/types'
import ReasonModal from './modals/ReasonModal.vue'
import { Modal } from 'ant-design-vue'
const selectedRowKeys = ref<string[]>([]);
const modalVisible = ref<boolean>(false)
const orderReturnReason = ref<OrderReturnReason>()
const data = ref<Array<OrderReturnReason | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<PageSearch>>({})
const loading = ref<boolean>(false)
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: 100
  }, {
    title: '原因类型',
    key: 'name',
    dataIndex: 'name',
    width: 60
  }, {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 100
  }, {
    title: '是否可用',
    key: 'status',
    width: 100
  }, {
    title: '添加时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
  }, {
    title: '操作',
    fixed: 'right',
    width: 100,
    key: 'action'
  }
];
const handleStatusChange = (row: OrderReturnReason) => {
  let ids = [];
  ids.push(row.id);
  _updateStatus(ids, row.status === 0 ? 1 : 0).then(res => {
    row.status = (row.status === 0 ? 1 : 0)
  });
}
const router = useRouter()
const getPageLists = () => {
  loading.value = true
  formRef.pageSize = pagination.pageSize
  _getReturnReasonPage(formRef as PageSearch).then(res => {
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
  pagination.current = page.current;
  formRef.pageNo = page.current
  getPageLists();
}
const handleAdd = (e?: Event) => {
  e?.preventDefault()
  orderReturnReason.value = undefined
  modalVisible.value = true
}
const handleEditRecord = (record: OrderReturnReason, e?: Event) => {
  e?.preventDefault()
  orderReturnReason.value = record
  modalVisible.value = true
}
const handleDeleteRecord = (ids: Array<any>) => {
  _deleteReason(ids).then(res => {
    getPageLists()
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
const handleOk = () => {
  formRef.pageNo = 1
  getPageLists()
};
formRef.pageNo = 1
getPageLists()
</script>
<style lang="less" scoped>

</style>