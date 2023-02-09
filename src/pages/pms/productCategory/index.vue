<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" size="small" @click="handleBack" v-if="parentId!='0'" style="margin-left:15px">返回</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'level'">
                    {{ record.level === 0 ? '一级' : '二级' }}
                </template>
                <template v-else-if="column.key === 'navStatus'">
                    <a-switch :checked="record.navStatus === 1" checked-children="启用" un-checked-children="禁用"
                        @change="handleNavChange(record.id, record.navStatus === 0 ? 1 : 0)" />
                </template>
                <template v-else-if="column.key === 'showStatus'">
                    <a-switch :checked="record.showStatus === 1" checked-children="启用" un-checked-children="禁用"
                        @change="handleShowChange(record.id, record.showStatus === 0 ? 1 : 0)" />
                </template>
                <template v-else-if="column.key === 'setting'">
                    <a @click="handleShowNextLevel(record)" v-if="record.level == 0">查看下级</a>
                    <a v-else disabled="true">查看下级</a>
                    <a-divider type="vertical" />
                    <a @click="handleTransferProduct(record.id)">转移商品</a>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.id)">编辑</a>
                        <a-divider type="vertical" />

                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除岗位？" ok-text="是" cancel-text="否"
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
import type { PageSearch } from '@/api/types'
import type { ProductCategory } from '@/api/pms/productCateApi'
import { _getPageProductCategorys, _deleteProductCate, _updateShowStatus, _updateNavStatus } from '@/api/pms/productCateApi'
const parentId = ref<string>('0')
const data = ref<Array<ProductCategory | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<PageSearch>>({})
const loading = ref<boolean>(false)
const columns = [
    {
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
        width: 100
    }, {
        title: '级别',
        key: 'level',
        width: 60
    }, {
        title: '商品数量',
        dataIndex: 'productCount',
        key: 'productCount',
        width: 100
    }, {
        title: '数量单位',
        dataIndex: 'productUnit',
        key: 'productUnit',
        width: 100
    }, {
        title: '导航栏',
        key: 'navStatus',
        width: 100
    }, {
        title: '是否显示',
        key: 'showStatus',
        width: 100
    }, {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width: 60
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
    _getPageProductCategorys(parentId.value, formRef as PageSearch).then(res => {
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
    router.push({
        name: 'addProductCategory',
    })
}
const handleBack = (e?: Event) => {
    e?.preventDefault()
    parentId.value = '0'
    formRef.pageNo = 1
    getPageLists()
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    router.push({
        name: 'updateProductCategory',
        query:{
            id
        }
    })
}
const handleShowNextLevel = (record: ProductCategory) => {
    if (record.level >= 1) return;
    parentId.value = record.id
    formRef.pageNo = 1
    getPageLists()
}
const handleTransferProduct = (id: string) => {
    console.log('handleAddProductCate');
}
const handleDeleteRecord = (id: string) => {
    _deleteProductCate(id).then(res => {
        getPageLists()
    })
}
const handleOk = () => {
    formRef.pageNo = 1
    getPageLists()
};
const handleNavChange = (id: string, enabled: number) => {
    _updateNavStatus([id], enabled).then(res => {
        getPageLists()
    })
}
const handleShowChange = (id: string, enabled: number) => {
    _updateShowStatus([id], enabled).then(res => {
        getPageLists()
    })
}
formRef.pageNo = 1
getPageLists()
</script>
<style lang="less" scoped>

</style>