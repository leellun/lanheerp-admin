<template>
  <div class="main-container">
    <div>
      <a-steps :current="formatStepStatus(order.status)">
        <a-step title="提交订单">
          <template #description>
            <span>{{ order.createTime }}</span>
          </template>
        </a-step>
        <a-step title="支付订单"><template #description>
            <span>{{ order.paymentTime }}</span>
          </template>
        </a-step>
        <a-step title="平台发货"><template #description>
            <span>{{ order.deliveryTime }}</span>
          </template>
        </a-step>
        <a-step title="确认收货"><template #description>
            <span>{{ order.receiveTime }}</span>
          </template>
        </a-step>
        <a-step title="完成评价"><template #description>
            <span>{{ order.commentTime }}</span>
          </template>
        </a-step>
      </a-steps>
    </div>
    <a-card style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{ formatStatus(order.status) }}</span>
        <div class="operate-button-container" v-show="order.status === 0">
          <a-button @click="showUpdateReceiverDialog">修改收货人信息</a-button>
          <a-button>修改商品信息</a-button>
          <a-button @click="showUpdateMoneyDialog">修改费用信息</a-button>
          <a-button @click="showMessageDialog">发送站内信</a-button>
          <a-button @click="showCloseOrderDialog">关闭订单</a-button>
          <a-button @click="showMarkOrderDialog">备注订单</a-button>
        </div>
        <div class="operate-button-container" v-show="order.status === 1">
          <a-button @click="showUpdateReceiverDialog">修改收货人信息</a-button>
          <a-button @click="showMessageDialog">发送站内信</a-button>
          <a-button>取消订单</a-button>
          <a-button @click="showMarkOrderDialog">备注订单</a-button>
        </div>
        <div class="operate-button-container" v-show="order.status === 2 || order.status === 3">
          <a-button @click="showLogisticsDialog">订单跟踪</a-button>
          <a-button @click="showMessageDialog">发送站内信</a-button>
          <a-button @click="showMarkOrderDialog">备注订单</a-button>
        </div>
        <div class="operate-button-container" v-show="order.status === 4">
          <a-button @click="handleDeleteRecord">删除订单</a-button>
          <a-button @click="showMarkOrderDialog">备注订单</a-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon name="marker" style="vertical-align:middle"></svg-icon>
        <span class="font-small" style="vertical-align:middle">基本信息</span>
      </div>
      <div class="table-layout">
        <a-row>
          <a-col :span="4" class="table-cell-title">订单编号</a-col>
          <a-col :span="4" class="table-cell-title">发货单流水号</a-col>
          <a-col :span="4" class="table-cell-title">用户账号</a-col>
          <a-col :span="4" class="table-cell-title">支付方式</a-col>
          <a-col :span="4" class="table-cell-title">订单来源</a-col>
          <a-col :span="4" class="table-cell-title">订单类型</a-col>
        </a-row>
        <a-row>
          <a-col :span="4" class="table-cell">{{ order.orderSn }}</a-col>
          <a-col :span="4" class="table-cell">暂无</a-col>
          <a-col :span="4" class="table-cell">{{ order.memberUsername }}</a-col>
          <a-col :span="4" class="table-cell">{{ formatPayType(order.payType) }}</a-col>
          <a-col :span="4" class="table-cell">{{ formatSourceType(order.sourceType) }}</a-col>
          <a-col :span="4" class="table-cell">{{ formatOrderType(order.orderType) }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="4" class="table-cell-title">配送方式</a-col>
          <a-col :span="4" class="table-cell-title">物流单号</a-col>
          <a-col :span="4" class="table-cell-title">自动确认收货时间</a-col>
          <a-col :span="4" class="table-cell-title">订单可得优币</a-col>
          <a-col :span="4" class="table-cell-title">订单可得成长值</a-col>
          <a-col :span="4" class="table-cell-title">活动信息</a-col>
        </a-row>
        <a-row>
          <a-col :span="4" class="table-cell">{{ formatNull(order.deliveryCompany) }}</a-col>
          <a-col :span="4" class="table-cell">{{ formatNull(order.deliverySn) }}</a-col>
          <a-col :span="4" class="table-cell">{{ order.autoConfirmDay }}天</a-col>
          <a-col :span="4" class="table-cell">{{ order.integration }}</a-col>
          <a-col :span="4" class="table-cell">{{ order.growth }}</a-col>
          <a-col :span="4" class="table-cell">
            <a-popover placement="top-start" title="活动信息" width="200" trigger="hover" :content="order.promotionInfo">
              <span slot="reference">{{ formatLongText(order.promotionInfo) }}</span>
            </a-popover>
          </a-col>
        </a-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon name="marker" style="vertical-align:middle"></svg-icon>
        <span class="font-small" style="vertical-align:middle">收货人信息</span>
      </div>
      <div class="table-layout">
        <a-row>
          <a-col :span="6" class="table-cell-title">收货人</a-col>
          <a-col :span="6" class="table-cell-title">手机号码</a-col>
          <a-col :span="6" class="table-cell-title">邮政编码</a-col>
          <a-col :span="6" class="table-cell-title">收货地址</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-cell">{{ order.receiverName }}</a-col>
          <a-col :span="6" class="table-cell">{{ order.receiverPhone }}</a-col>
          <a-col :span="6" class="table-cell">{{ order.receiverPostCode }}</a-col>
          <a-col :span="6" class="table-cell">{{ formatAddress(order) }} </a-col>
        </a-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon name="marker" style="vertical-align:middle"></svg-icon>
        <span class="font-small" style="vertical-align:middle">商品信息</span>
      </div>
      <a-table :columns="infoColumns" :data-source="order.orderItemList" style="width: 100%;margin-top: 20px" borderd>
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key === 'productPic'">
            <a-image :width="100" :src="record.productPic" />
          </template>
          <template v-else-if="column.key === 'productName'">
            <p>{{ record.productName }}</p>
            <p>品牌：{{ record.productBrand }}</p>
          </template>
          <template v-else-if="column.key === 'productSn'">
            <p>价格：￥{{ record.productPrice }}</p>
            <p>货号：{{ record.productSn }}</p>
          </template>
          <template v-else-if="column.key === 'productAttr'">
            {{ formatProductAttr(record.productAttr) }}
          </template>
          <template v-else-if="column.key === 'productPrice'">
            ￥{{ record.productPrice * record.productQuantity }}
          </template>
        </template>
      </a-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon name="marker" style="vertical-align:middle"></svg-icon>
        <span class="font-small" style="vertical-align:middle">费用信息</span>
      </div>
      <div class="table-layout">
        <a-row>
          <a-col :span="6" class="table-cell-title">商品合计</a-col>
          <a-col :span="6" class="table-cell-title">运费</a-col>
          <a-col :span="6" class="table-cell-title">优惠券</a-col>
          <a-col :span="6" class="table-cell-title">积分抵扣</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-cell">￥{{ order.totalAmount }}</a-col>
          <a-col :span="6" class="table-cell">￥{{ order.freightAmount }}</a-col>
          <a-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</a-col>
          <a-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-cell-title">活动优惠</a-col>
          <a-col :span="6" class="table-cell-title">折扣金额</a-col>
          <a-col :span="6" class="table-cell-title">订单总金额</a-col>
          <a-col :span="6" class="table-cell-title">应付款金额</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</a-col>
          <a-col :span="6" class="table-cell">-￥{{ order.discountAmount }}</a-col>
          <a-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalAmount + order.freightAmount }}</span>
          </a-col>
          <a-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount + order.freightAmount - order.discountAmount }}</span>
          </a-col>
        </a-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon name="marker" style="vertical-align:middle"></svg-icon>
        <span class="font-small" style="vertical-align:middle">操作信息</span>
      </div>
      <a-table style="margin-top: 20px;width: 100%" :columns="historyColumns" :data-source="order.historyList" borderd>
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key === 'orderStatus'">
            {{ formatStatus(order.status) }}
          </template>
          <template v-else-if="column.key === 'orderStatus2'">
            {{ formatPayStatus(order.status) }}
          </template>
          <template v-else-if="column.key === 'orderStatus3'">
            {{ formatDeliverStatus(order.status) }}
          </template>
          <template v-else-if="column.key === 'productSn'">
            <p>价格：￥{{ record.productPrice }}</p>
            <p>货号：{{ record.productSn }}</p>
          </template>
          <template v-else-if="column.key === 'productAttr'">
            {{ formatProductAttr(record.productAttr) }}
          </template>
          <template v-else-if="column.key === 'productPrice'">
            ￥{{ record.productPrice * record.productQuantity }}
          </template>
        </template>
      </a-table>
    </a-card>
    <ReceiverInfoModal :receiverAddress="(receiverInfo as any)" v-model:visible="receiverDialogVisible"
      v-if="receiverDialogVisible" @ok="handleReceiveOk" />
    <MoneyInfoModal :order="(order as any)" :money-info="(moneyInfo as any)" v-model:visible="moneyDialogVisible"
      v-if="moneyDialogVisible" @ok="handleMoneyOk" />
    <MessageModal v-model:visible="messageDialogVisible" @ok="handleMessgeOk" v-if="messageDialogVisible" />
    <CloseOrder :ids="closeModalIds" v-model:visible="closeDialogVisible" v-if="closeDialogVisible"
      @ok="handleCloseOk" />
    <MarkOrderModal :id="order.id" :status="order.status" v-model:visible="markOrderDialogVisible"
      v-if="markOrderDialogVisible" @ok="handleMarkOrderOk" />
    <LogisticsModal v-model:visible="logisticsDialogVisible" v-if="logisticsDialogVisible" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ReceiverInfoModal from './modals/ReceiverInfoModal.vue'
