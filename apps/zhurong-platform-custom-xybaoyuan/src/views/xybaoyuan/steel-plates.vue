<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, message, Modal, Space, Table, Tag } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';

import type { SteelPlate } from '#/api/xybaoyuan';
import { deleteSteelPlates, exportSteelPlates, importSteelPlates, pageSteelPlates, syncErpSteelPlates } from '#/api/xybaoyuan';

const loading = ref(false); const actionLoading = ref(false); const rows = ref<SteelPlate[]>([]); const selectedKeys = ref<number[]>([]); const total = ref(0);
const pager = reactive({ current: 1, pageSize: 20 }); const query = reactive({ lotNumber: '', matRef: '', prdRef: '', stockName: '' });
const columns = [
  { dataIndex: 'prdRef', title: '钢板编号', width: 260 }, { dataIndex: 'prdName', title: '名称', width: 160 },
  { dataIndex: 'matRef', title: '材质', width: 100 }, { dataIndex: 'stockName', title: '仓库', width: 120 },
  { dataIndex: 'thickness', title: '厚度', width: 80 }, { dataIndex: 'width', title: '宽度', width: 90 },
  { dataIndex: 'length', title: '长度', width: 90 }, { dataIndex: 'quantity', title: '数量', width: 80 },
  { dataIndex: 'tons', title: '吨数', width: 90 }, { dataIndex: 'sendState', title: '导入状态', width: 110 },
  { dataIndex: 'task', title: '任务', width: 180 },
];
async function load() { loading.value = true; try { const data = await pageSteelPlates({ ...query, page: pager.current, pageSize: pager.pageSize }); rows.value = data.items; total.value = data.total; } finally { loading.value = false; } }
function search() { pager.current = 1; void load(); }
function onSelect(keys: (number | string)[]) { selectedKeys.value = keys.map(Number); }
async function syncErp() { actionLoading.value = true; try { const count = await syncErpSteelPlates(query); message.success(`同步完成，共 ${count} 种钢板`); await load(); } finally { actionLoading.value = false; } }
async function importSelected(syncTask: boolean) { if (!selectedKeys.value.length) return message.warning('请选择钢板'); actionLoading.value = true; try { const task = await importSteelPlates(selectedKeys.value, syncTask); if (syncTask && task.status !== 'SUCCESS') message.error(task.message || '导入失败'); else message.success(syncTask ? task.message || '导入完成' : `任务 ${task.id} 已创建`); await load(); } finally { actionLoading.value = false; } }
function removeSelected() { if (!selectedKeys.value.length) return; Modal.confirm({ title: '确认删除所选钢板？', async onOk() { await deleteSteelPlates(selectedKeys.value); selectedKeys.value = []; await load(); } }); }
onMounted(load);
</script>

<template>
  <Page auto-content-height><Card class="h-full" title="钢板库存">
    <Form layout="inline" class="mb-4">
      <FormItem label="物料编号"><Input v-model:value="query.prdRef" allow-clear @press-enter="search" /></FormItem>
      <FormItem label="物料批号"><Input v-model:value="query.lotNumber" allow-clear @press-enter="search" /></FormItem>
      <FormItem label="材质"><Input v-model:value="query.matRef" allow-clear /></FormItem>
      <FormItem label="仓库"><Input v-model:value="query.stockName" allow-clear /></FormItem>
      <FormItem><Space><Button type="primary" @click="search">查询</Button><Button :loading="actionLoading" @click="syncErp">从 ERP 同步</Button></Space></FormItem>
    </Form>
    <Space class="mb-3">
      <Button type="primary" :disabled="!selectedKeys.length" :loading="actionLoading" @click="importSelected(false)">创建导入任务</Button>
      <Button :disabled="!selectedKeys.length" :loading="actionLoading" @click="importSelected(true)">立即导入</Button>
      <Button danger :disabled="!selectedKeys.length" @click="removeSelected">批量删除</Button>
      <Button @click="exportSteelPlates(query)">导出 CSV</Button>
    </Space>
    <Table :columns="columns" :data-source="rows" :loading="loading" :pagination="{ current: pager.current, pageSize: pager.pageSize, total, showSizeChanger: true }"
           :row-key="(row: SteelPlate) => row.id" :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelect }" :scroll="{ x: 1400 }"
           @change="(page: any) => { pager.current = page.current; pager.pageSize = page.pageSize; load(); }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'sendState'"><Tag :color="record.sendState ? 'green' : 'default'">{{ record.sendState ? '已导入' : '未导入' }}</Tag></template>
        <template v-else-if="column.dataIndex === 'task'"><Tag v-if="record.task" :color="record.task.status === 'SUCCESS' ? 'green' : record.task.status === 'FAILED' ? 'red' : 'blue'">{{ record.task.status }}</Tag><span class="ml-1">{{ record.task?.message }}</span></template>
      </template>
    </Table>
  </Card></Page>
</template>
