<template>
  <div class="main-container">
    <a-card>
      <a-form :model="orderSetting" :labelCol="{ style: { width: '150px' } }">
        <a-form-item label="秒杀订单超过：" v-bind="validateInfos.flashOrderOvertime">
          <a-input v-model:value="orderSetting.flashOrderOvertime" class="input-width">
            <template slot="append">分</template>
          </a-input>
          <span class="note-margin">未付款，订单自动关闭</span>
        </a-form-item>
        <a-form-item label="正常订单超过：" v-bind="validateInfos.normalOrderOvertime">
          <a-input v-model:value="orderSetting.normalOrderOvertime" class="input-width">
            <template slot="append">分</template>
          </a-input>
          <span class="note-margin">未付款，订单自动关闭</span>
        </a-form-item>
        <a-form-item label="发货超过：" v-bind="validateInfos.confirmOvertime">
          <a-input v-model:value="orderSetting.confirmOvertime" class="input-width">
            <template slot="append">天</template>
          </a-input>
          <span class="note-margin">未收货，订单自动完成</span>
        </a-form-item>
        <a-form-item label="订单完成超过：" v-bind="validateInfos.finishOvertime">
          <a-input v-model:value="orderSetting.finishOvertime" class="input-width">
            <template slot="append">天</template>
          </a-input>
          <span class="note-margin">自动结束交易，不能申请售后</span>
        </a-form-item>
        <a-form-item label="订单完成超过：" v-bind="validateInfos.commentOvertime">
          <a-input v-model:value="orderSetting.commentOvertime" class="input-width">
            <template slot="append">天</template>
          </a-input>
          <span class="note-margin">自动五星好评</span>
        </a-form-item>
        <a-form-item >
          <a-button @click="confirm" type="primary" style="margin-left:150px">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { _getOrderSetting, _updateOrderSetting } from '@/api/oms/orderSettingApi';
import type { OrderSetting } from '@/api/oms/orderSettingApi';
import { Form, Modal } from 'ant-design-vue';
const useForm = Form.useForm
const orderSetting = reactive<OrderSetting>({
  id: undefined,
  flashOrderOvertime: 0,
  normalOrderOvertime: 0,
  confirmOvertime: 0,
  finishOvertime: 0,
  commentOvertime: 0
})
const rulesRef = reactive({
  flashOrderOvertime: [{
    required: true,
    message: '必须输入',
    trigger: "blur"
  }],
  normalOrderOvertime: [{
    required: true,
    message: '必须输入',
    trigger: "blur"
  }],
  confirmOvertime: [{
    required: true,
    message: '必须输入',
    trigger: "blur"
  }],
  finishOvertime: [{
    required: true,
    message: '必须输入',
    trigger: "blur"
  }],
  commentOvertime: [{
    required: true,
    message: '必须输入',
    trigger: "blur"
  }],
})
const { validate, validateInfos } = useForm(orderSetting, rulesRef)
_getOrderSetting(1).then(res => {
  Object.assign(orderSetting, res.data)
})
const confirm = () => {
  Modal.confirm({
    title: "提示",
    content: "是否要提交修改?",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      validate().then(() => {
        _updateOrderSetting(1, orderSetting);
      })
    },
  });
}

</script>
<style lang="less" scoped>
.input-width {
  width: 50%;
}

.note-margin {
  margin-left: 15px;
}
</style>


