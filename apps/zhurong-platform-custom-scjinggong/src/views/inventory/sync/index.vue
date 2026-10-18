<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ZhurongScjinggongSteelplateinventoryVO } from '#/api';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { ExportOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { Button, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  requestGetZhurongScjinggongSteelplateinventoryPage,
  requestImportZhurongScjinggongSteelplateinventoryToExpert,
  requestSyncZhurongScjinggongSteelplateinventory,
} from '#/api';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useColumns, useGridFormSchema } from './data';

const selectedRows = ref<ZhurongScjinggongSteelplateinventoryVO[]>([]);
const syncLoading = ref(false);
const importLoading = ref(false);

const warehouseOptions = [
  { label: '采购原材料库（101）', value: '101' },
  { label: '老厂原材料库（102）', value: '102' },
  { label: '薄板数控组合（301）', value: '301' },
  { label: '厚板数控组合（310）', value: '310' },
  { label: '利福特钣金组合（320）', value: '320' },
  { label: '配重钣金原材料库（A1001）', value: 'A1001' },
];

const syncSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    componentProps: {
      allowClear: true,
      class: 'w-full',
      placeholder: '物料编码',
    },
    fieldName: 'invcode',
    label: '物料编码',
  },
  /*{
    component: 'Select',
    componentProps: {
      allowClear: true,
      class: 'w-full',
      options: warehouseOptions,
      placeholder: '请选择仓库',
    },
    fieldName: 'invcode',
    label: '仓库',
    rules: 'selectRequired',
  },*/
];

const [SyncForm, syncFormApi] = useVbenForm({
  schema: syncSchema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [SyncModal, syncModalApi] = useVbenModal({
  class: 'w-[560px]',
  draggable: true,
  fullscreenButton: false,
  async onConfirm() {
    const { valid } = await syncFormApi.validate();
    if (!valid) return;

    const values = await syncFormApi.getValues();
    const invcode = String(values.invcode ?? '').trim();

    syncLoading.value = true;
    syncModalApi.lock();
    try {
      const result = await requestSyncZhurongScjinggongSteelplateinventory({
        invcode,
      });
      if (result) {
        message.success('库存同步完成');
      } else {
        message.warning('未查询到库存数据');
      }
      await syncModalApi.close();
      await refreshGrid();
    } finally {
      syncLoading.value = false;
      syncModalApi.unlock();
    }
  },
  async onOpenChange(open) {
    if (open) await syncFormApi.resetForm();
  },
  title: '库存同步',
});

function handleSelectionChange({
  records,
}: {
  records: ZhurongScjinggongSteelplateinventoryVO[];
}) {
  selectedRows.value = records;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    collapsed: true,
    wrapperClass:'grid-cols-5',
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridEvents: {
    checkboxAll: handleSelectionChange,
    checkboxChange: handleSelectionChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions: {
    checkboxConfig: {
      range: true,
    },
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    loading: false,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const data = await requestGetZhurongScjinggongSteelplateinventoryPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            },
          );
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
    virtualYConfig: {
      enabled: true,
      gt: 50,
    },
  } as VxeTableGridOptions<ZhurongScjinggongSteelplateinventoryVO>,
});

async function refreshGrid() {
  selectedRows.value = [];
  await gridApi.grid.clearCheckboxRow();
  await gridApi.query();
}

async function importToExpert() {
  if (selectedRows.value.length === 0) {
    return message.warning('请选择钢板库存');
  }

  const ids = selectedRows.value
    .map((row) => row.id)
    .filter((id) => id !== undefined && id !== null)
    .map(String);

  if (ids.length === 0) {
    return message.warning('所选钢板库存缺少ID');
  }

  importLoading.value = true;
  try {
    const result =
      await requestImportZhurongScjinggongSteelplateinventoryToExpert({
        ids,
      });
    if (result) {
      message.success('导入成功');
    } else {
      message.warning('导入失败');
    }
    await refreshGrid();
  } finally {
    importLoading.value = false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button :loading="syncLoading" @click="syncModalApi.open()">
            <template #icon>
              <SyncOutlined />
            </template>
            库存同步
          </Button>
          <Button
            type="primary"
            :disabled="selectedRows.length === 0"
            :loading="importLoading"
            @click="importToExpert"
          >
            <template #icon>
              <ExportOutlined />
            </template>
            导入到Expert
          </Button>
          <span class="text-muted-foreground">
            已选 {{ selectedRows.length }} 条
          </span>
        </Space>
      </template>
    </Grid>
    <SyncModal><SyncForm /></SyncModal>
  </Page>
</template>

<style scoped></style>
