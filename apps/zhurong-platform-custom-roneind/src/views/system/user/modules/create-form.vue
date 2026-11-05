<script lang="ts" setup>
import type { SystemUserApi } from '#/api/system/user';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createUser } from '#/api/system/user';

import { useCreateFormSchema } from '../data';

const emit = defineEmits<{ success: [] }>();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useCreateFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[760px]',
  draggable: true,
  fullscreenButton: false,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const values = await formApi.getValues<SystemUserApi.CreateUser>();
      await createUser({
        ...values,
        clientId: values.clientId?.trim() || undefined,
        realName: values.realName.trim(),
        username: values.username.trim(),
      });
      message.success('账号创建成功');
      await modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(open) {
    if (open) {
      await formApi.resetForm();
    }
  },
  title: '新建账号',
});
</script>

<template>
  <Modal>
    <Form class="mx-4" />
  </Modal>
</template>