import MoneyInfoModal from './modals/MoneyInfoModal.vue'
import MessageModal from './modals/MessageModal.vue'
import CloseOrder from './modals/CloseOrder.vue';
import MarkOrderModal from './modals/MarkOrderModal.vue'
import LogisticsModal from './modals/LogisticsModal.vue'
import { _getOrderDetail, _updateReceiverInfo, _updateMoneyInfo, _closeOrder, _updateOrderNote, _deleteOrder } from '@/api/oms/orderApi'
import type { OrderDetailVo, ReceiverAddress, MoneyInfo } from '@/api/oms/orderApi'
import { Modal } from 'ant-design-vue'

const order = ref<OrderDetailVo>({} as any)
const receiverDialogVisible = ref<boolean>(false)
const moneyDialogVisible = ref<boolean>(false)
const messageDialogVisible = ref<boolean>(false)
const closeDialogVisible = ref<boolean>(false)
const markOrderDialogVisible = ref<boolean>(false)
const logisticsDialogVisible = ref<boolean>(false)
const closeModalIds = ref<Array<any>>([])
const receiverInfo = reactive<Partial<ReceiverAddress>>({})
const moneyInfo = reactive<Partial<MoneyInfo>>({})
const router = useRouter();
const orderId = router.currentRoute.value.query.id as any
if (orderId == undefined) {
  router.push({ name: 'order' })
}
const infoColumns = [
  {
    title: '商品图片',
    key: 'productPic',
    width: 100
  }, {
    title: '商品名称',
    key: 'productName',
    width: 100
  }, {
    title: '价格/货号',
    key: 'productSn',
    width: 100
  }, {
    title: '属性',
    key: 'productAttr',
    width: 100
  }, {
    title: '数量',
    key: 'productQuantity',
    dataIndex: 'productQuantity',
    width: 100
  }, {
    title: '小计',
    key: 'productPrice',
    width: 100
  }
]
const historyColumns = [
  {
    title: '操作者',
    key: 'operateMan',
    dataIndex: 'operateMan',
    width: 100
  }, {
    title: '操作时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 100
  }, {
    title: '订单状态',
    key: 'orderStatus',
    width: 100
  }, {
    title: '付款状态',
    key: 'orderStatus2',
    width: 100
  }, {
    title: '发货状态',
    key: 'orderStatus2',
    width: 100
  }, {
    title: '备注',
    key: 'note',
    dataIndex: 'note',
    width: 100
  }
]
const formatStepStatus = (value: number) => {
  if (value === 1) {
    //待发货
    return 1;
  } else if (value === 2) {
    //已发货
    return 2;
  } else if (value === 3) {
    //已完成
    return 3;
  } else {
    //待付款、已关闭、无限订单
    return 0;
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
const formatNull = (value: string) => {
  if (value === undefined || value === null || value === '') {
    return '暂无';
  } else {
    return value;
  }
}
const formatLongText = (value: string) => {
  if (value === undefined || value === null || value === '') {
    return '暂无';
  } else if (value.length > 8) {
    return value.substring(0, 8) + '...';
  } else {
    return value;
  }
}
const formatAddress = (order: OrderDetailVo) => {
  let str = order.receiverProvince;
  if (order.receiverCity != null) {
    str += "  " + order.receiverCity;
  }
  str += "  " + order.receiverRegion;
  str += "  " + order.receiverDetailAddress;
  return str;
}
const formatPayType = (value: number) => {
  if (value === 1) {
    return '支付宝';
  } else if (value === 2) {
    return '微信';
  } else {
    return '未支付';
  }
}
const formatSourceType = (value: number) => {
  if (value === 1) {
    return 'APP订单';
  } else {
    return 'PC订单';
  }
}
const formatOrderType = (value: number) => {
  if (value === 1) {
    return '秒杀订单';
  } else {
    return '正常订单';
  }
}
const formatProductAttr = (value: any) => {
  if (value == null) {
    return '';
  } else {
    let attr = JSON.parse(value);
    let result = '';
    for (let i = 0; i < attr.length; i++) {
      result += attr[i].key;
      result += ":";
      result += attr[i].value;
      result += ";";
    }
    return result;
  }
}
const formatPayStatus = (value: number) => {
  if (value === 0) {
    return '未支付';
  } else if (value === 4) {
    return '已退款';
  } else {
    return '已支付';
  }
}
const formatDeliverStatus = (value: number) => {
  if (value === 0 || value === 1) {
    return '未发货';
  } else {
    return '已发货';
  }
}
const showUpdateReceiverDialog = () => {
  receiverDialogVisible.value = true;
  Object.assign(receiverInfo, {
    orderId: order.value.id,
    receiverName: order.value.receiverName,
    receiverPhone: order.value.receiverPhone,
    receiverPostCode: order.value.receiverPostCode,
    receiverDetailAddress: order.value.receiverDetailAddress,
    receiverProvince: order.value.receiverProvince,
    receiverCity: order.value.receiverCity,
    receiverRegion: order.value.receiverRegion,
    status: order.value.status
  })
}
const showUpdateMoneyDialog = () => {
  moneyDialogVisible.value = true;
  moneyInfo.orderId = order.value.id;
  moneyInfo.freightAmount = order.value.freightAmount;
  moneyInfo.discountAmount = order.value.discountAmount;
  moneyInfo.status = order.value.status;
}
const showMessageDialog = () => {
  messageDialogVisible.value = true;
}
const showCloseOrderDialog = () => {
  closeDialogVisible.value = true;
  closeModalIds.value = [orderId];
}
const showMarkOrderDialog = () => {
  markOrderDialogVisible.value = true;
}
const showLogisticsDialog = () => {
  logisticsDialogVisible.value = true;
}
const getOrderDetail = () => {
  _getOrderDetail(orderId).then(res => {
    order.value = res.data;
  });
}
const handleReceiveOk = () => {
  getOrderDetail()
}
const handleMoneyOk = () => {
  getOrderDetail()
}
const handleMessgeOk = () => {
}
const handleCloseOk = () => {
  getOrderDetail()
}
const handleMarkOrderOk = () => {
  getOrderDetail()
}
const handleDeleteRecord = () => {
  Modal.confirm({
    title: "提示",
    content: "是否要进行该删除操作?",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      _deleteOrder([orderId]).then(res => {
        router.push({ name: 'order' })
      });
    },
  });

}
getOrderDetail()
</script>
<style lang="less" scoped>
.detail-container {
  width: 80%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #F2F6FC;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px
}

.table-layout {
  margin-top: 20px;
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


