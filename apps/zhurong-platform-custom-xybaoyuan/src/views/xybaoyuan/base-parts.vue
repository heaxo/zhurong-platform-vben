<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, InputNumber, message, Modal, Space, Table, Tag } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';

import type { BasePart } from '#/api/xybaoyuan';
import { createBasePart, deleteBaseParts, exportBaseParts, pageBaseParts } from '#/api/xybaoyuan';

const loading = ref(false);
const rows = ref<BasePart[]>([]);
const selectedKeys = ref<number[]>([]);
const total = ref(0);
const pager = reactive({ current: 1, pageSize: 20 });
const query = reactive({ drawingCode: '', matRef: '', prdName: '', prdRef: '' });
const createVisible = ref(false);
const saving = ref(false);
const form = reactive<Partial<BasePart>>({ drawingCode: '', matRef: '', prdName: '', prdRef: '', thickness: 1 });

const columns = [
  { dataIndex: 'prdRef', title: '零件编号', width: 170 }, { dataIndex: 'prdName', title: '零件名称', width: 180 },
  { dataIndex: 'drawingCode', title: '图号', width: 180 }, { dataIndex: 'matRef', title: '材质', width: 120 },
  { dataIndex: 'thickness', title: '厚度', width: 90 }, { dataIndex: 'partMaintenance', title: '套料软件档案', width: 120 },
  { dataIndex: 'udata1', title: '扩展字段1', width: 140 }, { dataIndex: 'udata2', title: '扩展字段2', width: 140 },
];

async function load() {
  loading.value = true;
  try {
    const data = await pageBaseParts({ ...query, page: pager.current, pageSize: pager.pageSize });
    rows.value = data.items; total.value = data.total;
  } finally { loading.value = false; }
}
function search() { pager.current = 1; void load(); }
function onSelect(keys: (number | string)[]) { selectedKeys.value = keys.map(Number); }
function reset() { Object.assign(query, { drawingCode: '', matRef: '', prdName: '', prdRef: '' }); search(); }
async function save() {
  if (!form.prdRef || !form.drawingCode) return message.warning('零件编号和图号不能为空');
  saving.value = true;
  try { await createBasePart(form); message.success('创建成功'); createVisible.value = false; await load(); }
  finally { saving.value = false; }
}
function removeSelected() {
  if (!selectedKeys.value.length) return message.warning('请选择基础零件');
  Modal.confirm({ title: '确认删除所选基础零件？', async onOk() { await deleteBaseParts(selectedKeys.value); selectedKeys.value = []; message.success('删除成功'); await load(); } });
}
onMounted(load);
</script>

<template>
  <Page auto-content-height>
    <Card class="h-full" title="基础零件">
      <Form layout="inline" class="mb-4">
        <FormItem label="零件编号"><Input v-model:value="query.prdRef" allow-clear @press-enter="search" /></FormItem>
        <FormItem label="零件名称"><Input v-model:value="query.prdName" allow-clear @press-enter="search" /></FormItem>
        <FormItem label="图号"><Input v-model:value="query.drawingCode" allow-clear @press-enter="search" /></FormItem>
        <FormItem label="材质"><Input v-model:value="query.matRef" allow-clear @press-enter="search" /></FormItem>
        <FormItem><Space><Button type="primary" @click="search">查询</Button><Button @click="reset">重置</Button></Space></FormItem>
      </Form>
      <Space class="mb-3">
        <Button type="primary" @click="createVisible = true">新增</Button>
        <Button danger :disabled="!selectedKeys.length" @click="removeSelected">批量删除</Button>
        <Button @click="exportBaseParts(query)">导出 CSV</Button>
      </Space>
      <Table :columns="columns" :data-source="rows" :loading="loading" :pagination="{ current: pager.current, pageSize: pager.pageSize, total, showSizeChanger: true }"
             :row-key="(row: BasePart) => row.id" :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelect }"
             :scroll="{ x: 1200 }" @change="(page: any) => { pager.current = page.current; pager.pageSize = page.pageSize; load(); }">
        <template #bodyCell="{ column, record }"><template v-if="column.dataIndex === 'partMaintenance'"><Tag :color="record.partMaintenance ? 'green' : 'orange'">{{ record.partMaintenance ? '已维护' : '未维护' }}</Tag></template></template>
      </Table>
    </Card>
    <Modal v-model:open="createVisible" title="新增基础零件" :confirm-loading="saving" @ok="save">
      <Form :label-col="{ span: 6 }">
        <FormItem label="零件编号" required><Input v-model:value="form.prdRef" /></FormItem>
        <FormItem label="零件名称"><Input v-model:value="form.prdName" /></FormItem>
        <FormItem label="图号" required><Input v-model:value="form.drawingCode" /></FormItem>
        <FormItem label="材质"><Input v-model:value="form.matRef" /></FormItem>
        <FormItem label="厚度" required><InputNumber v-model:value="form.thickness" :min="0.01" class="w-full" /></FormItem>
        <FormItem label="扩展字段1"><Input v-model:value="form.udata1" /></FormItem>
        <FormItem label="扩展字段2"><Input v-model:value="form.udata2" /></FormItem>
        <FormItem label="ERP物料内码"><Input v-model:value="form.udata3" placeholder="回传金蝶时作为零件物料内码" /></FormItem>
      </Form>
    </Modal>
  </Page>
</template>
