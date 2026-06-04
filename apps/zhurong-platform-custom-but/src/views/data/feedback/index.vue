<script lang="ts" setup>
import { JobBrowserPage, NestingDataTable } from '@zhurong/components';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { reactive, ref, useTemplateRef } from 'vue';
import { Button, Space, Modal, Tooltip, message } from 'ant-design-vue';
import { SendOutlined } from '@ant-design/icons-vue';
import NestPartSplit from './nest-part-split-container.vue';
import {
  requestBatchLocking,
  requestGetZhurongButNestingPartsSplitRecordsPage,
  requestSplitRecordsOverwrite,
} from '#/api';

const queryParameters = reactive({
  jobRef: null,
});

function handleSelect(jobRefs: string[]) {
  console.log(jobRefs);
  if (jobRefs && jobRefs.length) {
    queryParameters.jobRef = jobRefs[0];
  }
}

const selectedRows = ref([]);
const gridEvents = {
  checkboxChange: ({ records }) => {
    selectedRows.value = records;
  },
  checkboxAll: ({ records }) => {
    selectedRows.value = records;
  },
  cellClick: async (param) => {
    if (param.column.field === 'cnc') {
      try {
        gridRef.value._gridApi.setGridOptions({
          loading: true,
        });
        const nestParts = [];
        const data = await requestGetZhurongButNestingPartsSplitRecordsPage({
          pageSize: -1,
          nstRef: param.row.nstRef,
        });
        const changedNestParts = data.items;
        for (let i = 0; i < param.row.nestParts.length; i++) {
          const part = param.row.nestParts[i];
          nestParts.push({ ...part, mnORef: part.mnORef ?? part.ordRef,orgMnoRef: part.mnORef });
        }

        splitContainerApi
          .setData({
            nestParts,
            changedNestParts,
            cnc: param.row.cnc,
            nstRef: param.row.nstRef,
          })
          .setState({ title: '套料零件拆分' })
          .open();
      } catch (e) {
        console.error(e);
      } finally {
        gridRef.value._gridApi.setGridOptions({
          loading: false,
        });
      }
    }
  },
};
const gridRef = useTemplateRef('gridRef');

const [SplitContainer, splitContainerApi] = useVbenDrawer({
  connectedComponent: NestPartSplit,
  onBeforeClose: async () => {
    try {
      const data = splitContainerApi.getData();
      if (!data.submit) {
        return true;
      }
      const changedNestParts = data.changedNestParts;
      const records = changedNestParts.map((it) => ({
        nstRef: it.nstRef,
        mnoRef: it.mnORef ?? it.mnoRef,
        orgMnoRef: it.orgMnoRef,
        oprId: it.oprID ?? it.oprId,
        quantity: it.quantity,
        remark: it.remark,
        ordRef: it.mnORef ?? it.mnoRef,
        recId: it.recID ?? it.recId,
      }));
      const succeed = await requestSplitRecordsOverwrite({
        nstRef: data.nstRef,
        records,
      });
      console.log(records, succeed);
      return succeed;
    } finally {
      splitContainerApi.unlock();
    }
  },
});
async function onDataFeedback() {
  if (!selectedRows.value || !selectedRows.value.length) {
    return message.warn('请选择要回传的套料程序');
  }
  Modal.confirm({
    title: '数据回传',
    content: '确定回传当前选中套料程序吗？',
    onOk: async () => {
      try {
        gridRef.value._gridApi.setGridOptions({
          loading: true,
        });
        const recIds = selectedRows.value.map((it) => it.recID);
        const succeed = await requestBatchLocking({
          recIds,
        });
        if (succeed) {
          await clearTableState();
          gridRef.value._gridApi.query();
        }
      } finally {
        gridRef.value._gridApi.setGridOptions({
          loading: false,
        });
        return true;
      }
    },
  });
}
async function clearTableState() {
  // 清除选中（checkbox）
  await gridRef.value._gridApi.grid.clearCheckboxRow();
  // 清除单选
  await gridRef.value._gridApi.grid.clearRadioRow();
  // 清除当前行
  await gridRef.value._gridApi.grid.clearCurrentRow();
  // 清除排序
  await gridRef.value._gridApi.grid.clearSort();
  // 清除过滤
  await gridRef.value._gridApi.grid.clearFilter();
  // 清除所有状态（最保险）
  await gridRef.value._gridApi.grid.clearAll();
}
const checkboxConfig = {
  checkMethod({ row }) {
    return row.mstate !== 40 && row.mstate !== 90;
  },
};
</script>

<template>
  <JobBrowserPage @select="handleSelect">
    <Page auto-content-height contentClass="p-2">
      <SplitContainer />
      <NestingDataTable
        ref="gridRef"
        :gridEvents="gridEvents"
        :queryParameters="queryParameters"
        :checkboxConfig="checkboxConfig"
        enableCheckbox
        enableServerSideSorting
      >
        <template #toolbar-actions>
          <Space>
            <Tooltip title="数据回传">
              <Button
                :disabled="!selectedRows || !selectedRows.length"
                shape="circle"
                @click="onDataFeedback"
              >
                <template #icon>
                  <SendOutlined />
                </template>
              </Button>
            </Tooltip>
          </Space>
        </template>
      </NestingDataTable>
    </Page>
  </JobBrowserPage>
</template>

<style scoped>
:deep(.dark .vxe-cell--checkbox) {
  color: white !important;
}
</style>
