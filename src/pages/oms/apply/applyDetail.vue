<template>
  <div class="main-container">
    <a-card>
      <span class="font-title-medium">退货商品</span>
      <a-table borderd :columns="columns" :data-source="productList">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'productPic'">
            <a-image :width="100" :src="record.productPic" />
          </template>
          <template v-else-if="column.key === 'productName'">
            <span class="font-small">{{ record.productName }}</span><br>
            <span class="font-small">品牌：{{ record.productBrand }}</span>
          </template>
          <template v-else-if="column.key === 'productRealPrice'">
            <span class="font-small">价格：￥{{ record.productRealPrice }}</span><br>
            <span class="font-small">货号：NO.{{ record.productId }}</span>
          </template>
          <template v-else-if="column.key === 'totalAmount'">
            ￥{{ totalAmount }}
          </template>
        </template>
      </a-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{ totalAmount }}</span>
      </div>
    </a-card>
    <a-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <a-row>
          <a-col :span="6" class="form-border form-left-bg font-small">服务单号</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.id }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">申请状态</a-col>
          <a-col class="form-border font-small" :span="18">{{ formatStatus(orderReturnApply.status) }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">订单编号
          </a-col>
          <a-col class="form-border font-small" :span="18" style="height:50px">
            {{ orderReturnApply.orderSn }}
            <a-button type="text" size="small" @click="handleViewOrder">查看</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">申请时间</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.createTime }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">用户账号</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.memberUsername }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">联系人</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.returnName }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">联系电话</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.returnPhone }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">退货原因</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.reason }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">问题描述</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.description }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">凭证图片
          </a-col>
          <a-col class="form-border font-small" :span="18" style="height:100px">
            <img v-for="item in proofPics" style="width:80px;height:80px" :src="item">
          </a-col>
        </a-row>
      </div>
      <div class="form-container-border">
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">订单金额</a-col>
          <a-col class="form-border font-small" :span="18">￥{{ totalAmount }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">确认退款金额
          </a-col>
          <a-col class="form-border font-small" style="height:52px" :span="18">
            ￥
            <a-input size="small" v-model:value="updateStatusParam.returnAmount" :disabled="orderReturnApply.status !== 0"
              style="width:200px;margin-left: 10px"></a-input>
          </a-col>
        </a-row>
        <div v-show="orderReturnApply.status !== 3">
          <a-row>
            <a-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">选择收货点
            </a-col>
            <a-col class="form-border font-small" style="height:52px" :span="18">
              <a-select size="small" style="width:200px" :disabled="orderReturnApply.status !== 0"
                v-model:value="updateStatusParam.companyAddressId">
                <a-select-option v-for="address in companyAddressList" :key="address.id" :value="address.id">{{address.addressName}}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="form-border form-left-bg font-small" :span="6">收货人姓名</a-col>
            <a-col class="form-border font-small" :span="18">{{ currentAddress.name }}</a-col>
          </a-row>
          <a-row>
            <a-col class="form-border form-left-bg font-small" :span="6">所在区域</a-col>
            <a-col class="form-border font-small" :span="18">{{ formatRegion(currentAddress) }}</a-col>
          </a-row>
          <a-row>
            <a-col class="form-border form-left-bg font-small" :span="6">详细地址</a-col>
            <a-col class="form-border font-small" :span="18">{{ currentAddress.detailAddress }}</a-col>
          </a-row>
          <a-row>
            <a-col class="form-border form-left-bg font-small" :span="6">联系电话</a-col>
            <a-col class="form-border font-small" :span="18">{{ currentAddress.phone }}</a-col>
          </a-row>
        </div>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status !== 0">
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">处理人员</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.handleMan }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">处理时间</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.handleTime }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">处理备注</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.handleNote }}</a-col>
        </a-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status === 2">
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">收货人员</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.receiveMan }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">收货时间</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.receiveTime }}</a-col>
        </a-row>
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6">收货备注</a-col>
          <a-col class="form-border font-small" :span="18">{{ orderReturnApply.receiveNote }}</a-col>
        </a-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status === 0">
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">处理备注</a-col>
          <a-col class="form-border font-small" :span="18">
            <a-input size="small" v-model:value="updateStatusParam.handleNote"
              style="width:200px;margin-left: 10px"></a-input>
          </a-col>
        </a-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status === 1">
        <a-row>
          <a-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">收货备注</a-col>
          <a-col class="form-border font-small" :span="18">
            <a-input size="small" v-model:value="updateStatusParam.receiveNote"
              style="width:200px;margin-left: 10px"></a-input>
          </a-col>
        </a-row>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status === 0">
        <a-button type="primary" size="small" @click="handleUpdateStatus(1)">确认退货</a-button>
        <a-button type="danger" size="small" @click="handleUpdateStatus(3)">拒绝退货</a-button>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status === 1">
        <a-button type="primary" size="small" @click="handleUpdateStatus(2)">确认收货</a-button>
      </div>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getApplyDetail, _updateApplyStatus } from '@/api/oms/returnApplyApi';
