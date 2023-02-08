<template>
  <div>
    <a-form :model="value" label-width="120px" style="width: 680px" size="small">
      <a-form-item label="关联专题：">
        <a-transfer v-model:target-keys="selectSubject" :data-source="subjectList" :render="(item: any) => item.title"
          filter-placeholder="请输入专题名称" :titles="subjectTitles" />
      </a-form-item>
      <a-form-item label="关联优选：">
        <a-transfer v-model:target-keys="selectPrefrenceArea" :data-source="prefrenceAreaList"
          :render="(item: any) => item.title" filter-placeholder="请输入优选名称" :titles="prefrenceAreaTitles" />
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-button size="medium" @click="handlePrev">上一步，填写商品属性</a-button>
        <a-button type="primary" size="medium" @click="handleFinishCommit" style="margin-left:10px">完成，提交商品</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProductDto, SubjectProductRelationDto, PrefrenceAreaProductRelationDto } from '@/api/pms/productApi'
import { _getSubjectAll } from '@/api/cms/subjectApi'
import { _getPrefrenceAreaAll } from '@/api/cms/prefrenceAreaApi'
interface MockData {
  key: string;
  title: string;
  chosen: boolean;
}

const emit = defineEmits(['prevStep', 'finishCommit'])
const props = withDefaults(defineProps<{
  value: ProductDto,
}>(), {
})
//所有专题列表
const subjectList = ref<Array<MockData>>([])
//专题左右标题
const subjectTitles = ['待选择', '已选择']
//所有专题列表
const prefrenceAreaList = ref<Array<MockData>>([])
//优选左右标题
const prefrenceAreaTitles = ['待选择', '已选择']

const handlePrev = () => {
  emit('prevStep')
}
const handleFinishCommit = () => {
  emit('finishCommit');
}
//选中的专题
const selectSubject = computed({
  get: function () {
    let subjects: Array<string> = [];
    if (props.value.subjectProductRelationList == null || props.value.subjectProductRelationList.length <= 0) {
      return subjects;
    }
    for (let i = 0; i < props.value.subjectProductRelationList.length; i++) {
      subjects.push(`${props.value.subjectProductRelationList[i].subjectId}`);
    }
    return subjects;
  },
  set: function (newValue) {
    let list = []
    for (let i = 0; i < newValue.length; i++) {
      list.push({ subjectId: newValue[i] } as SubjectProductRelationDto);
    }
    props.value.subjectProductRelationList = list;
  }
})
//选中的优选
const selectPrefrenceArea = computed({
  get: function () {
    let prefrenceAreas: Array<string> = [];
    if (props.value.prefrenceAreaProductRelationList == null || props.value.prefrenceAreaProductRelationList.length <= 0) {
      return prefrenceAreas;
    }
    for (let i = 0; i < props.value.prefrenceAreaProductRelationList.length; i++) {
      prefrenceAreas.push(`${props.value.prefrenceAreaProductRelationList[i].prefrenceAreaId}`);
    }
    return prefrenceAreas;
  },
  set: function (newValue) {
    let list = []
    for (let i = 0; i < newValue.length; i++) {
      list.push({ prefrenceAreaId: newValue[i] } as PrefrenceAreaProductRelationDto);
    }
    props.value.prefrenceAreaProductRelationList = list;
  }
})

const getSubjectList = () => {
  _getSubjectAll().then(res => {
    let list = res.data;
    for (let i = 0; i < list.length; i++) {
      subjectList.value.push({
        key: `${list[i].id}`,
        title: list[i].title,
        chosen: false
      });
    }
  });
}
const getPrefrenceAreaList = () => {
  _getPrefrenceAreaAll().then(res => {
    let list = res.data;
    for (let i = 0; i < list.length; i++) {
      prefrenceAreaList.value.push({
        key: `${list[i].id}`,
        title: list[i].name,
        chosen: false
      });
    }
  });
}
getSubjectList()
getPrefrenceAreaList()
</script>

<style scoped>

</style>
