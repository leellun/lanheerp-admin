<template>
  <div>
    <a-form :model="value" :labelCol="{ style: { width: '150px' } }" style="width: 720px">
      <a-form-item label="赠送积分：">
        <a-input v-model="value.giftPoint"></a-input>
      </a-form-item>
      <a-form-item label="赠送成长值：">
        <a-input v-model="value.giftGrowth"></a-input>
      </a-form-item>
      <a-form-item label="积分购买限制：">
        <a-input v-model="value.usePointLimit"></a-input>
      </a-form-item>
      <a-form-item label="预告商品：">
        <a-switch v-model="value.previewStatus" :active-value="1" :inactive-value="0">
        </a-switch>
      </a-form-item>
      <a-form-item label="商品上架：">
        <a-switch v-model="value.publishStatus" :active-value="1" :inactive-value="0">
        </a-switch>
      </a-form-item>
      <a-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <a-switch v-model="value.newStatus" :active-value="1" :inactive-value="0">
        </a-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <a-switch v-model="value.recommendStatus" :active-value="1" :inactive-value="0">
        </a-switch>
      </a-form-item>
      <a-form-item label="服务保证：">
        <a-checkbox-group v-model:value="selectServiceList" name="checkboxgroup" :options="serviceOptions" />
      </a-form-item>
      <a-form-item label="详细页标题：">
        <a-input v-model="value.detailTitle"></a-input>
      </a-form-item>
      <a-form-item label="详细页描述：">
        <a-input v-model="value.detailDesc"></a-input>
      </a-form-item>
      <a-form-item label="商品关键字：">
        <a-input v-model="value.keywords"></a-input>
      </a-form-item>
      <a-form-item label="商品备注：">
        <a-input v-model="value.note" type="textarea" :autoSize="true"></a-input>
      </a-form-item>
      <a-form-item label="选择优惠方式：">
        <a-select v-model:value="value.promotionType" size="small" style="width: 200px" placeholder="请选择">
          <a-select-option :value="0">无优惠</a-select-option>
          <a-select-option :value="1">特惠促销</a-select-option>
          <a-select-option :value="2">会员价格</a-select-option>
          <a-select-option :value="3">阶梯价格</a-select-option>
          <a-select-option :value="4">满减价格</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="value.promotionType === 1">
        <a-range-picker size="small" v-model:value="timeRangeRef" name="gmtCreate" style="width: 100%"
          :placeholder="['开始时间', '结束时间']" />
        <div class="littleMargin">
          促销价格：
          <a-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格"></a-input>
        </div>

      </a-form-item>
      <a-form-item v-show="value.promotionType === 2">
        <div v-for="(item, index) in value.memberPriceList" :class="{ littleMargin: index !== 0 }">
          {{ item.memberLevelName }}：
          <a-input v-model="item.memberPrice" style="width: 200px"></a-input>
        </div>
      </a-form-item>
      <a-form-item v-show="value.promotionType === 3">
        <a-table :columns="productLadderColumns" :data-source="value.productLadderList" :pagination="false" bordered>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column === 'count'">
              <a-input-number v-model="record.count"></a-input-number>
            </template>
            <template v-else-if="column === 'discount'">
              <a-input-number v-model="record.discount"></a-input-number>
            </template>
            <template v-else-if="column === 'action'">
              <span>
                <a @click="(e?: Event) => handleRemoveProductLadder(index, record)">删除</a>
                <a-divider type="vertical" />
                <a @click="(e?: Event) => handleAddProductLadder(index, record)">添加</a>
              </span>
            </template>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item v-show="value.promotionType === 4">
        <a-table :columns="productFullReductionColumns" :data-source="value.productFullReductionList"
          :pagination="false" bordered>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column === 'fullPrice'">
              <a-input-number v-model="record.fullPrice"></a-input-number>
            </template>
            <template v-else-if="column === 'reducePrice'">
              <a-input-number v-model="record.reducePrice"></a-input-number>
            </template>
            <template v-else-if="column === 'action'">
              <span>
                <a @click="(e?: Event) => handleRemoveFullReduction(index, record)">删除</a>
                <a-divider type="vertical" />
                <a @click="(e?: Event) => handleAddFullReduction(index, record)">添加</a>
              </span>
            </template>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-button size="medium" @click="handlePrev">上一步，填写商品信息</a-button>
        <a-button type="primary" size="medium" @click="handleNext" style="margin-left:10px">下一步，填写商品属性</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Dayjs } from 'dayjs';
