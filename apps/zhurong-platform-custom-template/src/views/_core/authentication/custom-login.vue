<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { z } from '@vben/common-ui';
import { preferences } from '@vben/preferences';

import { IndustrialLoginPage } from '@zhurong/components';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const appName = computed(() => preferences.app.name);
const logoSource = computed(
  () => preferences.logo.source || preferences.logo.sourceDark || '/log.png',
);

const formSchema = computed((): VbenFormSchema[] => [
  {
    component: 'VbenInput',
    componentProps: {
      autocomplete: 'username',
      placeholder: '请输入用户名',
    },
    fieldName: 'username',
    rules: z.string().min(1, { message: '请输入用户名' }),
  },
  {
    component: 'VbenInputPassword',
    componentProps: {
      autocomplete: 'current-password',
      placeholder: '请输入密码',
    },
    fieldName: 'password',
    rules: z.string().min(1, { message: '请输入密码' }),
  },
]);
</script>

<template>
  <IndustrialLoginPage
    :app-name="appName"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :logo-source="logoSource"
    @submit="authStore.authLogin"
  />
</template>
