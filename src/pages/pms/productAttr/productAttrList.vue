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
                <template v-if="column.key === 'cname'">
                    {{ cname }}
                </template>
                <template v-else-if="column.key === 'selectType'">
                    {{selectTypeFilter(record.selectType)}}
                </template>
                <template v-else-if="column.key === 'inputType'">
                    {{record.inputType===1?'从列表中选取':'手工录入'}}
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.id)">编辑</a>
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
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ProductCategory } from '@/api/pms/productCateApi'
import { _getProductAttrPage, _deleteProductAttr } from '@/api/pms/productAttrApi'
import type { ProductAttributeSearchDto } from '@/api/pms/productAttrApi'
const parentId = ref<string>('0')
const data = ref<Array<ProductCategory | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<ProductAttributeSearchDto>>({})
const loading = ref<boolean>(false)
const columns = [
    {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
        width: 100
    }, {
        title: '商品类型',
        key: 'cname',
        width: 60
    }, {
        title: '属性是否可选',
        dataIndex: 'selectType',
        key: 'selectType',
        width: 100
    }, {
        title: '属性值的录入方式',
        dataIndex: 'inputType',
        key: 'inputType',
        width: 100
    }, {
        title: '可选值列表',
        key: 'inputList',
        width: 100
    }, {
        title: '排序',
        key: 'sort',
        width: 100
    }, {
        title: '操作',
        fixed: 'right',
        width: 100,
        key: 'action'
    }
];
const router = useRouter()
const cname=router.currentRoute.value.query.cname
const cid =router.currentRoute.value.query.cid as any
formRef.type = router.currentRoute.value.query.type as any
const selectTypeFilter=(value:number) =>{
        if (value === 1) {
          return '单选';
        } else if (value === 2) {
          return '多选';
        } else {
          return '唯一'
        }
      }
const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getProductAttrPage(cid, formRef as any).then(res => {
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
        name: 'addProductAttr',
        query:{
            cid,
            type:formRef.type
        }
    })
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    router.push({
        name: 'updateProductAttr',
        query:{
            id
        }
    })
}
const handleDeleteRecord = (id: string) => {
    _deleteProductAttr([id]).then(res => {
        getPageLists()
    })
}
formRef.pageNo = 1
getPageLists()
</script>
<style lang="less" scoped>

</style>