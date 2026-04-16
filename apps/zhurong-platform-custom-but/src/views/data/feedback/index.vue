<script lang="ts" setup>
import {JobBrowserPage, NestingDataTable} from '@zhurong/components';
import {Page} from "@vben/common-ui";
import {reactive, ref} from "vue";
import {
  Space,Button,Tooltip,

} from 'ant-design-vue';
import {
  SendOutlined
} from '@ant-design/icons-vue';

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
  checkboxChange:({records}) => {
    selectedRows.value = records;
  },
  checkboxAll:({records}) => {
    selectedRows.value = records;
  },
}
</script>

<template>
  <JobBrowserPage
    @select="handleSelect"
  >
    <Page auto-content-height contentClass="p-2">
      <NestingDataTable
        :queryParameters="queryParameters"
        :gridEvents="gridEvents"
        enableCheckbox
        enableServerSideSorting
      >
        <template #toolbar-actions>
          <Space>
            <Tooltip title="数据回传">
              <Button shape="circle" :disabled="!selectedRows || !selectedRows.length">
                <template #icon>
                  <SendOutlined/>
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

</style>