import { _getMemberLevels } from '@/api/pms/memberLevelApi'
import type { MemberPrice, ProductDto, ProductLadder, ProductFullReduction } from '@/api/pms/productApi'
import { message } from 'ant-design-vue';
type RangeValue = [Dayjs, Dayjs];
const emit = defineEmits(['prevStep', 'nextStep'])
const props = withDefaults(defineProps<{
  value: ProductDto,
  isEdit: boolean
}>(), {
  isEdit: false
})
const timeRangeRef = ref<RangeValue>()
const getMemberLevels = (defaultStatus: number = 0) => {
  _getMemberLevels(defaultStatus).then(res => {
    let memberPriceList = new Array<MemberPrice | any>();
    for (let i = 0; i < res.data.length; i++) {
      let item = res.data[i];
      memberPriceList.push({ memberLevelId: item.id, memberLevelName: item.name })
    }
    props.value.memberPriceList = memberPriceList as Array<MemberPrice>;
  })
}
const handlePrev = () => {
  emit('prevStep')
}
const handleNext = () => {
  emit('nextStep')
}
const productLadderColumns = [
  {
    title: '数量',
    key: 'count',
    width: 100
  }, {
    title: '折扣',
    key: 'discount',
    width: 60
  }, {
    title: '操作',
    fixed: 'right',
    width: 180,
    key: 'action'
  }
];
const productFullReductionColumns = [
  {
    title: '满',
    key: 'fullPrice',
    width: 100
  }, {
    title: '立减',
    key: 'reducePrice',
    width: 60
  }, {
    title: '操作',
    fixed: 'right',
    width: 180,
    key: 'action'
  }
];

const handleRemoveProductLadder = (index: number, row: ProductLadder) => {
  let productLadderList = props.value.productLadderList;
  if (productLadderList?.length === 1) {
    productLadderList.pop();
    productLadderList.push({
      count: 0,
      discount: 0,
      price: 0
    } as ProductLadder)
  } else {
    productLadderList?.splice(index, 1);
  }
}
const handleAddProductLadder = (index: number, row: ProductLadder) => {
  let productLadderList = props.value.productLadderList;
  if (productLadderList?.length < 3) {
    productLadderList?.push({
      count: 0,
      discount: 0,
      price: 0
    } as ProductLadder)
  } else {
    message.warning('最多只能添加三条')
  }
}
const handleRemoveFullReduction = (index: number, row: ProductFullReduction | any) => {
  let fullReductionList = props.value.productFullReductionList;
  if (fullReductionList?.length === 1) {
    fullReductionList.pop();
    fullReductionList.push({
      fullPrice: 0,
      reducePrice: 0
    } as ProductFullReduction);
  } else {
    fullReductionList?.splice(index, 1);
  }
}
const handleAddFullReduction = (index: number, row: ProductFullReduction | any) => {
  let fullReductionList = props.value.productFullReductionList;
  if (fullReductionList?.length < 3) {
    fullReductionList.push({
      fullPrice: 0,
      reducePrice: 0
    } as ProductFullReduction);
  } else {
    message.warning('最多只能添加三条')
  }
}
const serviceOptions = [{ label: '无忧退货', value: 1 },
{ label: '快速退款', value: 2 },
{ label: '免费包邮', value: 3 }]
//选中的服务保证
const selectServiceList = computed({
  get() {
    let list: Array<number> = [];
    if (props.value.serviceIds === undefined || props.value.serviceIds == null || props.value.serviceIds === '') return list;
    let ids = props.value.serviceIds.split(',');
    for (let i = 0; i < ids.length; i++) {
      list.push(Number(ids[i]));
    }
    return list;
  },
  set(newValue) {
    let serviceIds = '';
    if (newValue != null && newValue.length > 0) {
      for (let i = 0; i < newValue.length; i++) {
        serviceIds += newValue[i] + ',';
      }
      if (serviceIds.endsWith(',')) {
        serviceIds = serviceIds.substr(0, serviceIds.length - 1)
      }
      props.value.serviceIds = serviceIds;
    } else {
      props.value.serviceIds = '';
    }
  }
})
</script>

<style scoped>

</style>
