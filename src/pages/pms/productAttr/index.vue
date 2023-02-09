<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'setting'">
                    <a @click="getAttrList(record)">属性列表</a>
                    <a-divider type="vertical" />
                    <a @click="getParamList(record)">参数列表</a>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(record, e)">编辑</a>
                        <a-divider type="vertical" />

                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord(record.id)">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <AddOrUpdateProductAttrCate :id="modalId" :name="attrName" v-model:visible="modalVisible" @ok="handleOk"/>
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { PageSearch } from '@/api/types'
import { _getPageAttributeCategory, _createProductAttrCate, _deleteProductAttrCate, _updateProductAttrCate } from '@/api/pms/productAttrCateApi'
import type { ProductAttributeCategory } from '@/api/pms/productAttrCateApi'
import AddOrUpdateProductAttrCate from './modals/AddOrUpdateProductAttrCate.vue'
const modalVisible = ref<boolean>(false)
const modalId = ref<string>()
const attrName = ref<string>()
const data = ref<Array<ProductAttributeCategory | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<PageSearch>>({})
const loading = ref<boolean>(false)
const columns = [
    {
        title: '属性分类',
        dataIndex: 'name',
        key: 'name',
        width: 100
    }, {
        title: '属性数量',
        key: 'attributeCount',
        dataIndex: 'attributeCount',
        width: 60
    }, {
        title: '参数数量',
        dataIndex: 'paramCount',
        key: 'paramCount',
        width: 100
    }, {
        title: '设置',
        key: 'setting',
        width: 100
    }, {
        title: '操作',
        fixed: 'right',
        width: 100,
        key: 'action'
    }
];
const router = useRouter()
const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getPageAttributeCategory(formRef as PageSearch).then(res => {
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
    modalId.value = undefined
    attrName.value = undefined
    modalVisible.value = true
}
const handleEditRecord = (record: ProductAttributeCategory, e?: Event) => {
    e?.preventDefault()
    modalId.value = record.id
    attrName.value = record.name
    modalVisible.value = true
}
const getAttrList = (row: ProductAttributeCategory) => {
    router.push({ name: 'productAttrList', query: { cid: row.id, cname: row.name, type: 0 } })
}
const getParamList = (row: ProductAttributeCategory) => {
    router.push({ name: 'productAttrList', query: { cid: row.id, cname: row.name, type: 1 } })
}
const handleDeleteRecord = (id: string) => {
    _deleteProductAttrCate(id).then(res => {
        getPageLists()
    })
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