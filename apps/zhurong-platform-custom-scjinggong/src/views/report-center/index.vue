<script setup lang="ts">
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Select } from 'ant-design-vue';

import { reportOptions, reports } from './report-options';

/**
 * 菜单只配置本页面：report-center/index。
 * 新报表只需创建 modules/*.vue，再在 report-options.ts 注册，无需新增页面或菜单。
 * router/routes/index.ts 会排除 modules 目录，报表组件不会被识别成独立路由。
 */
const activeKey = ref(reports[0]!.key);
const activeReport = computed(
  () => reports.find(({ key }) => key === activeKey.value)?.component ?? reports[0]!.component,
);
</script>

<template>
  <Page auto-content-height content-class="!min-h-0 !overflow-hidden !p-2">
    <div class="report-grid h-full min-h-0 overflow-hidden">
      <component :is="activeReport" :key="activeKey">
        <template #toolbar-actions>
          <div class="flex items-center gap-2">
            <span class="shrink-0 text-sm">报表</span>
            <Select
              v-model:value="activeKey"
              :options="reportOptions"
              class="w-56"
              size="small"
            />
          </div>
        </template>
      </component>
    </div>
  </Page>
</template>

<style scoped>
/* 项目 Vxe 全局样式将高度设为 auto；报表 Grid 需要使用 Page 剩余高度。 */
.report-grid :deep(.vxe-grid) {
  height: 100% !important;
}
</style>
