<template>
  <div>
    <a-form :model="value" :labelCol="{ style: { width: '150px' } }" style="width: 720px">
      <a-form-item label="商品分类：" v-bind="validateInfos.productCategoryId">
        <a-tree-select v-model:value="value.productCategoryId" style="width: 100%" placeholder="请选择..."
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="productCateOptions">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="商品名称：" v-bind="validateInfos.name">
        <a-input placeholder="请输入菜单标题" v-model:value="value.name" />
      </a-form-item>
      <a-form-item label="副标题：" v-bind="validateInfos.subTitle">
        <a-input v-model:value="value.subTitle"></a-input>
      </a-form-item>
      <a-form-item label="商品品牌：" v-bind="validateInfos.brandId">
        <a-select v-model:value="value.brandId" @change="handleBrandChange" placeholder="请选择品牌">
          <a-select-option v-for="item in brandOptions" :key="item.id" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品介绍：" v-bind="validateInfos.description">
        <a-input :autoSize="true" v-model:value="value.description" type="textarea" placeholder="请输入内容"></a-input>
      </a-form-item>
      <a-form-item label="商品货号：">
        <a-input v-model:value="value.productSn"></a-input>
      </a-form-item>
      <a-form-item label="商品售价：">
        <a-input-number v-model:value="value.price" style="width: 200px"></a-input-number>
        <span style="margin-left: 20px">元</span>
      </a-form-item>
      <a-form-item label="市场价：">
        <a-input-number v-model:value="value.originalPrice" style="width: 200px"></a-input-number>
        <span style="margin-left: 20px">元</span>
      </a-form-item>
      <a-form-item label="商品库存：">
        <a-input-number v-model:value="value.stock" style="width: 200px"></a-input-number>
      </a-form-item>
      <a-form-item label="计量单位：">
        <a-input v-model:value="value.unit" style="width: 200px"></a-input>
      </a-form-item>
      <a-form-item label="商品重量：">
        <a-input-number v-model:value="value.weight" style="width: 200px"></a-input-number>
        <span style="margin-left: 20px">克</span>
      </a-form-item>
      <a-form-item label="排序">
        <a-input-number v-model:value="value.sort" style="width: 200px"></a-input-number>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-button type="primary" size="medium" @click="handleNext">下一步，填写商品促销</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, TreeSelectProps, Form } from 'ant-design-vue';
import { _fetchListWithChildren } from '@/api/pms/productCateApi'
import { _getAllBrandList } from '@/api/pms/brandApi'
import type { ProductDto } from '@/api/pms/productApi'
import type { Brand } from '@/api/pms/brandApi'
const props = withDefaults(defineProps<{
  value: ProductDto
}>(), {
})
const useForm = Form.useForm
const emit = defineEmits(['nextStep'])
//商品属性分类下拉选项
const productCateOptions = ref<TreeSelectProps['treeData']>([]);
const brandOptions = ref<Array<Brand>>([])
const rulesRef = reactive({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  subTitle: [{ required: true, message: '请输入商品副标题', trigger: 'blur' }],
  productCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
  brandId: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }]
})
const { validate, validateInfos } = useForm(props.value, rulesRef)
const getBrandList = () => {
  _getAllBrandList().then(res => {
    brandOptions.value = res.data
  })
}
const getProductCateList = () => {
  _fetchListWithChildren().then(res => {
    let list = res.data;
    productCateOptions.value = [];
    for (let i = 0; i < list.length; i++) {
      let children = [];
      if (list[i].children != null && list[i].children.length > 0) {
        for (let j = 0; j < list[i].children.length; j++) {
          children.push({ title: list[i].children[j].name, key: list[i].children[j].id, value: list[i].children[j].id });
        }
      }
      productCateOptions.value.push({ title: list[i].name, key: list[i].id, value: list[i].id, children: children });
    }
  });
}
const handleBrandChange = (val: string) => {
  let brandName = '';
  for (let i = 0; i < brandOptions.value.length; i++) {
    if (brandOptions.value[i].id === val) {
      brandName = brandOptions.value[i].name;
      break;
    }
  }
  props.value.brandName = brandName;
}
const handleNext = () => {
  validate().then(async () => {
    emit('nextStep')
  })
}
getProductCateList()
getBrandList()
</script>

<style scoped>

</style>
