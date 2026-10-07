<script lang="ts" setup>
import { useVbenVxeGrid, type VxeTableGridOptions } from '#/adapter/vxe-table';
import { useColumns, useGridFormSchema } from './data';
import { requestGetZhurongScjinggongOrderPage } from '#/api';
import type { ZhurongScjinggongOrderVO } from '#/api';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Button, message } from 'ant-design-vue';
import Form from './modules/form.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const selectedRows = ref<ZhurongScjinggongOrderVO[]>([]);
const router = useRouter();

const [FormDrawer] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

function handleSelectionChange({
  records,
}: {
  records: ZhurongScjinggongOrderVO[];
}) {
  selectedRows.value = records;
}
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
    collapsed: true,
  },
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionChange,
  },
  gridOptions: {
    virtualYConfig: {
      enabled: true, // 开启纵向虚拟滚动
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
          const data = await requestGetZhurongScjinggongOrderPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
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
  } as VxeTableGridOptions<ZhurongScjinggongOrderVO>,
});

function successHandler() {
  message.success('操作成功');
  onRefresh();
}
function onRefresh() {
  gridApi.query();
}
function onOrderCodeClick(row: ZhurongScjinggongOrderVO) {
  if (row.id === undefined || row.id === null) return;
  void router.push({
    path: '/order/item',
    query: { orderId: `${row.id}` },
  });
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="successHandler" />
    <Grid>
      <template #orderCode="{ row }">
        <Button
          v-if="row.orderCode"
          class="!px-0"
          size="small"
          type="link"
          @click="onOrderCodeClick(row)"
        >
          {{ row.orderCode }}
        </Button>
        <span v-else>-</span>
      </template>
      <template #toolbar-tools>
        <!--                <Button type="primary" @click="onCreate">-->
        <!--                    <Plus class="size-5" />-->
        <!--                    {{ $t('ui.actionTitle.create') }}-->
        <!--                </Button>-->
      </template>
      <template #toolbar-actions> </template>
    </Grid>
  </Page>
</template>

<style scoped></style>
