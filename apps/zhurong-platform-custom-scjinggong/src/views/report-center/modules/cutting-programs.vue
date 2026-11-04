<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CuttingProgramRow, ReportQuery } from '#/api';

import { ref } from 'vue';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportCuttingProgramReport, getCuttingProgramReport } from '#/api';

/** 每份报表自行定义查询条件和列；与后端 ReportQuery 字段及 SQL 别名对应。 */
const schema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'jobRef', label: '作业号', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'cnc', label: '程序号', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'matRef', label: '材质', componentProps: { allowClear: true } },
];
const columns: VxeTableGridOptions<CuttingProgramRow>['columns'] = [
  { field: 'cnc', title: '程序号', minWidth: 160 },
  { field: 'plateSize', title: '钢板尺寸', minWidth: 170 },
  { field: 'material', title: '材质', minWidth: 130 },
  { field: 'quantity', title: '数量', minWidth: 100 },
  { field: 'totalWeight', title: '钢板总重量', minWidth: 135 },
  { field: 'utilization', title: '整板利用率', minWidth: 120 },
  { field: 'utilizationWithoutRemnant', title: '去除余料利用率', minWidth: 150 },
];
const lastQuery = ref<ReportQuery>({});
const exporting = ref(false);

const [Grid] = useVbenVxeGrid<CuttingProgramRow>({
  formOptions: { schema, submitOnChange: false, wrapperClass: 'grid-cols-3',
    collapsed: true, },
  gridOptions: {
    columns,
    height: '100%',
    pagerConfig: { pageSize: 50, pageSizes: [20, 50, 100, 200] },
    proxyConfig: {
      ajax: {
        query: ({ page }, values) => {
          lastQuery.value = { ...values };
          return getCuttingProgramReport({ ...lastQuery.value, page: page.currentPage, pageSize: page.pageSize });
        },
      },
    },
    toolbarConfig: { custom: true, export: false, refresh: { code: 'query' }, search: true, zoom: true },
  } as VxeTableGridOptions<CuttingProgramRow>,
});

async function onExport() {
  exporting.value = true;
  try {
    await exportCuttingProgramReport(lastQuery.value);
  } catch (error) {
    message.error(error instanceof Error ? error.message : '导出失败');
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <Grid>
    <!-- 由报表中心注入切换控件；本组件仍只负责本报表的查询和导出。 -->
    <template #toolbar-actions>
      <slot name="toolbar-actions" />
    </template>
    <template #toolbar-tools>
      <Button :loading="exporting" type="primary" @click="onExport">导出当前筛选结果</Button>
    </template>
  </Grid>
</template>
