<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PartReportRow, ReportQuery } from '#/api';

import { ref } from 'vue';

import { Button, Image, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportPartReport, getPartReport } from '#/api';

/** 查询条件与列只属于零件清单；新增报表可复制本组件再调整。 */
const schema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'jobRef', label: '作业号', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'prdRef', label: '物料编码', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'customerPartNo', label: '客户件号', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'ordRef', label: '批次号', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'matRef', label: '材质', componentProps: { allowClear: true } },
  { component: 'Input', fieldName: 'process', label: '工序', componentProps: { allowClear: true } },
];
const columns: VxeTableGridOptions<PartReportRow>['columns'] = [
  { field: 'partSequence', title: '零件序号', minWidth: 100 },
  { field: 'productCode', title: '物料编码', minWidth: 170 },
  { field: 'imageDataUri', title: '简图', slots: { default: 'image' }, minWidth: 105 },
  { field: 'quantity', title: '数量', minWidth: 95 },
  { field: 'customerPartNo', title: '客户件号', minWidth: 150 },
  { field: 'batchNo', title: '批次号', minWidth: 135 },
  { field: 'material', title: '材质', minWidth: 110 },
  { field: 'thickness', title: '厚度', minWidth: 90 },
  { field: 'process', title: '工序', minWidth: 130 },
];
const lastQuery = ref<ReportQuery>({});
const exporting = ref(false);

const [Grid] = useVbenVxeGrid<PartReportRow>({
  formOptions: {
    schema, submitOnChange: false, wrapperClass: 'grid-cols-3',
    collapsed: true,
  },
  gridOptions: {
    columns,
    height: '100%',
    pagerConfig: { pageSize: 50, pageSizes: [20, 50, 100, 200] },
    proxyConfig: {
      ajax: {
        query: ({ page }, values) => {
          lastQuery.value = { ...values };
          return getPartReport({ ...lastQuery.value, page: page.currentPage, pageSize: page.pageSize });
        },
      },
    },
    toolbarConfig: { custom: true, export: false, refresh: { code: 'query' }, search: true, zoom: true },
  } as VxeTableGridOptions<PartReportRow>,
});

async function onExport() {
  exporting.value = true;
  try {
    await exportPartReport(lastQuery.value);
  } catch (error) {
    message.error(error instanceof Error ? error.message : '导出失败');
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <Grid>
    <template #toolbar-actions>
      <slot name="toolbar-actions" />
    </template>
    <template #image="{ row }">
      <Image v-if="row.imageDataUri" :src="row.imageDataUri" :width="55" :height="38" />
      <span v-else>-</span>
    </template>
    <template #toolbar-tools>
      <Button :loading="exporting" type="primary" @click="onExport">导出当前筛选结果</Button>
    </template>
  </Grid>
</template>
