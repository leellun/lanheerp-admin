<template>
  <div class="main-container">
    <a-table :columns="columns" :data-source="list">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sourceType'">
          <a-select placeholder="请选择物流公司" v-model="record.deliveryCompany" size="small">
            <a-select-option v-for="item in companyOptions" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </template>
        <template v-else-if="column.key === 'deliverySn'">
          <a-input size="small" v-model:value="record.deliverySn"></a-input>
        </template>
      </template>
    </a-table>
    <div style="margin-top: 15px;text-align: center">
      <a-button @click="cancel">取消</a-button>
      <a-button @click="confirm" type="primary">确定</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { _deliveryOrder } from '@/api/oms/orderApi'
import type { OrderDeliveryDto } from '@/api/oms/orderApi'
import { Modal } from 'ant-design-vue';
const router = useRouter()
const companyOptions = ["顺丰快递", "圆通快递", "中通快递", "韵达快递"];
const columns = [
  {
    title: '订单编号',
    key: 'orderSn',
    dataIndex: 'orderSn',
    width: 100
  }, {
    title: '收货人',
    dataIndex: 'receiverName',
    key: 'receiverName',
    width: 100
  }, {
    title: '手机号码',
    dataIndex: 'receiverPhone',
    key: 'receiverPhone',
    width: 100
  }, {
    title: '邮政编码',
    dataIndex: 'receiverPostCode',
    key: 'receiverPostCode',
    width: 100
  }, {
    title: '收货地址',
    dataIndex: 'address',
    key: 'address',
    width: 100
  }, {
    title: '配送方式',
    key: 'sourceType',
    width: 100
  }, {
    title: '物流单号',
    key: 'deliverySn',
    width: 100
  }
];
const list = ref<Array<OrderDeliveryDto>>([])
list.value = JSON.parse(router.currentRoute.value.query.list as string)
console.log(list.value)
const cancel = () => {
  router.push({ name: 'order' })
}
const confirm = () => {
  Modal.confirm({
    title: "提示",
    content: "是否要进行发货操作?",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      _deliveryOrder(list.value).then(res => {
        router.push({ name: 'order' })
      });
    },
  });
}
</script>
<style lang="less" scoped>

</style>


