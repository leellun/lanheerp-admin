<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef">

            <a-form-item label="商品名称：">
                <a-input size="small" :span="8" v-model:value="formRef.productName" style="width: 200px"
                    placeholder="商品名称">
                </a-input>
            </a-form-item>
            <a-form-item label="推荐状态：">
                <a-select v-model:value="formRef.recommendStatus" placeholder="全部" :allowClear="true"
                    style="width:200px">
                    <a-select-option :key="0" :value="0">未推荐 </a-select-option>
                    <a-select-option :key="1" :value="1">推荐中 </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button size="small" type="primary" @click="handleSearch">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                    搜索
                </a-button>
                <a-button size="small" style="margin-left:15px" type="primary" @click="handleResetSearch">
                    <template #icon><undo-outlined /></template>
                    重置
                </a-button>
            </a-form-item>
        </a-form>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>添加</a-button>

        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'sort'">
                    <a-input-number :value="record.sort" size="small" :min="0" :max="1000"
                        @change="(value: number) => handleSort(record, value)" />
                </template>
                <template v-else-if="column.key === 'recommendStatus'">
                    <a-switch @change="handleUpdateStatus(record)" :active-value="1" :inactive-value="0"
                        :checked="record.recommendStatus === 1">
                    </a-switch>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否" @confirm="() => handleDelete(record)">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <HomeNewProductModal v-model:visible="modalVisible" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import type { HomeNewProduct, HomeNewProductSearch, } from '@/api/sms/newProductApi'
import { _getHomeNewProductPage, _updateNewProductSort, _updateNewProductRecommendStatus, _deleteNewProduct } from '@/api/sms/newProductApi'
import { Form, Modal } from 'ant-design-vue';
import HomeNewProductModal from './modals/HomeNewProductModal.vue'
const modalVisible = ref<boolean>(false)
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<HomeNewProduct | any>>([]);
const formRef = reactive<Partial<HomeNewProductSearch>>({
    pageNo: 1,
    pageSize: 10,
    productName: undefined,
    recommendStatus: undefined
})
const columns = [
    { title: '编号', key: 'id', dataIndex: 'id', width: 50, align: 'center' },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150, align: 'center' },
    { title: '是否推荐', key: 'recommendStatus', width: 100, align: 'center' },
    { title: '排序', key: 'sort', width: 100, align: 'center' },
    { title: '操作', fixed: 'right', width: 150, key: 'action', align: 'center' }
];
let sortTimeOut: any = {};
const handleSort = (newProduct: HomeNewProduct, value: number) => {
    newProduct.sort = value
    if (sortTimeOut[newProduct.id] !== undefined) {
        clearTimeout(sortTimeOut[newProduct.id])
    }
    sortTimeOut[newProduct.id] = setTimeout(() => {
        _updateNewProductSort(newProduct.id, value).then(res => {
            data.value.sort((a, b) => b.sort - a.sort)
        })
    }, 1000)
}
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)

const handleDelete = (row: HomeNewProduct) => {
    _deleteNewProduct([row.id]).then(res => {
        handleSearch()
    });
}

const getPageLists = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getHomeNewProductPage(formRef as HomeNewProductSearch).then(res => {
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
const onSelectChange = (keys: string[]) => {
    selectedRowKeys.value = keys;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageLists()
}
const handleTableChange = (page: any, filters: any, sorter: any) => {
    formRef.pageNo = page.current
    getPageLists();
}
const handleResetSearch = () => {
    resetFields()
}
const handleUpdateStatus = (row: HomeNewProduct) => {
    Modal.confirm({
        title: "提示",
        content: "是否要进行此操作?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _updateNewProductRecommendStatus([row.id], row.recommendStatus === 1 ? 0 : 1).then(res => {
                getPageLists()
            });
        },
    });
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    modalVisible.value = true
}
const handleOk = () => {
    handleSearch()
}
handleSearch()
</script>
<style lang="less" scoped>

</style>