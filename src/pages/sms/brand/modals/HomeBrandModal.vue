<template>
    <a-modal v-model:visible="modalVisible" title="选择品牌" @ok="handleOk" @cancel="handleCancel" style="width:750px">
        <a-input-search v-model:value="form.keyword" placeholder="品牌名称搜索" enter-button @search="handleSelectSearch" />
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" :scroll="{ x: 580 }"
            @change="handleTableChange" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'productCount'">
                    商品：<span>{{ record.productCount }}</span>
                    评价：<span>{{ record.productCommentCount }}</span>
                </template>
            </template>
        </a-table>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { _getBrandList } from '@/api/pms/brandApi'
import { _createHomeBrand } from '@/api/sms/HomeBrandApi';
import type { Brand, BrandSearch } from '@/api/pms/brandApi'
import type { HomeBrand } from '@/api/sms/HomeBrandApi'
import { message, Modal } from 'ant-design-vue'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const data = ref<Array<Brand | any>>([]);
const pagination = reactive<any>({ pageSize: 5, current: 1 })
const loading = ref<boolean>(false)
const selectedRowKeys = ref<string[]>([]);
const selectedBrandRows = ref<Brand[]>([]);
const props = withDefaults(defineProps<{
    visible: boolean
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
    { title: '品牌名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '相关', key: 'productCount', width: 100 },
];
const form = reactive<Partial<BrandSearch>>({
    pageNo: 1,
    pageSize: 5,
    keyword: undefined
})
const handleSelectSearch = () => {
    loading.value = true
    form.pageSize = pagination.pageSize
    _getBrandList(form as any).then(res => {
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
const onSelectChange = (keys: string[], selectedRows: Array<Brand>) => {
    selectedRowKeys.value = keys;
    selectedBrandRows.value = selectedRows
};
const handleOk = () => {
    if (selectedRowKeys.value.length < 1) {
        message.warning('请选择一条记录')
        return;
    }
    let selectBrands: Array<HomeBrand | any> = [];
    for (let i = 0; i < selectedBrandRows.value.length; i++) {
        selectBrands.push({
            brandId: selectedBrandRows.value[i].id,
            brandName: selectedBrandRows.value[i].name
        });
    }
    Modal.confirm({
        title: "提示",
        content: "使用要进行添加操作?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _createHomeBrand(selectBrands).then(res => {
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