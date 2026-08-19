<script lang="ts" setup>
import type { SystemUserApi } from '#/api/system/user';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { updateUserClientId } from '#/api/system/user';

import { useFormSchema } from '../data';

const emit = defineEmits<{ success: [] }>();
const current = ref<SystemUserApi.SystemUser>();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid || !current.value) return;

    modalApi.lock();
    try {
      const values = await formApi.getValues<{ clientId?: string }>();
      await updateUserClientId(current.value.id, values.clientId);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    current.value = modalApi.getData<SystemUserApi.SystemUser>();
    await formApi.resetForm();
    await formApi.setValues(current.value || {});
  },
});
</script>

<template>
  <Modal title="绑定客户端">
    <Form class="mx-4" />
  </Modal>
</template>
