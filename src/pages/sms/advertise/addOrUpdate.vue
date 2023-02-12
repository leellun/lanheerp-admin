<template>
    <div class="main-container">
        <a-card>
            <a-form :model="homeAdvertise" size="small" :labelCol="{ style: { width: '100px' } }">
                <a-form-item label="广告名称：" v-bind="validateInfos.name">
                    <a-input v-model:value="homeAdvertise.name" class="input-width"></a-input>
                </a-form-item>
                <a-form-item label="广告位置：">
                    <a-select v-model:value="homeAdvertise.type" style="width:200px">
                        <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">{{
                            item.label
                        }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="开始时间：" v-bind="validateInfos.startTime">
                    <a-date-picker v-model:value="startTime"  placeholder="选择日期"
                        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
                </a-form-item>
                <a-form-item label="到期时间：" v-bind="validateInfos.endTime">
                    <a-date-picker v-model:value="endTime" format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期"
                        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
                </a-form-item>
                <a-form-item label="上线/下线：">
                    <a-radio-group v-model:value="homeAdvertise.status">
                        <a-radio :value="1">上线</a-radio>
                        <a-radio :value="0">下线</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="广告图片：" v-bind="validateInfos.pic">
                    <single-upload v-model:value="homeAdvertise.pic"></single-upload>
                </a-form-item>
                <a-form-item label="排序：">
                    <a-input-number v-model:value="homeAdvertise.sort" style="width:200px"></a-input-number>
                </a-form-item>
                <a-form-item label="广告链接：" v-bind="validateInfos.url">
                    <a-input v-model:value="homeAdvertise.url" class="input-width"></a-input>
                </a-form-item>
                <a-form-item label="广告备注：">
                    <a-textarea class="input-width" type="textarea" :autoSize="{ minRows: 5, maxRows: 5 }"
                        v-model:value="homeAdvertise.note" placeholder="请输入内容"></a-textarea>
                </a-form-item>
                <a-form-item style="padding-top:15px" label=" ">
                    <a-button type="primary" @click="onSubmit">提交</a-button>
                    <a-button v-if="advertiseId === undefined" @click="resetForm" style="margin-left:15px">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import { _createHomeAdvertise, _getHomeAdvertise, _updateHomeAdvertise } from '@/api/sms/homeAdvertiseApi'
import type { HomeAdvertise } from '@/api/sms/homeAdvertiseApi'
import { Form } from 'ant-design-vue'
import dayjs from 'dayjs'
const useForm = Form.useForm
const typeOptions = [{ label: 'PC首页轮播', value: 0 }, { label: 'APP首页轮播', value: 1 }]
const router = useRouter()
const advertiseId = router.currentRoute.value.query.id
const homeAdvertise = reactive<Partial<HomeAdvertise>>({
    name: undefined,
    type: 1,
    pic: undefined,
    startTime: undefined,
    endTime: undefined,
    status: 1,
    url: undefined,
    note: undefined,
    sort: 0
})

const rulesRef = reactive({
    name: [{ required: true, message: '请输入广告名称', trigger: 'blur' }, { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }],
    url: [{ required: true, message: '请输入广告链接', trigger: 'blur' }], startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
    endTime: [{ required: true, message: '请选择到期时间', trigger: 'blur' }],
    pic: [{ required: true, message: '请选择广告图片', trigger: 'blur' }]

})
const startTime = computed({
    get() {
        if (homeAdvertise.startTime === undefined) return undefined
        return dayjs(homeAdvertise.startTime, "YYYY-MM-DD HH:mm:ss")
    }, set(newValue) {
        homeAdvertise.startTime = newValue!.format("YYYY-MM-DD HH:mm:ss")
    }
})
const endTime = computed({
    get() {
        if (homeAdvertise.endTime === undefined) return undefined
        return dayjs(homeAdvertise.endTime, "YYYY-MM-DD HH:mm:ss")
    }, set(newValue) {
        homeAdvertise.endTime = newValue!.format("YYYY-MM-DD HH:mm:ss")
    }
})
const { validate, validateInfos, resetFields } = useForm(homeAdvertise, rulesRef)
const resetForm = () => {
    resetFields()
}
const onSubmit = () => {
    validate().then(() => {
        if (advertiseId != undefined) {
            _updateHomeAdvertise(advertiseId, homeAdvertise as any).then(res => {
                router.push({ name: 'advertise' })
            });
        } else {
            _createHomeAdvertise(homeAdvertise as any).then(res => {
                router.push({ name: 'advertise' })
            });
        }
    })
}
if (advertiseId != undefined) {
    _getHomeAdvertise(advertiseId).then(res => {
        Object.assign(homeAdvertise, res.data)
    });
}
</script>
<style lang="less" scoped>
.input-width {
    width: 70%;
}
</style>


