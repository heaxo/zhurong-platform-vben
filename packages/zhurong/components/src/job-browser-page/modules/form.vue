<script lang="ts" setup>
import {useVbenModal} from '@vben/common-ui';
import {useVbenForm} from '#/adapter/form';
import {requestGetJobRefs} from "@zhurong/api";
import {JobBrowserSearchFormSchema} from "#/job-browser-selecter/data";


const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-2',
  schema: JobBrowserSearchFormSchema,
  showDefaultActions: false,
  submitButtonOptions: {
    content: '搜索',
  },
});

// ========== Modal ==========
const [Modal, modalApi] = useVbenModal({
  title: '作业浏览器',
  fullscreenButton: true,
  onOpenChange(isOpen) {
    if (!isOpen) {
      resetForm();
    }
  },
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    try {
      const values = await formApi.getValues();
      modalApi.setState({loading: true});
      const jobRefs = await requestGetJobRefs(values);
      modalApi.close();
      modalApi.setData({jobRefs});
    } finally {
      modalApi.setState({loading: false});
    }
  },
});

function resetForm() {
  formApi.resetForm();
}
</script>

<template>
  <Modal class="w-[500px]">
    <Form/>
  </Modal>
</template>
