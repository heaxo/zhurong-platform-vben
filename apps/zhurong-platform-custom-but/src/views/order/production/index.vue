<script lang="ts" setup>
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {ref} from 'vue';
import {useColumns} from "#/views/order/production/data";
import type {VimOrderlVO} from "#/api/order";
import {requestGetViPmOrderlList} from "#/api/order";
import {Button} from 'ant-design-vue';
import {ExportOutlined} from '@ant-design/icons-vue';
import {isEmpty} from 'lodash-es';
import {JobBrowserSelecter} from '@zhurong/components';


import {Page, useVbenModal} from '@vben/common-ui';

const selectedRows = ref([]);

function handleSelectionChange({records}) {
  selectedRows.value = records;
}

const [Grid, gridApi] = useVbenVxeGrid({
  /*formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
    collapsed: true,
  },*/
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionChange,
  },
  gridOptions: {
    virtualYConfig: {
      enabled: true,   // 开启纵向虚拟滚动
      gt: 50,
    },
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
          const data = await requestGetViPmOrderlList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return data;
        },
      },
    },
    rowConfig: {
      keyField: 'belposId',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: {code: 'query'},
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<VimOrderlVO>,
});


const [JobBrowserSelecterModal, jobBrowserSelecterModalApi] = useVbenModal({
    connectedComponent: JobBrowserSelecter,
    draggable: true,
    onClosed:() => {
      const data = jobBrowserSelecterModalApi.getData();
      console.log(data);
    }
});
function onActionClick(e: OnActionClickParams<VimOrderlVO>) {
  switch (e.code) {
    case 'delete': {
      break;
    }
    case 'edit': {
      break;
    }
  }
}

function importToExpert() {
  jobBrowserSelecterModalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <JobBrowserSelecterModal />
    <Grid>
      <template #toolbar-actions>
        <Button :disabled="isEmpty(selectedRows)" @click="importToExpert">
          <template #icon>
            <ExportOutlined/>
          </template>
          导入到套料软件
        </Button>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>

</style>
