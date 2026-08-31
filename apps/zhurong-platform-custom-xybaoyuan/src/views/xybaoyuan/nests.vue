<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Popconfirm, Space, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  pageNests,
  sendNestFeedback,
  withdrawNestFeedback,
} from '#/api/xybaoyuan';

type NestRow = Recordable<any>;

const selectedRows = ref<NestRow[]>([]);
const actionLoading = ref(false);

const searchSchema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'nstRef', label: '套料编号' },
  { component: 'Input', fieldName: 'jobRef', label: '作业' },
  { component: 'Input', fieldName: 'wrkRef', label: '设备' },
  {
    component: 'InputNumber',
    componentProps: { class: 'w-full', controls: false },
    fieldName: 'mState',
    label: '程序状态',
  },
];

const feedbackSchema: VbenFormSchema[] = [
  {
    component: 'Select',
    componentProps: {
      style:{
        width:'100%',
      },
      options: [
        { label: 'BM000004-生产车间', value: 'BM000004' },
      ],
      showSearch: true,
    },
    defaultValue: 'BM000004',
    fieldName: 'productionWorkshopCode',
    label: '生产车间',
    rules: 'selectRequired',
  },
  {
    component: 'Checkbox',
    defaultValue: true,
    fieldName: 'materialReceived',
    label: '领料',
  },
];

const [FeedbackForm, feedbackFormApi] = useVbenForm({
  schema: feedbackSchema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [FeedbackModal, feedbackModalApi] = useVbenModal({
  class: 'w-[560px]',
  async onConfirm() {
    const { valid } = await feedbackFormApi.validate();
    if (!valid) return;
    const values = await feedbackFormApi.getValues();
    feedbackModalApi.lock();
    actionLoading.value = true;
    try {
      await sendNestFeedback(
        selectedRows.value.map((row) => getRowId(row)),
        values.productionWorkshopCode,
        Boolean(values.materialReceived),
      );
      message.success('反馈成功');
      await feedbackModalApi.close();
      await refreshGrid();
    } finally {
      actionLoading.value = false;
      feedbackModalApi.unlock();
    }
  },
  async onOpenChange(open) {
    if (!open) return;
    await feedbackFormApi.resetForm();
    await feedbackFormApi.setValues({ materialReceived: true });
  },
  title: '发送套料反馈',
});

const gridOptions: VxeTableGridOptions<NestRow> = {
  checkboxConfig: { highlight: true, range: true },
  columns: [
    { type: 'checkbox', width: 48 },
    { field: 'nstRef', minWidth: 160, title: '套料编号' },
    { field: 'jobRef', minWidth: 150, title: '作业' },
    { field: 'wrkRef', minWidth: 110, title: '设备' },
    {
      field: 'mState',
      slots: { default: 'mState' },
      title: '程序状态',
      width: 100,
    },
    { field: 'matRef', minWidth: 90, title: '材质' },
    { field: 'sthickness', title: '厚度', width: 75 },
    { field: 'slength', title: '板长', width: 90 },
    { field: 'swidth', title: '板宽', width: 90 },
    { field: 'quantity', title: '数量', width: 75 },
    {
      field: 'sprofit',
      slots: { default: 'sProfit' },
      title: '利用率',
      width: 90,
    },
    {
      field: 'feedbackSent',
      slots: { default: 'feedbackSent' },
      title: '金蝶反馈',
      width: 110,
    },
    { field: 'feedbackTime', minWidth: 170, title: '反馈时间' },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      async query({ page }, formValues) {
        const result = await pageNests({
          ...formValues,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return { ...result, total: Number(result.total) };
      },
    },
  },
  rowConfig: { keyField: 'recID' },
  toolbarConfig: {
    custom: true,
    refresh: { code: 'query' },
    search: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid<NestRow>({
  formOptions: {
    collapsed: true,
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

function handleSelectionChange({ records }: { records: NestRow[] }) {
  selectedRows.value = records;
}

function getRowId(row: NestRow) {
  return String(row.recID ?? row.recId);
}

async function refreshGrid() {
  selectedRows.value = [];
  await gridApi.grid.clearCheckboxRow();
  await gridApi.query();
}

async function withdraw() {
  if (selectedRows.value.length === 0) return;
  await withdrawNestFeedback(selectedRows.value.map((row) => getRowId(row)));
  message.success('撤销成功');
  await refreshGrid();
}
</script>

<template>
  <Page auto-content-height content-class="!overflow-hidden">
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button
            type="primary"
            :disabled="selectedRows.length === 0"
            @click="feedbackModalApi.open()"
          >
            发送金蝶反馈
          </Button>
          <Popconfirm title="确认撤销所选套料反馈？" @confirm="withdraw">
            <Button danger :disabled="selectedRows.length === 0">
              撤销反馈
            </Button>
          </Popconfirm>
          <span class="text-muted-foreground">
            仅“已送车间”(MState=40)程序允许反馈；已选
            {{ selectedRows.length }} 条
          </span>
        </Space>
      </template>
      <template #mState="{ row }">
        <Tag :color="row.mstate === 40 ? 'green' : 'default'">
          {{ row.mstate === 40 ? '已送车间' : '编程中' }}
        </Tag>
      </template>
      <template #feedbackSent="{ row }">
        <Tag :color="row.feedbackSent ? 'green' : 'default'">
          {{ row.feedbackSent ? '已反馈' : '未反馈' }}
        </Tag>
      </template>
      <template #sProfit="{ row }">
        {{ row.sprofit == null ? '' : `${(row.sprofit).toFixed(2)}%` }}
      </template>
    </Grid>
    <FeedbackModal><FeedbackForm /></FeedbackModal>
  </Page>
</template>
