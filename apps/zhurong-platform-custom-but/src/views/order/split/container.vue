<script lang="ts" setup>
import {useVbenDrawer} from '@vben/common-ui';
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {useNestingPartsSplitRecordColumns} from "#/views/order/split/data";
import {
  requestBatchRemoveZhurongButNestingPartsSplitRecords,
  requestGetZhurongButNestingPartsSplitRecordsPage, requestOrderSplitting,
  type ZhurongButNestingPartsSplitRecordsVO
} from "#/api";
import {Button, message, Modal, Space} from "ant-design-vue";
import {DeleteOutlined} from "@ant-design/icons-vue";
import {reactive, ref} from "vue";
import {isEmpty} from 'lodash-es';

const selectedRows = ref([]);

const [Grid, gridApi] = useVbenVxeGrid({
  gridEvents:{
    checkboxChange: ({ records }) => {
      selectedRows.value = records;
    },
    checkboxAll: ({ records }) => {
      selectedRows.value = records;
    },
  },
  gridOptions: {
    loading: false,
    columns: useNestingPartsSplitRecordColumns({
      onActionClick
    }),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async ({page}, formValues) => {
          const data = await requestGetZhurongButNestingPartsSplitRecordsPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...queryData.value,
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
      custom: false,
      export: false,
      refresh: {code: 'query'},
      search: false,
      zoom: false,
    },
  } as VxeTableGridOptions<ZhurongButNestingPartsSplitRecordsVO>,
});
const queryData = ref({});
const loading = ref(false);
const [Container, containerApi] = useVbenDrawer({
  closeOnClickModal: false,
  confirmText: '确认',
  placement: 'bottom',
  destroyOnClose: true,
  class: 'h-[90%]',
  onClosed:() => {
    selectedRows.value = [];
    queryData.value = {};
    clearTableState();
  },
  onOpened() {
    const data = containerApi.getData();
    queryData.value = data;
    gridApi.query();
  },
});

async function clearTableState() {
  // 清除选中（checkbox）
  await gridApi.grid.clearCheckboxRow();
  // 清除单选
  await gridApi.grid.clearRadioRow();
  // 清除当前行
  await gridApi.grid.clearCurrentRow();
  // 清除排序
  await gridApi.grid.clearSort();
  // 清除过滤
  await gridApi.grid.clearFilter();
  // 清除所有状态（最保险）
  await gridApi.grid.clearAll();
}

async function onActionClick(e: OnActionClickParams<any>) {
  switch (e.code) {
    case 'delete': {
      const succeed = await requestBatchRemoveZhurongButNestingPartsSplitRecords([e.row.id]);
      if (succeed){
        successHandler();
      }
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
async function batchRemove() {
  if (!selectedRows.value || !selectedRows.value.length){
    return message.warn("请选择要删除的记录");
  }
  Modal.confirm({
    title:"删除提醒",
    content:"确定要将拆单记录删除吗",
    onOk:async () => {
      const data = selectedRows.value?.map(it => it.id) ?? [];
      const succeed = await requestBatchRemoveZhurongButNestingPartsSplitRecords(data);
      if (succeed){
        successHandler();
      }
    }
  })
}
</script>

<template>
  <Container title="拆单记录">
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button :disabled="isEmpty(selectedRows)" :loading="loading"
                  @click="batchRemove()">
            <template #icon>
              <DeleteOutlined/>
            </template>
            批量删除
          </Button>
        </Space>
      </template>
    </Grid>
  </Container>
</template>

<style scoped>

</style>
