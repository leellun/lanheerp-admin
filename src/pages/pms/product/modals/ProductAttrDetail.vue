<template>
  <div>
    <a-form :model="value" laba-width="120px" size="small">
      <a-form-item label="属性类型：">
        <a-select v-model:value="value.productAttributeCategoryId" placeholder="请选择属性类型"
          @change="(val: string) => handleProductAttrChange(val, false)" style="width:300px">
          <a-select-option v-for="item in productAttributeCategoryOptions" :key="item.id" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品规格：">
        <a-card shadow="never" class="cardBg">
          <a-form>
            <a-form-item v-for="(item, index) in productAttrs" :label="`${item.name}:`" :key="index">
              <a-select v-if="item.selectType === 1" v-model:value="item.value"
                v-for="(val) in item.inputList.split(',')" placeholder="请选择">
                <a-select-option :value="val">{{ val }}</a-select-option>
              </a-select>
              <a-checkbox-group v-if="item.selectType === 2" v-model:value="item.values"
                :options="item.inputList.split(',')" />
              <a-input v-else placeholder="请输入" v-model:value="item.value" />
            </a-form-item>
            <div style="">
              <a-button size="small" type="primary" @click="handleResetProductSku" style="margin-right:10px">
                <template #icon><undo-outlined /></template>
                重置
              </a-button>
              <a-button type="primary" size="small" @click="handleRefreshProductSkuList"><template #icon>
                  <plus-outlined />
                </template>新增</a-button>
            </div>
          </a-form>
        </a-card>
        <a-table :columns="columns" :data-source="value.skuStockList" style="margin-top:10px" :pagination="false"
          bordered>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.attr">
              {{ getProductSkuSp(record, column.key) }}
            </template>
            <template v-else-if="column.key === 'price'">
              <a-input v-model:value="record.price"></a-input>
            </template>
            <template v-else-if="column.key === 'stock'">
              <a-input v-model:value="record.stock"></a-input>
            </template>
            <template v-else-if="column.key === 'lowStock'">
              <a-input v-model:value="record.lowStock"></a-input>
            </template>
            <template v-else-if="column.key === 'skuCode'">
              <a-input v-model:value="record.skuCode"></a-input>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button type="text" @click="handleRemoveProductSku(index, record)">删除
              </a-button>
            </template>
          </template>
        </a-table>
        <a-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice">同步价格
        </a-button>
        <a-button type="primary" style="margin-top: 20px;margin-left: 10px;" @click="handleSyncProductSkuStock">同步库存
        </a-button>
      </a-form-item>
      <a-form-item label="属性图片：" v-if="value.productAttrPics.length > 0">
        <a-card>
          <a-form>
            <a-form-item v-for="(item, index) in value.productAttrPics" :label="`${item.name}:`" :key="index">
              <single-upload v-model:value="item.pic"
                style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
            </a-form-item>
          </a-form>
        </a-card>
      </a-form-item>
      <a-form-item label="商品参数：">
        <a-card>
          <a-form size="small" :labelCol="{ style: { width: '150px' } }">
            <a-form-item v-for="(item, index) in productParams" :label="`${item.name}:`" :key="index">
              <a-select v-if="item.selectType === 1" v-model:value="item.value" placeholder="请选择">
                <a-select-option v-for="(val) in item.inputList.split(',')" :value="val">{{ val }}</a-select-option>
              </a-select>
              <a-checkbox-group v-else-if="item.selectType === 2" v-model:value="item.values"
                :options="item.inputList.split(',')" />
              <a-input v-else placeholder="请输入" v-model:value="item.value" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-form-item>
      <a-form-item label="商品相册：">
        <multi-upload v-model:value="selectProductPics"></multi-upload>
      </a-form-item>
      <a-form-item label="规格参数：">
        <a-tabs v-model:activeKey="activeHtmlName" type="card">
          <a-tab-pane key="pc" tab="电脑端详情">
            <tinymce :width="595" :height="300" v-model:value="value.detailHtml"></tinymce>
          </a-tab-pane>
          <a-tab-pane key="mobile" tab="移动端详情">
            <tinymce :width="595" :height="300" v-model:value="value.detailMobileHtml"></tinymce>
          </a-tab-pane>
        </a-tabs>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-button @click="handlePrev">上一步，填写商品促销</a-button>
        <a-button type="primary" @click="handleNext" style="margin-left:15px">下一步，选择商品关联</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { _getTotalAttributeCategory } from '@/api/pms/productAttrCateApi'
