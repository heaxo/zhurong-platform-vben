<script setup lang="ts">
import { Page } from '@vben/common-ui';
import type { Recordable } from '@vben/types';
import { Button, Card, Checkbox, Form, FormItem, Input, InputNumber, message, Modal, Select, SelectOption, Space, Table, Tag } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';

import { pageNests, sendNestFeedback, withdrawNestFeedback } from '#/api/xybaoyuan';

const loading = ref(false); const actionLoading = ref(false); const rows = ref<Recordable<any>[]>([]); const selectedKeys = ref<number[]>([]); const total = ref(0);
const pager = reactive({ current: 1, pageSize: 20 }); const query = reactive({ jobRef: '', mState: undefined as number | undefined, nstRef: '', wrkRef: '' });
const feedbackVisible = ref(false); const feedback = reactive({ materialReceived: true, productionWorkshopCode: '' });
const columns = [
  { dataIndex: 'nstRef', title: '套料编号', width: 160 }, { dataIndex: 'jobRef', title: '作业', width: 150 },
  { dataIndex: 'wrkRef', title: '设备', width: 110 }, { dataIndex: 'mState', title: '程序状态', width: 100 },
  { dataIndex: 'matRef', title: '材质', width: 90 }, { dataIndex: 'sThickness', title: '厚度', width: 75 },
  { dataIndex: 'sLength', title: '板长', width: 90 }, { dataIndex: 'sWidth', title: '板宽', width: 90 },
  { dataIndex: 'quantity', title: '数量', width: 75 }, { dataIndex: 'sProfit', title: '利用率', width: 90 },
  { dataIndex: 'feedbackSent', title: '金蝶反馈', width: 110 }, { dataIndex: 'feedbackTime', title: '反馈时间', width: 170 },
];
async function load() { loading.value = true; try { const data = await pageNests({ ...query, page: pager.current, pageSize: pager.pageSize }); rows.value = data.items; total.value = data.total; } finally { loading.value = false; } }
function search() { pager.current = 1; void load(); }
function onSelect(keys: (number | string)[]) { selectedKeys.value = keys.map(Number); }
async function send() { if (!feedback.productionWorkshopCode.trim()) return message.warning('生产车间不能为空'); actionLoading.value = true; try { await sendNestFeedback(selectedKeys.value, feedback.productionWorkshopCode.trim(), feedback.materialReceived); feedbackVisible.value = false; message.success('反馈成功'); await load(); } finally { actionLoading.value = false; } }
function withdraw() { if (!selectedKeys.value.length) return message.warning('请选择套料记录'); Modal.confirm({ title: '确认撤销所选套料反馈？', async onOk() { await withdrawNestFeedback(selectedKeys.value); message.success('撤销成功'); await load(); } }); }
onMounted(load);
</script>

<template>
  <Page auto-content-height><Card class="h-full" title="套料反馈">
    <Form layout="inline" class="mb-4">
      <FormItem label="套料编号"><Input v-model:value="query.nstRef" allow-clear @press-enter="search" /></FormItem>
      <FormItem label="作业"><Input v-model:value="query.jobRef" allow-clear /></FormItem>
      <FormItem label="设备"><Input v-model:value="query.wrkRef" allow-clear /></FormItem>
      <FormItem label="程序状态"><InputNumber v-model:value="query.mState" :controls="false" /></FormItem>
      <FormItem><Button type="primary" @click="search">查询</Button></FormItem>
    </Form>
    <Space class="mb-3">
      <Button type="primary" :disabled="!selectedKeys.length" @click="feedbackVisible = true">发送金蝶反馈</Button>
      <Button danger :disabled="!selectedKeys.length" @click="withdraw">撤销反馈</Button>
      <span class="text-gray-500">仅“已送车间”(MState=40)程序允许反馈</span>
    </Space>
    <Table :columns="columns" :data-source="rows" :loading="loading" :pagination="{ current: pager.current, pageSize: pager.pageSize, total, showSizeChanger: true }"
           :row-key="(row: Recordable<any>) => row.recID" :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelect }" :scroll="{ x: 1350 }"
           @change="(page: any) => { pager.current = page.current; pager.pageSize = page.pageSize; load(); }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'mState'"><Tag :color="record.mState === 40 ? 'green' : 'default'">{{ record.mState === 40 ? '已送车间' : record.mState }}</Tag></template>
        <template v-else-if="column.dataIndex === 'feedbackSent'"><Tag :color="record.feedbackSent ? 'green' : 'default'">{{ record.feedbackSent ? '已反馈' : '未反馈' }}</Tag></template>
        <template v-else-if="column.dataIndex === 'sProfit'">{{ record.sProfit == null ? '' : `${(record.sProfit * 100).toFixed(2)}%` }}</template>
      </template>
    </Table>
    <Modal v-model:open="feedbackVisible" title="发送套料反馈" :confirm-loading="actionLoading" @ok="send">
      <FormItem label="生产车间" required><Select v-model:value="feedback.productionWorkshopCode" show-search><SelectOption value="5101">5101-生产制造本部</SelectOption><SelectOption value="5301">5301-生产制造景泰</SelectOption><SelectOption value="WWGB">WWGB-委外钢板部门</SelectOption></Select></FormItem>
      <Checkbox v-model:checked="feedback.materialReceived">领料</Checkbox>
    </Modal>
  </Card></Page>
</template>
