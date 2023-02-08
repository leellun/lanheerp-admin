<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" @submit="handleSearch" :gutter="24">
            <a-form-item label="商品名称：">
                <a-input size="small" :span="8" v-model:value="formRef.keyword" style="width: 200px" placeholder="输入名称">
                </a-input>
            </a-form-item>
            <a-form-item label="商品货号：">
                <a-input size="small" v-model:value="formRef.productSn" style="width: 200px" placeholder="商品货号">
                </a-input>
            </a-form-item>
            <a-form-item label="商品分类：">
                <a-select v-model:value="formRef.productCategoryId" size="small" style="width: 200px" placeholder="请选择">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="0">禁用</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="商品品牌：">
                <a-select v-model:value="formRef.brandId" size="small" style="width: 200px" placeholder="请选择">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="0">禁用</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="上架状态：">
                <a-select v-model:value="formRef.publishStatus" size="small" style="width: 200px" placeholder="状态">
                    <a-select-option :value="1">上架</a-select-option>
                    <a-select-option :value="0">下架</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="审核状态：">
                <a-select v-model:value="formRef.verifyStatus" size="small" style="width: 200px" placeholder="状态">
                    <a-select-option :value="1">审核通过</a-select-option>
                    <a-select-option :value="0">未审核</a-select-option>
                </a-select>
            </a-form-item>

        </a-form>
        <div style="text-align:center;margin-top: 15px;">
            <a-button size="small" type="primary" html-type="submit" v-permission="['job:select']">
                <template #icon>
                    <SearchOutlined />
                </template>
                搜索
            </a-button>
            <a-button size="small" style="margin-left:15px" type="primary" @click="handleResetSearch">
                <template #icon><undo-outlined /></template>
                重置
            </a-button>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd" v-permission="['job:add']"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" danger size="small" style="margin-left:10px"
                :disabled="selectedRowKeys.length == 0" @click="handleDeleteSelected"
                v-permission="['job:delete']"><delete-outlined />删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'verifyStatus'">
                    <p>{{ record.verifyStatus === 1 ? '审核通过' : '未审核' }}</p>
                    <p>
                        <a @click="handleShowVerifyDetail(record)">审核详情
                        </a>
                    </p>
                </template>
                <template v-else-if="column.key === 'pic'">
                    <a-image :width="100" :src="record.pic" />
                </template>
                <template v-else-if="column.key === 'name'">
                    <p>{{ record.name }}</p>
                    <p>品牌：{{ record.brandName }}</p>
                </template>
                <template v-else-if="column.key === 'productSn'">
                    <p>价格：￥{{ record.price }}</p>
                    <p>货号：{{ record.productSn }}</p>
                </template>
                <template v-else-if="column.key === 'stock'">
                    <a-button type="primary" @click="handleShowSkuEditDialog(record)" shape="circle">
                        <template #icon>
                            <edit-outlined />
                        </template>
                    </a-button>
                </template>
                <template v-else-if="column.key === 'publishStatus'">
                    <p>上架：
                        <a-switch @change="handlePublishStatusChange(record)" :active-value="1" :inactive-value="0"
                            :checked="record.publishStatus === 1">
                        </a-switch>
                    </p>
                    <p>新品：
                        <a-switch @change="handleNewStatusChange(record)" :active-value="1" :inactive-value="0"
                            :checked="record.newStatus === 1">
                        </a-switch>
                    </p>
                    <p>推荐：
                        <a-switch @change="handleRecommendStatusChange(record)" :active-value="1" :inactive-value="0"
                            :checked="record.recommendStatus === 1">
                        </a-switch>
                    </p>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.id)" v-permission="['job:update']">编辑</a>
                        <a-divider type="vertical" v-permission="['job:update']" />
                        <a-popconfirm title="是否删除商品？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord([record.id])">
                            <a v-permission="['job:delete']">删除</a>
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
import type { ProductSearchDto, Product } from '@/api/pms/productApi'
import { _productList, _updateDeleteStatus, _updatePublishStatus, _updateNewStatus, _updateRecommendStatus } from '@/api/pms/productApi'
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Product | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<ProductSearchDto>>({
})
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
    {
        title: '商品图片',
        key: 'pic',
        width: 100
    }, {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 100
    }, {
        title: '价格/货号',
        dataIndex: 'productSn',
        key: 'productSn',
        width: 100
    }, {
        title: '标签',
        dataIndex: 'publishStatus',
        key: 'publishStatus',
        width: 100
    }, {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width: 100
    }, {
        title: 'SKU库存',
        dataIndex: 'stock',
        key: 'stock',
        width: 100
    }, {
        title: '销量',
        dataIndex: 'sale',
        key: 'sale',
        width: 100
    }, {
        title: '审核状态',
        key: 'verifyStatus',
        width: 60
    }, {
        title: '操作',
        fixed: 'right',
        width: 180,
        key: 'action'
    }
];
const handleShowVerifyDetail = (record: Product) => {

}
const handlePublishStatusChange = (record: Product) => {
    updatePublishStatus([record.id], record.publishStatus === 1 ? 0 : 1)
}
const handleNewStatusChange = (record: Product) => {
    updateNewStatus([record.id], record.newStatus === 1 ? 0 : 1)
}
const handleRecommendStatusChange = (record: Product) => {
    updateRecommendStatus([record.id], record.recommendStatus === 1 ? 0 : 1)
}
const handleShowSkuEditDialog = (record: Product) => {

}
const updatePublishStatus = (ids: Array<string>, publishStatus: number) => {
    _updatePublishStatus({ ids, publishStatus }).then(res => {
        getPageProducts()
    });
}
const updateNewStatus = (ids: Array<string>, newStatus: number) => {
    _updateNewStatus({ ids, newStatus }).then(res => {
        getPageProducts()
    });
}
const updateRecommendStatus = (ids: Array<string>, recommendStatus: number) => {
    _updateRecommendStatus({ ids, recommendStatus }).then(res => {
        getPageProducts()
    });
}

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
    _productList(formRef as ProductSearchDto).then(res => {
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
    formRef.pageNo = page.current
    getPageProducts();
}
const handleResetSearch = () => {
    resetFields()
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    router.push({
        name: 'addProduct',
    })
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        Modal.confirm({
            title: "系统提示",
            content: "是否删除选中商品？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                handleDeleteRecord(selectedRowKeys.value)
            },
        });

    }
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    router.push({
        name: 'updateProduct',
        query: {
            id
        }
    })
}
const handleDeleteRecord = (ids: string[]) => {
    _updateDeleteStatus(ids).then(res => {
        getPageProducts()
    });
}
const handleOk = () => {
    handleSearch()
};
handleSearch()
</script>
<style lang="less" scoped>

</style>