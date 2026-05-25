<script lang="ts" setup>
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {useColumns, useGridFormSchema} from "./data";
import type {AvailableInventoryQtyVO} from "#/api/inventory";
import {requestGetAvailableInventoryQtyList, requestImportInventory} from "#/api/inventory";

import {Page} from '@vben/common-ui';
import {Button, message, Space} from "ant-design-vue";
import {isEmpty} from 'lodash-es';
import {ExportOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";

const selectedRows = ref([]);

function handleSelectionChange({records}) {
  selectedRows.value = records;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
    collapsed: true,
  },
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions: {
    id: "steelPlateGridTable",
    customConfig:{
      storage: true,
    },
    virtualYConfig: {
      enabled: true,   // 开启纵向虚拟滚动
      gt: 50,
    },
    checkboxConfig:{
      range: true
    },
    loading: false,
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async ({page}, formValues) => {
          const data = await requestGetAvailableInventoryQtyList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          tableDataCount.value = data?.length ?? 0;
          return data;
        },
      },
    },
    rowConfig: {
      keyField: 'itemCode',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: {code: 'query'},
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<AvailableInventoryQtyVO>,
});


function onActionClick(e: OnActionClickParams<AvailableInventoryQtyVO>) {
  switch (e.code) {
    case 'delete': {
      break;
    }
    case 'edit': {
      break;
    }
  }
}

const importLoading = ref(false);

async function importToExpert() {
  if (isEmpty(selectedRows.value)) {
    return message.warn("请选中钢板库存");
  }
  const itemCodes = selectedRows.value.map(it => it.itemCode);
  try {
    importLoading.value = true;
    // gridApi.setGridOptions({
    //   loading: true,
    // });
    const msg = await requestImportInventory({
      itemCodes,
    });
    if (msg){
      message.success(msg || "导入成功");
    }
  } finally {
    // gridApi.setGridOptions({
    //   loading: false,
    // });
    importLoading.value = false;
  }
}

const tableDataCount = ref();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <Space>
          <span>
          共 {{ tableDataCount }} 条
        </span>
          <Button :disabled="isEmpty(selectedRows)" :loading="importLoading"
                  @click="importToExpert"
          >
            <template #icon>
              <ExportOutlined/>
            </template>
            导入到套料软件
          </Button>
        </Space>
      </template>

    </Grid>
  </Page>
</template>

<style scoped>
:deep(.dark .vxe-cell--checkbox){
  color: white !important;
}
</style>