import type { OrderReturnApply } from '@/api/oms/returnApplyApi';
import { _getCompanyAddresList } from '@/api/oms/companyAddressApi';
import type { CompanyAddress } from '@/api/oms/companyAddressApi';
import { Modal } from 'ant-design-vue';
const router = useRouter()
const id = router.currentRoute.value.query.id as string
const columns = [
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
    key: 'productRealPrice',
    width: 100
  }, {
    title: '属性',
    dataIndex: 'productAttr',
    key: 'productAttr',
    width: 100
  }, {
    title: '数量',
    dataIndex: 'productCount',
    key: 'productCount',
    width: 100
  }, {
    title: '小计',
    key: 'totalAmount',
    width: 100
  }, {
    title: '操作',
    fixed: 'right',
    width: 180,
    key: 'action'
  }
];
const orderReturnApply = reactive<OrderReturnApply>({} as any)
const updateStatusParam = reactive<any>({
  companyAddressId: null,
  handleMan: 'admin',
  handleNote: null,
  receiveMan: 'admin',
  receiveNote: null,
  returnAmount: 0,
  status: 0
})
const productList = ref<Array<any>>([])
const proofPics = ref<Array<string>>([])
const companyAddressList = ref<Array<CompanyAddress>>([])
const totalAmount = computed(() => {
  if (orderReturnApply != null) {
    return orderReturnApply.productRealPrice * orderReturnApply.productCount;
  } else {
    return 0;
  }
})
const currentAddress = computed<CompanyAddress>(() => {
  let id = updateStatusParam.companyAddressId;
  if (companyAddressList.value == null) return {};
  for (let i = 0; i < companyAddressList.value.length; i++) {
    let address = companyAddressList.value[i];
    if (address.id === id) {
      return address;
    }
  }
  return {} as any;
})
const formatStatus = (status: number) => {
  if (status === 0) {
    return "待处理";
  } else if (status === 1) {
    return "退货中";
  } else if (status === 2) {
    return "已完成";
  } else {
    return "已拒绝";
  }
}
const formatRegion = (address: any) => {
  let str = address.province;
  if (address.city != null) {
    str += "  " + address.city;
  }
  str += "  " + address.region;
  return str;
}
const handleViewOrder = () => {
  router.push({ name: 'returnApplyDetail', query: { id: orderReturnApply.orderId } });
}
const getCompanyAddressList = () => {
  _getCompanyAddresList().then(res => {
    companyAddressList.value = res.data;
    for (let i = 0; i < companyAddressList.value.length; i++) {
      if (companyAddressList.value[i].receiveStatus === 1 && orderReturnApply.status === 0) {
        updateStatusParam.companyAddressId = companyAddressList.value[i].id;
      }
    }
  });
}
const getDetail = () => {
  _getApplyDetail(id).then(res => {
    Object.assign(orderReturnApply, res.data)
    productList.value = [orderReturnApply];
    if (orderReturnApply.proofPics != null) {
      proofPics.value = orderReturnApply.proofPics.split(",")
    }
    //退货中和完成
    if (orderReturnApply.status === 1 || orderReturnApply.status === 2) {
      updateStatusParam.returnAmount = orderReturnApply.returnAmount;
      updateStatusParam.companyAddressId = orderReturnApply.companyAddressId;
    }
    getCompanyAddressList();
  });
}
const handleUpdateStatus = (status: number) => {
  updateStatusParam.status = status;
  Modal.confirm({
    title: "提示",
    content: "是否要进行此操作?",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      _updateApplyStatus(id, updateStatusParam).then(response => {
        getDetail()
      });
    },
  });
}
getDetail()
</script>
<style scoped>
.detail-container {
  position: absolute;
  left: 0;
  right: 0;
  width: 1080px;
  padding: 35px 35px 15px 35px;
  margin: 20px auto;
}

.standard-margin {
  margin-top: 15px;
}

.form-border {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
}

.form-container-border {
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
  margin-top: 15px;
}

.form-left-bg {
  background: #F2F6FC;
}
</style>


