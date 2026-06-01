<script lang="ts" setup>
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {useColumns, useGridFormSchema} from "./data";
import {
  requestGetZhurongButSupplierinfoPage, requestSyncSupplierinfo, requestSyncReportedStatus,
  requestUpdateUdata, requestClearExistingInventory
} from "#/api";
import type {ZhurongButSupplierinfoVO} from "#/api";

import {Page, useVbenDrawer} from '@vben/common-ui';
import {Button,Modal, Space,message} from "ant-design-vue";
import {isEmpty} from 'lodash-es';
import {CloudSyncOutlined,ClearOutlined} from "@ant-design/icons-vue";
import {Plus} from '@vben/icons';
import Form from './modules/form.vue';
import {ref} from "vue";
const selectedRows = ref([]);



const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

function handleSelectionChange({records}) {
  selectedRows.value = records;
}
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    wrapperClass:'grid-cols-4',
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
    id: "supplierGridTable",
    customConfig:{
      storage: true,
    },
    virtualYConfig: {
      enabled: true,   // 开启纵向虚拟滚动
      gt: 50,
    },
    loading: false,
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
    },
    proxyConfig: {
      ajax: {
        query: async ({page}, formValues) => {
          const data = await requestGetZhurongButSupplierinfoPage({
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
  } as VxeTableGridOptions<ZhurongButSupplierinfoVO>,
});


function onActionClick(e: OnActionClickParams<ZhurongButSupplierinfoVO>) {
  switch (e.code) {
    case 'delete': {
      break;
    }
    case 'edit': {
      break;
    }
  }
}
function successHandler() {
  message.success('操作成功');
  onRefresh();
}
function onRefresh() {
  gridApi.query();
}
function onCreate() {
  formDrawerApi.setData({}).open();
}
const syncSupplierLoading = ref(false);
async function onSyncSupplier() {
  try{
    syncSupplierLoading.value = true;
    const response = await requestSyncSupplierinfo();
    if (response){
      successHandler();
    }
  } finally {
    syncSupplierLoading.value = false;
  }
}
async function onUpdateUdata() {
  const ids = selectedRows.value.map(it => it.id);
  if (!ids || !ids.length){
    Modal.confirm({
      title:"更新提示",
      content:"未勾选指定数据会更新所有可更新的板材数据，确定更新吗？",
      onOk:async () => {
        await request(null);
      }
    })
    return;
  }
  await request(ids);
  async function request(ids?) {
    try{
      syncSupplierLoading.value = true;
      const count = await requestUpdateUdata({
        ids
      });
      if (count){
        successHandler();
        message.success(`更新条数：${count}`);
      }
    } finally {
      syncSupplierLoading.value = false;
    }
  }
}
async function onClearExistingInventory() {
  Modal.confirm({
    title:"清除整板库存信息",
    content:"确定清除现有整板库存的数量、用户数据信息吗？",
    onOk:async () => {
      try{
        syncSupplierLoading.value = true;
        const response = await requestClearExistingInventory({
        });
        if (response){
          message.success("整板库存清除成功");
        }
      } finally {
        syncSupplierLoading.value = false;
      }
    }
  })

}
async function onSyncReportedStatus() {
  try{
    syncSupplierLoading.value = true;
    const response = await requestSyncReportedStatus();
    if (response){
      successHandler();
    }
  } finally {
    syncSupplierLoading.value = false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="successHandler" />
    <Grid>
      <template #toolbar-tools>
<!--        <Button type="primary" @click="onCreate">-->
<!--          <Plus class="size-5" />-->
<!--          {{ $t('ui.actionTitle.create') }}-->
<!--        </Button>-->
        <Space>
          <Button type="default" @click="onClearExistingInventory" :loading="syncSupplierLoading">
            <ClearOutlined />
            清空现有整板库存
          </Button>
          <Button type="primary" @click="onSyncSupplier" :loading="syncSupplierLoading">
            <CloudSyncOutlined />
            同步供应商
          </Button>
          <Button type="default" @click="onUpdateUdata" :loading="syncSupplierLoading" >
            <CloudSyncOutlined />
            更新到套料软件
          </Button>
          <Button type="default" @click="onSyncReportedStatus" :loading="syncSupplierLoading">
            <CloudSyncOutlined />
            同步报工状态
          </Button>
        </Space>
      </template>
      <template #toolbar-actions>

      </template>

    </Grid>
  </Page>
</template>

<style scoped>
:deep(.dark .vxe-cell--checkbox){
  color: white !important;
}
</style>
