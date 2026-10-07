<script lang="ts" setup>
import {JobBrowserPage, NestingDataTable} from '@zhurong/components';
import {Page} from '@vben/common-ui';
import {reactive, ref, useTemplateRef} from 'vue';
import {Button, message, Modal, Space, Tooltip} from 'ant-design-vue';
import {SendOutlined} from '@ant-design/icons-vue';

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
};
const gridRef = useTemplateRef('gridRef');

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
        //TODO 数据回传接口
        const succeed = false;
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
