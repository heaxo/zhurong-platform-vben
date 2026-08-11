<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { Button, Card, Checkbox, Form, FormItem, Input, message, Modal, Space, Table, Tag } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';

import type { ManufacturingOrder } from '#/api/xybaoyuan';
import { exportOrders, importOrders, pageOrders, resolveJob, restartImportTask, updateOrders } from '#/api/xybaoyuan';

const loading = ref(false); const actionLoading = ref(false); const rows = ref<ManufacturingOrder[]>([]); const selectedKeys = ref<number[]>([]); const total = ref(0);
const pager = reactive({ current: 1, pageSize: 20 });
const query = reactive({ drawingCode: '', matRef: '', productionOrderErpInternalCode: '', productionOrderNumber: '', productionWorkshopName: '' });
const machineVisible = ref(false); const machine = ref('');
const jobVisible = ref(false); const jobForm = reactive({ jobName: '', useOldJob: true });
const columns = [
  { dataIndex: 'productionOrderNumber', title: '生产订单号', width: 170 }, { dataIndex: 'productionOrderErpInternalCode', title: 'ERP内码', width: 130 },
  { dataIndex: 'productionWorkshopName', title: '生产车间', width: 140 }, { dataIndex: 'prdRef', title: '零件编号', width: 150 },
  { dataIndex: 'prdName', title: '零件名称', width: 160 }, { dataIndex: 'drawingCode', title: '图号', width: 160 },
  { dataIndex: 'partMaintenance', title: '零件档案', width: 100 }, { dataIndex: 'matRef', title: '材质', width: 90 },
  { dataIndex: 'thickness', title: '厚度', width: 75 }, { dataIndex: 'quantity', title: '数量', width: 75 },
  { dataIndex: 'cusRef', title: '计划跟踪号', width: 160 }, { dataIndex: 'wrkRef', title: '设备', width: 110 },
  { dataIndex: 'jobName', title: '作业', width: 150 }, { dataIndex: 'sendState', title: '导入状态', width: 100 },
  { dataIndex: 'task', title: '任务', width: 220 },
];
async function load() { loading.value = true; try { const data = await pageOrders({ ...query, page: pager.current, pageSize: pager.pageSize }); rows.value = data.items; total.value = data.total; } finally { loading.value = false; } }
function search() { pager.current = 1; void load(); }
function onSelect(keys: (number | string)[]) { selectedKeys.value = keys.map(Number); }
function selectedRows() { return rows.value.filter((row) => selectedKeys.value.includes(row.id)); }
async function setMachine() { if (!machine.value.trim()) return message.warning('设备不能为空'); await updateOrders(selectedKeys.value.map((id) => ({ id, wrkRef: machine.value.trim() }))); machineVisible.value = false; message.success('设备已更新'); await load(); }
async function setJob() { if (!jobForm.jobName.trim()) return message.warning('作业名称不能为空'); actionLoading.value = true; try { const jobRef = await resolveJob(jobForm.jobName.trim(), jobForm.useOldJob); await updateOrders(selectedKeys.value.map((id) => ({ id, jobName: jobForm.jobName.trim(), jobRef }))); jobVisible.value = false; message.success('作业已设置'); await load(); } finally { actionLoading.value = false; } }
async function invalidate() { await updateOrders(selectedKeys.value.map((id) => ({ id, invalidState: true }))); selectedKeys.value = []; message.success('已作废'); await load(); }
async function importSelected(syncTask: boolean) { if (!selectedKeys.value.length) return message.warning('请选择生产订单'); actionLoading.value = true; try { const task = await importOrders(selectedKeys.value, syncTask); if (syncTask && task.status !== 'SUCCESS') message.error(task.message || '导入失败'); else message.success(syncTask ? task.message || '导入完成' : `任务 ${task.id} 已创建`); await load(); } finally { actionLoading.value = false; } }
async function restart(taskId: number) { await restartImportTask(taskId); message.success('任务已进入重试队列'); await load(); }
onMounted(load);
</script>

<template>
  <Page auto-content-height><Card class="h-full" title="生产订单">
    <Form layout="inline" class="mb-4">
      <FormItem label="生产订单号"><Input v-model:value="query.productionOrderNumber" allow-clear @press-enter="search" /></FormItem>
      <FormItem label="ERP内码"><Input v-model:value="query.productionOrderErpInternalCode" allow-clear /></FormItem>
      <FormItem label="车间"><Input v-model:value="query.productionWorkshopName" allow-clear /></FormItem>
      <FormItem label="图号"><Input v-model:value="query.drawingCode" allow-clear /></FormItem>
      <FormItem label="材质"><Input v-model:value="query.matRef" allow-clear /></FormItem>
      <FormItem><Button type="primary" @click="search">查询</Button></FormItem>
    </Form>
    <Space class="mb-3" wrap>
      <Button :disabled="!selectedKeys.length" @click="machineVisible = true">设置设备</Button>
      <Button :disabled="!selectedKeys.length" @click="jobVisible = true">设置作业</Button>
      <Button type="primary" :disabled="!selectedKeys.length" :loading="actionLoading" @click="importSelected(false)">创建导入任务</Button>
      <Button :disabled="!selectedKeys.length" :loading="actionLoading" @click="importSelected(true)">立即导入</Button>
      <Button danger :disabled="!selectedKeys.length" @click="invalidate">作废</Button>
      <Button @click="exportOrders(query)">导出 CSV</Button>
      <span>已选 {{ selectedRows().length }} 条</span>
    </Space>
    <Table :columns="columns" :data-source="rows" :loading="loading" :pagination="{ current: pager.current, pageSize: pager.pageSize, total, showSizeChanger: true }"
           :row-key="(row: ManufacturingOrder) => row.id" :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelect }" :scroll="{ x: 2100 }"
           @change="(page: any) => { pager.current = page.current; pager.pageSize = page.pageSize; load(); }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'partMaintenance'"><Tag :color="record.partMaintenance ? 'green' : 'red'">{{ record.partMaintenance ? '已维护' : '未维护' }}</Tag></template>
        <template v-else-if="column.dataIndex === 'sendState'"><Tag :color="record.sendState ? 'green' : 'default'">{{ record.sendState ? '已导入' : '未导入' }}</Tag></template>
        <template v-else-if="column.dataIndex === 'task'"><Tag v-if="record.task" :color="record.task.status === 'SUCCESS' ? 'green' : record.task.status === 'FAILED' ? 'red' : 'blue'">{{ record.task.status }}</Tag><Button v-if="record.task?.status === 'FAILED'" type="link" size="small" @click="restart(record.task.id)">重试</Button><span>{{ record.task?.message }}</span></template>
      </template>
    </Table>
    <Modal v-model:open="machineVisible" title="批量设置设备" @ok="setMachine"><FormItem label="设备编码"><Input v-model:value="machine" /></FormItem></Modal>
    <Modal v-model:open="jobVisible" title="设置作业" :confirm-loading="actionLoading" @ok="setJob">
      <FormItem label="作业名称"><Input v-model:value="jobForm.jobName" /></FormItem>
      <Checkbox v-model:checked="jobForm.useOldJob">使用套料软件中已有作业（取消勾选将新建）</Checkbox>
    </Modal>
  </Card></Page>
</template>
