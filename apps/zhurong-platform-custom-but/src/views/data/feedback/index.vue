<script lang="ts" setup>
import {JobBrowserPage,NestingDataTable} from '@zhurong/components';
import {Page} from "@vben/common-ui";
</script>

<template>
  <JobBrowserPage>
    <Page auto-content-height contentClass="p-2">
      <NestingDataTable/>
    </Page>
  </JobBrowserPage>
</template>

<style scoped>

</style>
