<script lang="ts" setup>
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {ref,nextTick} from 'vue';
import {useColumns, useGridFormSchema} from "#/views/order/split/data";
import type {VimOrderlVO} from "#/api/order";
import {requestGetMmnnMmoo00000300Page} from "#/api/lantek";
import {Button, message, Space,Modal } from 'ant-design-vue';
import {ScissorOutlined} from '@ant-design/icons-vue';
import {isEmpty,groupBy} from 'lodash-es';
import NestingPartsSplitRecordDrawer from './container.vue';


import {Page, useVbenDrawer} from '@vben/common-ui';
import {requestOrderSplitting} from "#/api";

const selectedRows = ref([]);

async function handleSelectionAllChange(param){
  const { records }: { records: any[] } = param;
  const grid = gridApi.grid || gridApi.getGrid?.();

  // 取消全选
  if (!isEmpty(selectedRows.value)) {
    selectedRows.value = [];
    grid?.clearCheckboxRow?.();
    return;
  }

  return handleSelectionChange(param);
}
let isHandlingSelection = false;
async function handleSelectionChange({ records }: { records: any[] }) {
  if (isHandlingSelection) return;

  const grouped = groupBy(records, 'company');
  const companyList = Object.keys(grouped);

  if (companyList.length <= 1) {
    selectedRows.value = records;
    return;
  }

  /**
   * 保留数据最多的那家公司
   * 如果你想保留最后选择的公司，看下面第二个版本
   */
  const keepCompany = companyList.reduce((maxKey, currentKey) => {
    return grouped[currentKey].length > grouped[maxKey].length
      ? currentKey
      : maxKey;
  }, companyList[0]);

  const rowsToKeep = grouped[keepCompany];

  const rowsToUncheck = records.filter((row) => row.company !== keepCompany);

  message.warning('不允许同时选择多家公司数据，已自动只保留一家公司数据');

  isHandlingSelection = true;

  await nextTick();

  const grid = gridApi.grid || gridApi.getGrid?.();

  grid?.setCheckboxRow(rowsToUncheck, false);

  selectedRows.value = rowsToKeep;

  await nextTick();

  isHandlingSelection = false;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    wrapperClass:'grid-cols-5',
    schema: useGridFormSchema(),
    submitOnChange: false,
    collapsed: true,
  },
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionAllChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions: {
    id: "productionGridTable",
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
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({page}, formValues) => {
          const data = await requestGetMmnnMmoo00000300Page({
            page: page.currentPage,
            pageSize: page.pageSize,
            detachableOrder: true,
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

const loading = ref(false);

const [NestingPartsSplitRecordContainer, nestingPartsSplitRecordContainerApi] = useVbenDrawer({
  connectedComponent: NestingPartsSplitRecordDrawer,
});

async function onActionClick(e: OnActionClickParams<any>) {
  switch (e.code) {
    case 'split': {
      batchSplitOrder([e.row.mnORef]);
      break;
    }
    case 'show': {
      nestingPartsSplitRecordContainerApi.setData({
        orgMnoRef: e.row.mnORef
      }).open();
      break;
    }
  }
}

function successHandler() {
  message.success('操作成功');
  selectedRows.value = [];
  onRefresh();
}
function onRefresh() {
  gridApi.query();
}
function batchSplitOrder(mnoRefs?) {
  if ((!selectedRows.value || !selectedRows.value.length) && !mnoRefs){
    return message.warn("请选择要拆分的订单");
  }
  Modal.confirm({
    title:"拆单提示",
    content:"确定要将订单拆分吗",
    onOk:async () => {
      const orgMnoRefs = selectedRows.value?.map(it => it.mnORef) ?? [];
      if (mnoRefs && mnoRefs.length){
        orgMnoRefs.push(...mnoRefs)
      }
      const response = await requestOrderSplitting({
        orgMnoRefs,
      })
      if (response){
        successHandler();
      }
    }
  })
}

</script>

<template>
  <Page auto-content-height>
    <NestingPartsSplitRecordContainer/>
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button :disabled="isEmpty(selectedRows)" :loading="loading"
                  @click="batchSplitOrder()">
            <template #icon>
              <ScissorOutlined/>
            </template>
            批量拆单
          </Button>
        </Space>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.table-count {
  text-align: right;
  padding: 8px 0;
  color: #666;
  font-size: 13px;
}
:deep(.dark .vxe-cell--checkbox){
  color: white !important;
}
</style>