import { _getProductCateAttribute } from '@/api/pms/productAttrApi'
import type { ProductDto, ProductAttrPic, ProductAttributeValue } from '@/api/pms/productApi'
import type { ProductAttributeCategory } from '@/api/pms/productAttrCateApi'
import type { SkuStock } from '@/api/pms/skuStockApi'
import type { ProductAttribute } from '@/api/pms/productAttrApi'
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import MultiUpload from '@/components/Upload/MultiUpload.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import { message, Modal } from 'ant-design-vue'
import { cloneDeep } from "lodash";
interface OptionAttribute extends ProductAttribute {
  values: Array<string>
  value: string | undefined
}
const emit = defineEmits(["nextStep", "prevStep"])
const props = withDefaults(defineProps<{
  value: ProductDto
}>(), {
})
//商品属性分类下拉选项
const productAttributeCategoryOptions = ref<Array<ProductAttributeCategory>>([])
//商品属性
const productAttrs = ref<Array<OptionAttribute>>([])
//商品参数
const productParams = ref<Array<OptionAttribute>>([])
//相册
const selectProductPics = computed<Array<string>>({
  get() {
    return (props.value.albumPics == undefined || props.value.albumPics == null) ? [] : props.value.albumPics.split(",")
  },
  set(newValue) {
    props.value.albumPics = newValue.join(",")
  }
});
//商品富文本详情激活类型
const activeHtmlName = ref<string>('pc')

