<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BasePart } from '#/api/xybaoyuan';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Popconfirm, Space, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createBasePart,
  deleteBaseParts,
  exportBaseParts,
  pageBaseParts,
} from '#/api/xybaoyuan';

const selectedRows = ref<BasePart[]>([]);

const searchSchema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'prdRef', label: '零件编码' },
  { component: 'Input', fieldName: 'prdName', label: '零件名称' },
  { component: 'Input', fieldName: 'drawingCode', label: '图号' },
  { component: 'Input', fieldName: 'matRef', label: '材质' },
];

const createSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'prdRef',
    label: '零件编码',
    rules: 'required',
  },
  { component: 'Input', fieldName: 'prdName', label: '零件名称' },
  {
    component: 'Input',
    fieldName: 'drawingCode',
    label: '图号',
    rules: 'required',
  },
  { component: 'Input', fieldName: 'matRef', label: '材质' },
  {
    component: 'InputNumber',
    componentProps: { class: 'w-full', min: 0.01 },
    fieldName: 'thickness',
    label: '厚度',
    rules: 'required',
  },
  { component: 'Input', fieldName: 'udata1', label: '扩展字段1' },
  { component: 'Input', fieldName: 'udata2', label: '扩展字段2' },
  {
    component: 'Input',
    componentProps: { placeholder: '回传金蝶时作为零件物料内码' },
    fieldName: 'udata3',
    label: 'ERP物料内码',
  },
];

const [CreateForm, createFormApi] = useVbenForm({
  schema: createSchema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const [CreateModal, createModalApi] = useVbenModal({
  class: 'w-[760px]',
  destroyOnClose: false,
  async onConfirm() {
    const { valid } = await createFormApi.validate();
    if (!valid) return;
    createModalApi.lock();
    try {
      await createBasePart(await createFormApi.getValues());
      message.success('创建成功');
      await createModalApi.close();
      await refreshGrid();
    } finally {
      createModalApi.unlock();
    }
  },
  async onOpenChange(open) {
    if (!open) return;
    await createFormApi.resetForm();
    await createFormApi.setValues({ thickness: 1 });
  },
  title: '新增基础零件',
});

const gridOptions: VxeTableGridOptions<BasePart> = {
  checkboxConfig: { highlight: true, range: true },
  columns: [
    { type: 'checkbox', width: 48 },
    { field: 'prdRef', minWidth: 170, title: '零件编码' },
    { field: 'prdName', minWidth: 180, title: '零件名称' },
    { field: 'drawingCode', minWidth: 180, title: '图号' },
    { field: 'matRef', minWidth: 120, title: '材质' },
    { field: 'thickness', title: '厚度', width: 90 },
    {
      field: 'partMaintenance',
      slots: { default: 'partMaintenance' },
      title: '套料软件档案',
      width: 120,
    },
    { field: 'udata1', minWidth: 140, title: '扩展字段1' },
    { field: 'udata2', minWidth: 140, title: '扩展字段2' },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      async query({ page }, formValues) {
        const result = await pageBaseParts({
          ...formValues,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return { ...result, total: Number(result.total) };
      },
    },
  },
  rowConfig: { keyField: 'id' },
  toolbarConfig: {
    custom: true,
    refresh: { code: 'query' },
    search: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid<BasePart>({
  formOptions: {
    collapsed: true,
    schema: searchSchema,
    submitOnChange: false,
    wrapperClass: 'grid-cols-4',
  },
  gridEvents: {
    checkboxAll: handleSelectionChange,
    checkboxChange: handleSelectionChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions,
});

function handleSelectionChange({ records }: { records: BasePart[] }) {
  selectedRows.value = records;
}

async function refreshGrid() {
  selectedRows.value = [];
  await gridApi.grid.clearCheckboxRow();
  await gridApi.query();
}

async function removeSelected() {
  if (selectedRows.value.length === 0) return;
  await deleteBaseParts(selectedRows.value.map((row) => row.id));
  message.success('删除成功');
  await refreshGrid();
}

async function exportData() {
  await exportBaseParts(await gridApi.formApi.getValues());
}
</script>

<template>
  <Page auto-content-height content-class="!overflow-hidden">
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button type="primary" @click="createModalApi.open()">新增</Button>
          <Popconfirm title="确认删除所选基础零件？" @confirm="removeSelected">
            <Button danger :disabled="selectedRows.length === 0">
              批量删除
            </Button>
          </Popconfirm>
          <Button @click="exportData">导出 CSV</Button>
          <!-- prettier-ignore -->
          <span class="text-muted-foreground">已选 {{ selectedRows.length }} 条</span>
        </Space>
      </template>
      <template #partMaintenance="{ row }">
        <Tag :color="row.partMaintenance ? 'green' : 'orange'">
          {{ row.partMaintenance ? '已维护' : '未维护' }}
        </Tag>
      </template>
    </Grid>
    <CreateModal><CreateForm /></CreateModal>
  </Page>
</template>
