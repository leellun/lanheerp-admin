<template>
  <div class="main-container">
    <a-row :gutter="24">
      <!--部门数据-->
      <a-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <a-form-item>
            <a-input v-model:value="deptName" size="small" placeholder="输入部门名称搜索" style="width: 200px"
              @change="onDeptChange" @search="onSearch">
              <template #prefix><search-outlined /></template>
            </a-input>
          </a-form-item>
        </div>
        <a-spin tip="加载中..." :spinning="showTreeTip">
          <a-tree v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys"
            v-model:selectedKeys="selectedKeys" checkable :tree-data="treeData" :loadData="onLoadData">
            <template #title="{ title }">
              <span>{{ title }}</span>
            </template>
          </a-tree>
        </a-spin>
      </a-col>
      <!--用户数据-->
      <a-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" @submit="handleSubmit">
          <a-form-item>
            <a-input size="small" v-model:value="formRef.blurry" placeholder="输入名称或者邮箱搜索">
              <template #prefix>
                <search-outlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-range-picker size="small" v-model:value="timeRangeRef" name="gmtCreate" style="width: 100%"
              :placeholder="['开始时间', '结束时间']" />
          </a-form-item>
          <a-form-item>
            <a-select v-model:value="formRef.enabled" size="small" style="width: 200px" placeholder="状态">
              <a-select-option value="1">启用</a-select-option>
              <a-select-option value="0">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button size="small" type="primary" html-type="submit">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button size="small" type="primary">
              <template #icon><undo-outlined /></template>
              重置
            </a-button>
          </a-form-item>
        </a-form>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                Name
              </span>
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <a>
                {{ record.name }}
              </a>
            </template>
            <template v-else-if="column.key === 'tags'">
              <span>
                <a-tag v-for="tag in record.tags" :key="tag"
                  :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
                  {{ tag.toUpperCase() }}
                </a-tag>
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a>Invite 一 {{ record.name }}</a>
                <a-divider type="vertical" />
                <a>Delete</a>
                <a-divider type="vertical" />
                <a class="ant-dropdown-link">
                  More actions
                  <down-outlined />
                </a>
              </span>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { TreeProps } from 'ant-design-vue'
import type { DataNode } from 'ant-design-vue/lib/tree';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons-vue';
import { _getSubDepts, _searchDepts } from '@/api/deptApi'
import type { Dept } from '@/api/deptApi'
import { _getUsersPage } from '@/api/userApi'
import type { UserSearch, UserItem } from '@/api/userApi'
import type { Dayjs } from 'dayjs';
type RangeValue = [Dayjs, Dayjs];
const timeRangeRef = ref<RangeValue>()
const deptName = ref<string>('')
const formRef = reactive<Partial<UserSearch>>({
  blurry: '',
})
const showTreeTip = ref(false)
const loading = ref(false)
const treeData2: TreeProps['treeData'] = [];
const treeData = ref(treeData2)
const expandedKeys = ref<string[]>();
const selectedKeys = ref<string[]>();
const checkedKeys = ref<string[]>();
const pagination = ref<string>('bottomRight')
const columns = [
  {
    name: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
  },
  {
    title: '性别',
    key: 'gender',
  },
  {
    title: '电话',
    key: 'phone',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '角色',
    key: 'roleName',
  },
  {
    title: '部门',
    key: 'deptName',
  },
  {
    title: '状态',
    key: 'enabled',
  },
  {
    title: '创建日期',
    key: 'gmtCreate',
  },
  {
    title: '最后一次登录时间',
    key: 'lastLoginTime',
  }, {
    title: '操作',
    key: 'action'
  }
];

const data = ref<Array<UserItem>>([]);
const onSearch = (searchValue: string) => {

}
let interval: any;
const onDeptChange = () => {
  if (interval != undefined && interval != null) {
    clearTimeout(interval)
  }
  interval = setTimeout(() => {
    if (deptName.value.trim() === '') {
      getSubDepts('0')
    } else {
      _searchDepts(deptName.value).then(res => {
        selectedKeys.value = []
        checkedKeys.value = []
        expandedKeys.value = []
        let tmpTreeData: DataNode[] = [];
        covertDepts(res, tmpTreeData)
        treeData.value = tmpTreeData
      })
    }

  }, 200)
}

const onLoadData = (node: DataNode) => {
  return new Promise(resolve => {
    if (node.dataRef.children && node.dataRef.children.length) {
      resolve(node);
      return;
    }
    showTreeTip.value = true
    _getSubDepts(node.key as string).then(res => {
      let treeNode = findSubDept(node.key as string)
      treeNode!.children = []
      res.forEach(item => {
        item.isLeaf = item.subCount == 0
        treeNode!.children?.push({
          isLeaf: item.subCount === 0,
          key: item.id,
          title: item.name
        })
      });
    }).finally(() => {
      showTreeTip.value = false
      resolve(node)
    })
  })
}
const getSubDepts = (pid: string) => {
  showTreeTip.value = true
  _getSubDepts(pid).then(res => {
    selectedKeys.value = []
    checkedKeys.value = []
    expandedKeys.value = []
    let tmpTreeData: DataNode[];
    treeData.value.splice(0, treeData.value.length)
    tmpTreeData = treeData.value;
    res.forEach(item => {
      item.isLeaf = item.subCount == 0
      tmpTreeData?.push({
        isLeaf: item.subCount === 0,
        key: item.id,
        title: item.name,
      })
    });
  }).finally(() => {
    showTreeTip.value = false
  })
}
const covertDepts = (depts: Array<Dept>, nodes: DataNode[]) => {
  for (let i = 0; i < depts.length; i++) {
    let dept = depts[i];
    nodes[i] = covertDept(dept)
    if (dept.children && dept.children.length > 0) {
      nodes[i].children = []
      covertDepts(dept.children, nodes[i].children as DataNode[]);
    }
  }
}
const covertDept = (item: Dept) => {
  expandedKeys.value?.push(item.id)
  return {
    isLeaf: item.subCount === 0,
    key: item.id,
    title: item.name
  }
}
const findSubDept = (key: string) => {
  for (let node of treeData.value) {
    if (node.key === key) {
      return node
    }
  }
  return null
}
getSubDepts('0')
const handleSubmit = (e?: Event) => {
  e?.preventDefault();
  if (timeRangeRef.value != null) {
    formRef.gmtCreate = []
    formRef.gmtCreate.push(timeRangeRef.value[0].format("YYYY-MM-DD 00:00:00"))
    formRef.gmtCreate.push(timeRangeRef.value[1].format("YYYY-MM-DD 00:00:00"))
  }
  formRef.deptIds = checkedKeys.value
  loading.value = true
  _getUsersPage(formRef as UserSearch).then(res => {
    data.value = res.records
    console.log(data.value)
  }).finally(() => {
    loading.value = false
  })
}
handleSubmit()
</script>

<style lang="less" scoped>

</style>
