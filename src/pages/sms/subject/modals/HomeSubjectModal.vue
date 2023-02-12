<template>
    <a-modal v-model:visible="modalVisible" title="选择专题" @ok="handleOk" @cancel="handleCancel" style="width:750px">
        <a-input-search v-model:value="form.keyword" placeholder="专题名称搜索" enter-button @search="handleSelectSearch" />
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" :scroll="{ x: 580 }"
            @change="handleTableChange" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
            </template>
        </a-table>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { _createHomeSubject } from '@/api/sms/homeSubjectApi'
import type { HomeRecommendSubject } from '@/api/sms/homeSubjectApi'
import { _getPageSubjects } from '@/api/cms/subjectApi';
import type { Subject, SubjectParam } from '@/api/cms/subjectApi';
import { message, Modal } from 'ant-design-vue'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const data = ref<Array<Subject | any>>([]);
const pagination = reactive<any>({ pageSize: 5, current: 1 })
const loading = ref<boolean>(false)
const selectedRowKeys = ref<string[]>([]);
const selectedBrandRows = ref<Subject[]>([]);
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
    { title: '专题名称', dataIndex: 'title', key: 'title', width: 200 },
    { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 200 },
    { title: '添加时间', dataIndex: 'createTime', key: 'createTime', width: 200 },
];
const form = reactive<Partial<SubjectParam>>({
    pageNo: 1,
    pageSize: 5,
    keyword: undefined
})
const handleSelectSearch = () => {
    loading.value = true
    form.pageSize = pagination.pageSize
    _getPageSubjects(form as any).then(res => {
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
const onSelectChange = (keys: string[], selectedRows: Array<Subject>) => {
    selectedRowKeys.value = keys;
    selectedBrandRows.value = selectedRows
};
const handleOk = () => {
    if (selectedRowKeys.value.length < 1) {
        message.warning('请选择一条记录')
        return;
    }
    let selects: Array<HomeRecommendSubject | any> = [];
    for (let i = 0; i < selectedBrandRows.value.length; i++) {
        selects.push({
            subjectId: selectedBrandRows.value[i].id,
            subjectName: selectedBrandRows.value[i].title
        });
    }
    Modal.confirm({
        title: "提示",
        content: "使用要进行添加操作?",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
            _createHomeSubject(selects).then(res => {
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