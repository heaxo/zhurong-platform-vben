<script lang="ts" setup>
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {useColumns} from "./data";
import {requestGetAvailableInventoryQtyList} from "#/api/inventory";
import type {AvailableInventoryQtyVO} from "#/api/inventory";

import {Page} from '@vben/common-ui';

const [Grid, gridApi] = useVbenVxeGrid({
  /*formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
    collapsed: true,
  },*/
  gridOptions: {
    loading: false,
    columns: useColumns(onActionClick),
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
</script>

<template>
  <Page auto-content-height>
    <Grid>

    </Grid>
  </Page>
</template>

<style scoped>

</style>
