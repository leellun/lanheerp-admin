<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form :model="formRef" @submit="handleSearch">
            <a-form-item>
                <a-input style="width:300px;margin-right:15px" size="small" v-model:value="formRef.keyword" placeholder="输入">
                    <template #prefix>
                        <search-outlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input>
                <a-button size="small" type="primary" @click="handleSearch">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                    搜索
                </a-button>
            </a-form-item>
        </a-form>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'factoryStatus'">
                    <a-switch @change="handleFactoryStatusChange(record)" :active-value="1" :inactive-value="0"
                        :checked="record.factoryStatus === 1">
                    </a-switch>
                </template>
                <template v-else-if="column.key === 'showStatus'">
                    <a-switch @change="handleShowStatusChange(record)" :active-value="1" :inactive-value="0"
                        :checked="record.showStatus === 1">
                    </a-switch>
                </template>
                <template v-else-if="column.key === 'correlation'">
                    <span>商品：{{ record.productCount }}</span>
                    <span style="margin-left:15px">评价：{{ record.productCommentCount }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.id)">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord(record.id)">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getBrandList, _updateShowStatus, _updateFactoryStatus, _deleteBrand } from '@/api/pms/brandApi'
import type { Brand, BrandSearch } from '@/api/pms/brandApi'
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Brand>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<BrandSearch>>({
})
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
    {
        title: '品牌名称',
        key: 'name',
        dataIndex: 'name',
        width: 100
    }, {
        title: '品牌首字母',
        dataIndex: 'firstLetter',
        key: 'firstLetter',
        width: 50
    }, {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width: 50
    }, {
        title: '品牌制造商',
        key: 'factoryStatus',
        width: 100
    }, {
        title: '是否显示',
        key: 'showStatus',
        width: 100
    }, {
        title: '相关',
        key: 'correlation',
        width: 150
    }, {
        title: '操作',
        fixed: 'right',
        width: 180,
        key: 'action'
    }
];
const onSelectChange = (keys: string[]) => {
    selectedRowKeys.value = keys;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageProducts()
}
const getPageProducts = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getBrandList(formRef as BrandSearch).then(res => {
        pagination.current = res.data.current
        pagination.pageSize = res.data.size
        pagination.total = res.data.total
        const records = res.data.records as Array<any>
        records.forEach(item => {
            item.key = item.id
        })
        data.value = records
    }).finally(() => {
        loading.value = false
    })
}
const handleTableChange = (page: any, filters: any, sorter: any) => {
    formRef.pageNo = page.current
    getPageProducts();
}
const handleFactoryStatusChange = (record: Brand) => {
    updateFactoryStatus([record.id], record.factoryStatus === 1 ? 0 : 1)
}
const handleShowStatusChange = (record: Brand) => {
    updateShowStatus([record.id], record.showStatus === 1 ? 0 : 1)
}
const updateShowStatus = (ids: Array<string>, showStatus: number) => {
    _updateShowStatus({ ids, showStatus }).then(res => {
        handleSearch()
    })
}
const updateFactoryStatus = (ids: Array<string>, factoryStatus: number) => {
    _updateShowStatus({ ids, factoryStatus }).then(res => {
        handleSearch()
    })
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    router.push({
        name: 'addBrand',
    })
}
const handleDeleteRecord = (id: string, e?: Event) => {
    e?.preventDefault()
    _deleteBrand(id).then(res=>{
        handleSearch()
    })
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    router.push({
        name: 'updateBrand',
        query: {
            id
        }
    })
}
const handleOk = () => {
    handleSearch()
};
handleSearch()
</script>
<style lang="less" scoped>

</style>