const findProductAttribute = (key: string): OptionAttribute | null => {
  for (let attr of productAttrs.value) {
    if (attr.name === key) {
      return attr
    }
  }
  return null
}
const findProductAttrPic = (key: string): Partial<ProductAttrPic> | null => {
  for (let attrPic of props.value.productAttrPics) {
    if (attrPic.name === key) {
      return attrPic
    }
  }
  return null
}
const refreshProductAttrPics = () => {
  let sptDataStr = props.value.skuStockList[0].spData
  let sptData = JSON.parse(sptDataStr)
  let attrPics = new Array<ProductAttrPic>()
  sptData.forEach((item: any) => {
    let attr = findProductAttribute(item.key)
    if (attr != null && attr.hasPic === 1) {
      let attrPic = findProductAttrPic(item.key)
      if (attrPic === null) {
        attrPics.push({
          name: item.key,
          productAttributeId: attr.id,
          pic: undefined,
          value: item.value
        } as any)
      } else {
        attrPics.push(attrPic as any)
      }
    }
  })
  props.value.productAttrPics = attrPics
}
const getProductAttrCateList = () => {
  _getTotalAttributeCategory().then(res => {
    productAttributeCategoryOptions.value = res.data;
  })
}
const getProductAttrList = (cid: string, type: number) => {
  _getProductCateAttribute(cid, type).then(res => {
    if (type === 0) {
      productAttrs.value = res.data as OptionAttribute[]
      refreshProductSkuList()
    } else {
      productParams.value = res.data as OptionAttribute[]
      if (props.value.productAttributeValueList.length > 0) {
        productParams.value.forEach(item => {
          let attr = props.value.productAttributeValueList.find(ii => ii.productAttributeId == item.id)
          if (item != undefined) {
            if (item.selectType === 2) {
              item.values = attr?.value.split(",") as Array<string>
            } else {
              item.value = attr?.value
            }
          }
        })
      }
    }
  })
}
const mergeProductAttr = () => {
  let attrValues = new Array<ProductAttributeValue>();
  for (var i = 0; i < props.value.skuStockList.length; i++) {
    let sptDataStr = props.value.skuStockList[i].spData
    let sptData = JSON.parse(sptDataStr) as Array<any>
    if (i === 0) {
      sptData.forEach(spItem => {
        let attr = findProductAttribute(spItem.key)
        if (attr != null) {
          attrValues.push({
            productAttributeId: attr.id,
            value: spItem.value
          })
        }
      })
    } else {
      for (var j = 0; j < sptData.length; j++) {
        let spItem = sptData[j];
        let attrValue = attrValues[j]
        if (attrValue.value != undefined && attrValue.value.split(",").indexOf(spItem.value) == -1) {
          attrValue.value = attrValue.value + "," + spItem.value
        }
      }
    }
  }
  if (productParams.value != undefined) {
    productParams.value.forEach(item => {
      if (item.value != undefined || item.values != undefined) {
        attrValues.push({
          productAttributeId: item.id,
          value: item.selectType === 2 ? item.values.join(",") : (item.value as string)
        })
      }
    })
  }

  props.value.productAttributeValueList = attrValues
}
getProductAttrCateList()
const handlePrev = () => {
  mergeProductAttr()
  emit('prevStep')
}
const handleNext = () => {
  mergeProductAttr()
  emit('nextStep')
}
const handleRemoveProductSku = (index: number, row: SkuStock) => {
  let list = props.value.skuStockList;
  if (list.length === 1) {
    list.pop();
  } else {
    list.splice(index, 1);
  }
}
const fixed_columns = [
  {
    title: '销售价格',
    key: 'price',
    dataIndex: 'price',
    width: 100
  }, {
    title: '商品库存',
    dataIndex: 'stock',
    key: 'stock',
    width: 100
  }, {
    title: '库存预警值',
    dataIndex: 'lowStock',
    key: 'lowStock',
    width: 100
  }, {
    title: 'SKU编号',
    dataIndex: 'skuCode',
    key: 'skuCode',
    width: 100
  }, {
    title: '操作',
    fixed: 'right',
    width: 180,
    key: 'action'
  }
];
const columns = ref([
  ...fixed_columns
])
const handleSyncProductSkuPrice = () => {
  Modal.confirm({
    title: "提示",
    content: "将同步第一个sku的价格到所有sku,是否继续",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      for (let i = 1; i < props.value.skuStockList.length; i++) {
        props.value.skuStockList[i].price = props.value.skuStockList[0].price
      }
    },
  });

}
const handleSyncProductSkuStock = () => {
  Modal.confirm({
    title: "提示",
    content: "将同步第一个sku的库存到所有sku,是否继续",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      for (let i = 1; i < props.value.skuStockList.length; i++) {
        props.value.skuStockList[i].stock = props.value.skuStockList[0].stock
      }
    },
  });
}
const handleProductAttrChange = (val: string, edit: boolean) => {
  if (val === null || val === undefined) {
    productAttrs.value = []
    productParams.value = []
    props.value.productAttrPics = []
  } else {
    getProductAttrList(val, 0)
    getProductAttrList(val, 1)
    if (!edit) {
      props.value.productAttrPics = []
      props.value.productAttributeValueList = []
      props.value.skuStockList = []
    }
  }
}
const getProductSkuSp = (row: any, key: string) => {
  let spData = JSON.parse(row.spData);
  if (spData != null) {
    let item = spData.find((ii: any) => ii.key === key)
    return item != undefined ? item.value : null
  } else {
    return null;
  }
}
const handleResetProductSku = () => {
  productAttrs.value.forEach(item => {
    item.value = undefined
    item.values = []
  })
}
const handleRefreshProductSkuList = () => {
  var skuStocks = new Array<SkuStock | any>()
  var skuColumns = new Array<any>()
  for (let i = 0; i < productAttrs.value.length; i++) {
    let productAttr = productAttrs.value[i]
    skuColumns.push({
      title: productAttr.name,
      key: productAttr.name,
      attr: true,
      width: 100
    })

    if (skuStocks.length === 0) {
      if (productAttr.selectType === 2) {
        productAttr.values.forEach(value => {
          skuStocks.push({
            spData: [{ key: productAttr.name, value: value }]
          })
        })
      } else {
        skuStocks.push({
          spData: [{ key: productAttr.name, value: productAttr.value }]
        })
      }
    } else {
      var index = 0
      while (index < skuStocks.length) {
        if (productAttr.selectType === 2) {
          let preSku = cloneDeep(skuStocks[index])
          skuStocks[index].spData.push({ key: productAttr.name, value: productAttr.values[0] })
          index++
          for (var d = 1; d < productAttr.values.length; d++) {
            let sku = cloneDeep(preSku)
            sku.spData.push({ key: productAttr.name, value: productAttr.values[d] })
            skuStocks.splice(index, 0, sku)
            index++
          }
        } else {
          skuStocks[index].spData.push({ key: productAttr.name, value: productAttr.value })
          index++
        }
      }
    }
  }
  for (let i = 0; i < skuStocks.length; i++) {
    skuStocks[i].spData = JSON.stringify(skuStocks[i].spData)
    let findItem = props.value.skuStockList.find(ii => ii.spData === skuStocks[i].spData)
    if (findItem != undefined) {
      skuStocks[i] = findItem
    }
  }
  props.value.skuStockList = skuStocks as Array<SkuStock>
  skuColumns.push(...fixed_columns)
  columns.value = skuColumns
  refreshProductAttrPics()
  productAttrs.value.forEach(item => {
    item.value = undefined
    item.values = []
  })
}
const refreshProductSkuList=()=>{
  if(props.value.skuStockList.length==0)return;
  var skuColumns = new Array<any>()
  var sptDataStr = props.value.skuStockList[0].spData
  var sptData = JSON.parse(sptDataStr)
  sptData.forEach((ii:any)=>{
    skuColumns.push({
      title: ii.key,
      key: ii.key,
      attr: true,
      width: 100
    })
  })
  skuColumns.push(...fixed_columns)
  columns.value = skuColumns
  refreshProductAttrPics()
}
if (props.value.productAttributeCategoryId != undefined && props.value.productAttributeCategoryId != null) {
  handleProductAttrChange(props.value.productAttributeCategoryId, true)
}
</script>

<style style="less" scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px
}

.cardBg {
  background: #F8F9FC;
}
</style>
