<script setup lang="ts">
import type { BasicOption } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { getUserInfoApi } from '#/api';
import { updateUserClientId } from '#/api/system/user';

const profileBaseSettingRef = ref();
const currentUserId = ref<string>();

const roleOptions: BasicOption[] = [
  { label: '管理员', value: 'super' },
  { label: '用户', value: 'user' },
  { label: '测试', value: 'test' },
];

const formSchema = computed((): VbenFormSchema[] => [
  {
    component: 'Input',
    componentProps: { disabled: true },
    fieldName: 'realName',
    label: '姓名',
  },
  {
    component: 'Input',
    componentProps: { disabled: true },
    fieldName: 'username',
    label: '用户名',
  },
  {
    component: 'Input',
    componentProps: {
      allowClear: true,
      maxlength: 128,
      placeholder: '请输入客户端电脑的Windows主机名',
    },
    description: '用于将本账号的Lantek任务定向发送到指定Windows客户端。',
    fieldName: 'clientId',
    label: '客户端ID',
  },
  {
    component: 'Select',
    componentProps: {
      disabled: true,
      mode: 'tags',
      options: roleOptions,
    },
    fieldName: 'roles',
    label: '角色',
  },
]);

onMounted(async () => {
  const data = await getUserInfoApi();
  currentUserId.value = data.id;
  await profileBaseSettingRef.value.getFormApi().setValues(data);
});

async function handleSubmit(values: { clientId?: string }) {
  if (!currentUserId.value) return;
  await updateUserClientId(currentUserId.value, values.clientId);
  message.success('客户端绑定已更新');
}
</script>

<template>
  <ProfileBaseSetting
    ref="profileBaseSettingRef"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
