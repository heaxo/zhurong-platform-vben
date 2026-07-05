<script lang="ts" setup>
import {
  JobBrowserPage,
  NestingDataTable,
  type SimpleColumnSchema,
  useFieldRegistry
} from '@zhurong/components';
import {Page} from '@vben/common-ui';
import {reactive, ref, useTemplateRef} from 'vue';
import {Button, message, Modal, Space, Tooltip} from 'ant-design-vue';
import {PrinterOutlined} from '@ant-design/icons-vue';
import {requestBatchLocking,} from '#/api';

const queryParameters = reactive({
  jobRef: null,
});

const FIELD_REGISTRY = useFieldRegistry();
const DEFAULT_SCHEMA: SimpleColumnSchema[] = Object.keys(FIELD_REGISTRY).map(key => FIELD_REGISTRY[key]);
const columnsSchema = ref([
  FIELD_REGISTRY.image,
  FIELD_REGISTRY.nstRef,
  FIELD_REGISTRY.cnc,
  FIELD_REGISTRY.wrkRef,
  FIELD_REGISTRY.matRef,
  FIELD_REGISTRY.shtRef,
  FIELD_REGISTRY.sthickness,
  FIELD_REGISTRY.sprofit,
  FIELD_REGISTRY.sprofitS,
]);

function handleSelect(jobRefs: string[]) {
  console.log(jobRefs);
  if (jobRefs && jobRefs.length) {
    queryParameters.jobRef = jobRefs[0];
  }
}

const selectedRows = ref([]);
const gridEvents = {
  checkboxChange: ({records}) => {
    selectedRows.value = records;
  },
  checkboxAll: ({records}) => {
    selectedRows.value = records;
  },
  cellClick: async (param) => {
    if (param.column.field === 'cnc') {

    }
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
  checkMethod({row}) {
    return row.mstate !== 40 && row.mstate !== 90;
  },
};
</script>

<template>
  <Page auto-content-height contentClass="p-2">
    <NestingDataTable
      ref="gridRef"
      :checkboxConfig="checkboxConfig"
      :gridEvents="gridEvents"
      :queryParameters="queryParameters"
      :columnsSchema="columnsSchema"
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
                <PrinterOutlined/>
              </template>
            </Button>
          </Tooltip>
        </Space>
      </template>
    </NestingDataTable>
  </Page>
</template>

<style scoped>
:deep(.dark .vxe-cell--checkbox) {
  color: white !important;
}
</style>
