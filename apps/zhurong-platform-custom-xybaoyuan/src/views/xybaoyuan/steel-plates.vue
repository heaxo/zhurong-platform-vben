<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SteelPlate } from '#/api/xybaoyuan';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Popconfirm, Space, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteSteelPlates,
  exportSteelPlates,
  importSteelPlates,
  pageSteelPlates,
  syncErpSteelPlates,
} from '#/api/xybaoyuan';

const selectedRows = ref<SteelPlate[]>([]);
const actionLoading = ref(false);

const searchSchema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'prdRef', label: '物料编号' },
  { component: 'Input', fieldName: 'lotNumber', label: '物料批号' },
  { component: 'Input', fieldName: 'matRef', label: '材质' },
  { component: 'Input', fieldName: 'stockName', label: '仓库' },
];

const gridOptions: VxeTableGridOptions<SteelPlate> = {
  checkboxConfig: { highlight: true, range: true },
  columns: [
    { type: 'checkbox', width: 48 },
    { field: 'prdRef', minWidth: 260, title: '钢板编号' },
    { field: 'prdName', minWidth: 160, title: '名称' },
    { field: 'matRef', minWidth: 100, title: '材质' },
    { field: 'stockName', minWidth: 120, title: '仓库' },
    { field: 'thickness', title: '厚度', width: 80 },
    { field: 'width', title: '宽度', width: 90 },
    { field: 'length', title: '长度', width: 90 },
    { field: 'quantity', title: '数量', width: 80 },
    { field: 'tons', title: '吨数', width: 90 },
    {
      field: 'sendState',
      slots: { default: 'sendState' },
      title: '导入状态',
      width: 110,
    },
    {
      field: 'task',
      minWidth: 180,
      slots: { default: 'task' },
      title: '最近导入结果',
    },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      async query({ page }, formValues) {
        const result = await pageSteelPlates({
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

const [Grid, gridApi] = useVbenVxeGrid<SteelPlate>({
  formOptions: {
    collapsed: false,
    schema: searchSchema,
    submitOnChange: false,
  },
  gridEvents: {
    checkboxAll: handleSelectionChange,
    checkboxChange: handleSelectionChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions,
});

function handleSelectionChange({ records }: { records: SteelPlate[] }) {
  selectedRows.value = records;
}

async function refreshGrid() {
  selectedRows.value = [];
  await gridApi.grid.clearCheckboxRow();
  await gridApi.query();
}

async function syncErp() {
  actionLoading.value = true;
  try {
    const count = await syncErpSteelPlates(await gridApi.formApi.getValues());
    message.success(`同步完成，共 ${count} 种钢板`);
    await refreshGrid();
  } finally {
    actionLoading.value = false;
  }
}

async function importSelected() {
  if (selectedRows.value.length === 0) return message.warning('请选择钢板');
  actionLoading.value = true;
  try {
    const result = await importSteelPlates(
      selectedRows.value.map((row) => row.id),
    );
    if (result.status === 'SUCCESS') {
      message.success(result.message || '导入成功');
    } else {
      message.error(result.message || '导入失败');
    }
    await refreshGrid();
  } finally {
    actionLoading.value = false;
  }
}

async function removeSelected() {
  if (selectedRows.value.length === 0) return;
  await deleteSteelPlates(selectedRows.value.map((row) => row.id));
  message.success('删除成功');
  await refreshGrid();
}

async function exportData() {
  await exportSteelPlates(await gridApi.formApi.getValues());
}
</script>

<template>
  <Page auto-content-height content-class="!overflow-hidden">
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button :loading="actionLoading" @click="syncErp">从 ERP 同步</Button>
          <Button
            type="primary"
            :disabled="selectedRows.length === 0"
            :loading="actionLoading"
            @click="importSelected"
          >
            导入到套料软件
          </Button>
          <Popconfirm title="确认删除所选钢板？" @confirm="removeSelected">
            <Button danger :disabled="selectedRows.length === 0">
              批量删除
            </Button>
          </Popconfirm>
          <Button @click="exportData">导出 CSV</Button>
          <!-- prettier-ignore -->
          <span class="text-muted-foreground">已选 {{ selectedRows.length }} 条</span>
        </Space>
      </template>
      <template #sendState="{ row }">
        <Tag :color="row.sendState ? 'green' : 'default'">
          {{ row.sendState ? '已导入' : '未导入' }}
        </Tag>
      </template>
      <template #task="{ row }">
        <Tag
          v-if="row.task"
          :color="row.task.status === 'SUCCESS' ? 'green' : 'red'"
        >
          {{ row.task.status === 'SUCCESS' ? '成功' : '失败' }}
        </Tag>
        <span class="ml-1">{{ row.task?.message }}</span>
      </template>
    </Grid>
  </Page>
</template>
