<template>
    <a-modal v-model:visible="modalVisible" title="选择商品" @ok="handleOk" @cancel="handleCancel" style="width:750px">
        <a-input-search v-model:value="form.keyword" placeholder="商品名称搜索" enter-button @search="handleSelectSearch" />
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" :scroll="{ x: 580 }"
            @change="handleTableChange" :row-selection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}">

        </a-table>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import type { ProductSearchDto, Product } from '@/api/pms/productApi'
import { _productList } from '@/api/pms/productApi'
import type { FlashPromotionProductRelation } from '@/api/sms/flashProductRelationApi'
import { _createFlashProductRelation } from '@/api/sms/flashProductRelationApi'
import { message, Modal } from 'ant-design-vue'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const data = ref<Array<Product | any>>([]);
const pagination = reactive<any>({ pageSize: 5, current: 1 })
const loading = ref<boolean>(false)
const selectedRowKeys = ref<string[]>([]);
const props = withDefaults(defineProps<{
    visible: boolean,
    flashPromotionId: any,
    flashPromotionSessionId: any,
}>(), {
    visible: false
})
const modalVisible = computed<boolean>({
    get() {
        return props.visible
    },
    set(val) {
        emit("update:visible", val)
    }
})
const columns = [
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '货号', dataIndex: 'productSn', key: 'productSn', width: 100 },
    { title: '价格', dataIndex: 'price', key: 'price', width: 100 },
];
const form = reactive<Partial<ProductSearchDto>>({
    pageNo: 1,
    pageSize: 5,
    keyword: undefined
})
const handleSelectSearch = () => {
    loading.value = true
    form.pageSize = pagination.pageSize
    _productList(form as any).then(res => {
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
    form.pageNo = page.current
    handleSelectSearch();
}
const onSelectChange = (keys: string[]) => {
    selectedRowKeys.value = keys;
};
const handleOk = () => {
    if (selectedRowKeys.value.length < 1) {
        message.warning('请选择一条记录')
        return;
    }
    let selectProducts: Array<FlashPromotionProductRelation | any> = [];
    selectedRowKeys.value.forEach(productId => {
        selectProducts.push({
            productId,
            flashPromotionId: props.flashPromotionId,
            flashPromotionSessionId: props.flashPromotionSessionId
        });
    })
    Modal.confirm({
        title: "提示",
        content: "使用要进行添加操作?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _createFlashProductRelation(selectProducts).then(res => {
                emit("update:visible", false)
                emit("ok")
            });
        },
    });
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
handleSelectSearch()
</script>
<style lang="less" scoped>

</style>