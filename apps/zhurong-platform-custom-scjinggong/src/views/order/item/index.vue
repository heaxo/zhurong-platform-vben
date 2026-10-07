<script lang="ts" setup>
import { useVbenVxeGrid, type VxeTableGridOptions } from '#/adapter/vxe-table';
import { useColumns, useGridFormSchema } from './data';
import type { ZhurongScjinggongOrderitemVO } from '#/api';
import {
  requestGetZhurongScjinggongOrderitemPage,
  requestImportZhurongScjinggongOrderitemToExpert,
} from '#/api';

import { Page, useVbenDrawer } from '@vben/common-ui';
import {
  JobSelectModal,
  type JobSelectModalExpose,
  type JobSelectResult,
} from '@zhurong/components';
import {Button, message, Tag} from 'ant-design-vue';
import Form from './modules/form.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type OrderItemRow = ZhurongScjinggongOrderitemVO & {
  jobName?: string;
  jobRef?: string;
};

const [FormDrawer] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const selectedRows = ref<OrderItemRow[]>([]);
const route = useRoute();
const actionLoading = ref(false);
const jobSelectModalRef = ref<JobSelectModalExpose>();

function handleSelectionChange({ records }: { records: OrderItemRow[] }) {
  selectedRows.value = records;
}

function getRouteOrderId() {
  const rawOrderId = route.query.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  return orderId;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    wrapperClass: 'grid-cols-5',
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
    collapsed: true,
  },
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionChange,
  },
  gridOptions: {
    virtualYConfig: {
      enabled: true,
      gt: 50,
    },
    loading: false,
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const orderId = getRouteOrderId();
          const data = await requestGetZhurongScjinggongOrderitemPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            ...(orderId === undefined ? {} : { orderId }),
          });
          return data;
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<OrderItemRow>,
});

watch(
  () => route.query.orderId,
  () => {
    void gridApi.query();
  },
);

function successHandler() {
  message.success('操作成功');
  onRefresh();
}

function onRefresh() {
  gridApi.query();
}

async function refreshGrid() {
  selectedRows.value = [];
  await gridApi.grid.clearCheckboxRow();
  await gridApi.query();
}

function openJobSelector() {
  if (selectedRows.value.length === 0) return message.warning('请选择生产订单');
  jobSelectModalRef.value?.open({
    jobRefs: [
      ...new Set(
        selectedRows.value
          .map((row) => row.jobRef)
          .filter((jobRef): jobRef is string => Boolean(jobRef)),
      ),
    ],
  });
}

async function onJobSelectConfirm(payload: JobSelectResult) {
  const rows = selectedRows.value.filter(
    (row): row is OrderItemRow & { id: number } =>
      row.id !== undefined && row.id !== null,
  );
  if (rows.length === 0) return message.warning('请选择有效的生产订单');
  if (payload.mode === 'existing' && !payload.jobRef) {
    return message.warning('请选择一个已有作业');
  }

  actionLoading.value = true;
  try {
    const ids = rows.map((row) => String(row.id));
    const success = await requestImportZhurongScjinggongOrderitemToExpert(
      payload.mode === 'existing'
        ? {
            ids,
            jobRef: payload.jobRef,
          }
        : {
            ids,
            jobName: payload.jobName,
            jobPath: payload.jobPath ?? '',
          },
    );
    if (success) {
      message.success('导入成功');
    } else {
      message.warning('导入已执行，请稍后刷新确认导入状态');
    }
    await refreshGrid();
  } finally {
    actionLoading.value = false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="successHandler" />
    <Grid>
      <template #toolbar-tools>
        <Button
          :disabled="selectedRows.length === 0"
          :loading="actionLoading"
          type="primary"
          @click="openJobSelector"
        >
          导入到套料软件
        </Button>
      </template>
      <template #toolbar-actions> </template>

      <template #partIssued="{ row }">
        <Tag :color="row.partIssued ? 'green' : 'default'">
          {{ row.partIssued ? '已下发' : '未下发' }}
        </Tag>
      </template>
    </Grid>

    <JobSelectModal ref="jobSelectModalRef" @confirm="onJobSelectConfirm" />
  </Page>
</template>

<style scoped></style>
