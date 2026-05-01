<script lang="ts" setup>
import {
  type OnActionClickParams,
  useVbenVxeGrid,
  type VxeTableGridOptions
} from "#/adapter/vxe-table";
import {ref,nextTick} from 'vue';
import {useColumns, useGridFormSchema} from "./data";
import type {VimOrderlVO} from "#/api/order";
import {requestGetMmnnMmoo00000300PageList} from "@zhurong/api";
import {requestSpecifiedToExpertJob} from "#/api/order";
import {Button, message, Space} from 'ant-design-vue';
import {ExportOutlined} from '@ant-design/icons-vue';
import {isEmpty,groupBy} from 'lodash-es';
import {JobBrowserSelecter} from '@zhurong/components';


import {Page, useVbenModal} from '@vben/common-ui';

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
    wrapperClass:'grid-cols-5',
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
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
          const data = await requestGetMmnnMmoo00000300PageList({
            page: page.currentPage,
            pageSize: page.pageSize,
            queryRelease: true,
            ...formValues,
          });
          return data;
        },
      },
    },
    rowConfig: {
      keyField: 'recID',
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

const importLoading = ref(false);

const [JobBrowserSelecterModal, jobBrowserSelecterModalApi] = useVbenModal({
  connectedComponent: JobBrowserSelecter,
  draggable: true,
  onClosed: async () => {
    try {
      const data = jobBrowserSelecterModalApi.getData();
      if (!data || !data.submit) {
        return;
      }
      gridApi.setGridOptions({
        loading: true,
      });
      importLoading.value = true;
      const jobRef = data.selected[0].id;
      const values = data.values;
      if (isEmpty(selectedRows.value)) {
        return message.warn("请选择要指定的生产订单");
      }
      const succeed = await requestSpecifiedToExpertJob({
        recIds: selectedRows.value.map(it => it.recID),
        dis_JobRef:jobRef,
        ...values,
      })
      if (succeed) {
        gridApi.reload();
        return message.success("指定成功");
      }
    } finally {
      gridApi.setGridOptions({
        loading: false,
      });
      importLoading.value = false;
    }
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
    <JobBrowserSelecterModal/>
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button :disabled="isEmpty(selectedRows)" :loading="importLoading"
                  @click="importToExpert">
            <template #icon>
              <ExportOutlined/>
            </template>
            指定到作业
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
</style>
