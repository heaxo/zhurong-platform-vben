<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { preferences, usePreferences } from '@vben/preferences';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const { isDark } = usePreferences();

const appName = computed(() => preferences.app.name);

const logoSource = computed(
  () =>
    (isDark.value ? preferences.logo.sourceDark : preferences.logo.source) ||
    preferences.logo.source ||
    preferences.logo.sourceDark ||
    '/log.png',
);

const formSchema = computed((): VbenFormSchema[] => [
  {
    component: 'VbenInput',
    componentProps: {
      autocomplete: 'username',
      placeholder: '用户名',
    },
    fieldName: 'username',
    rules: z.string().min(1, { message: '请输入用户名' }),
  },
  {
    component: 'VbenInputPassword',
    componentProps: {
      autocomplete: 'current-password',
      placeholder: '密码',
    },
    fieldName: 'password',
    rules: z.string().min(1, { message: '请输入密码' }),
  },
]);
</script>

<template>
  <div class="login-page">
    <!-- 左侧背景图片 -->
    <div class="login-visual" aria-hidden="true">
      <img
        class="login-visual__image"
        src="/images/login-tech-visual.png"
        alt=""
      />
    </div>

    <!-- 左上角品牌 -->
    <header class="login-brand">
      <img :src="logoSource" alt="" />
      <span>{{ appName }}</span>
    </header>

    <!-- 登录区域 -->
    <main class="login-main">
      <section class="login-card">
        <div class="login-card__header">
          <img
            class="login-card__title"
            src="/title.png"
            alt="浩博技术"
          />
        </div>

        <AuthenticationLogin
          class="login-form"
          :form-schema="formSchema"
          :loading="authStore.loginLoading"
          :show-code-login="false"
          :show-forget-password="false"
          :show-qrcode-login="false"
          :show-register="false"
          :show-remember-me="false"
          :show-third-party-login="false"
          submit-button-text="登录"
          sub-title="请输入您的账户信息以开始管理您的项目"
          title="欢迎登录"
          @submit="authStore.authLogin"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  --login-primary: hsl(var(--primary));
  --login-primary-hover: hsl(var(--primary) / 88%);
  --login-dark: #0e1929;
  --login-background: #edf3f8;
  --login-card: hsl(var(--card));
  --login-text: hsl(var(--foreground));
  --login-muted: hsl(var(--muted-foreground));

  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  color: var(--login-text);
  background:
    radial-gradient(
      circle at 79% 47%,
      rgb(255 255 255 / 95%),
      transparent 33%
    ),
    linear-gradient(135deg, #f7fafc, var(--login-background));
}

/* 左侧图片区域 */

.login-visual {
  position: absolute;
  inset: 0 38% 0 0;
  overflow: hidden;
  background: var(--login-dark);
  clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%);
}

.login-visual::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(
      180deg,
      rgb(7 18 34 / 28%) 0%,
      transparent 28%,
      transparent 72%,
      rgb(7 18 34 / 24%) 100%
    ),
    linear-gradient(
      90deg,
      rgb(7 18 34 / 16%),
      transparent 46%,
      rgb(7 18 34 / 8%)
    );
}

.login-visual__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transform: scale(1.015);
}

/* 左上角品牌 */

.login-brand {
  position: absolute;
  top: 42px;
  left: 52px;
  z-index: 3;
  display: flex;
  gap: 13px;
  align-items: center;
  max-width: 380px;
  color: #fff;
}

.login-brand img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.login-brand span {
  overflow: hidden;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 2px 12px rgb(0 0 0 / 24%);
}

/* 登录区域 */

.login-main {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 48px clamp(56px, 8vw, 150px) 48px 48px;
}

.login-card {
  position: relative;
  width: min(100%, 420px);
  padding: 44px 42px 38px;
  background: rgb(255 255 255 / 97%);
  border: 1px solid rgb(218 227 237 / 82%);
  border-radius: 14px;
  box-shadow:
    0 34px 86px rgb(41 65 91 / 16%),
    0 10px 28px rgb(41 65 91 / 8%);
  backdrop-filter: blur(12px);
}

.login-card__header {
  margin-bottom: 26px;
}

.login-card__title {
  display: block;
  width: min(100%, 300px);
  height: auto;
  object-fit: contain;
}

/* Vben 表单文字 */

:deep(.text-foreground) {
  color: var(--login-text);
}

:deep(.text-muted-foreground) {
  color: var(--login-muted);
}

/* 登录标题 */

.login-form :deep(h2) {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.25;
  color: #162a43;
  letter-spacing: -0.02em;
}

.login-form :deep(p) {
  font-size: 13px;
  color: #748399;
}

/* 输入框 */

.login-form :deep(input) {
  min-height: 50px;
  padding-right: 15px;
  padding-left: 15px;
  color: #15263c;
  background: #eaf2ff;
  border: 1px solid #dce7f5;
  border-radius: 8px;
  box-shadow: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.login-form :deep(input::placeholder) {
  color: #8190a4;
}

.login-form :deep(input:hover) {
  border-color: hsl(var(--primary) / 42%);
}

.login-form :deep(input:focus),
.login-form :deep(input:focus-visible) {
  background: #f4f8ff;
  border-color: var(--login-primary);
  box-shadow: 0 0 0 3px hsl(var(--primary) / 10%);
  outline: none;
}

/* 浏览器自动填充 */

.login-form :deep(input:-webkit-autofill),
.login-form :deep(input:-webkit-autofill:hover),
.login-form :deep(input:-webkit-autofill:focus) {
  -webkit-text-fill-color: #15263c;
  box-shadow: 0 0 0 1000px #eaf2ff inset;
}

/* 登录按钮 */

.login-form :deep(button[aria-label='login']),
.login-form :deep(form button[type='submit']) {
  min-height: 50px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 650;
  color: #fff;
  background: var(--login-primary);
  border: none;
  border-radius: 8px;
  box-shadow: 0 12px 25px hsl(var(--primary) / 21%);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.login-form :deep(button[aria-label='login']:hover),
.login-form :deep(form button[type='submit']:hover) {
  background: var(--login-primary-hover);
  box-shadow: 0 15px 30px hsl(var(--primary) / 27%);
  transform: translateY(-1px);
}

.login-form :deep(button[aria-label='login']:active),
.login-form :deep(form button[type='submit']:active) {
  transform: translateY(0);
}

.login-form :deep(button[aria-label='login']:disabled),
.login-form :deep(form button[type='submit']:disabled) {
  box-shadow: none;
  opacity: 0.6;
  transform: none;
}

/* 中等尺寸 */

@media (max-width: 1100px) {
  .login-visual {
    right: 43%;
  }

  .login-brand {
    left: 36px;
  }

  .login-main {
    padding-right: 42px;
  }

  .login-card {
    width: min(100%, 400px);
  }
}

/* 移动端 */

@media (max-width: 760px) {
  .login-page {
    background:
      linear-gradient(
        180deg,
        var(--login-dark) 0,
        var(--login-dark) 180px,
        var(--login-background) 180px
      );
  }

  .login-visual {
    top: 0;
    right: 0;
    bottom: auto;
    height: 180px;
    clip-path: none;
    opacity: 0.42;
  }

  .login-visual__image {
    object-position: center 47%;
  }

  .login-visual::after {
    background: linear-gradient(
      180deg,
      rgb(7 18 34 / 18%),
      var(--login-dark)
    );
  }

  .login-brand {
    top: 28px;
    left: 24px;
  }

  .login-brand img {
    width: 38px;
    height: 38px;
  }

  .login-brand span {
    font-size: 16px;
  }

  .login-main {
    align-items: flex-start;
    justify-content: center;
    padding: 122px 18px 28px;
  }

  .login-card {
    padding: 38px 28px 32px;
    border-radius: 12px;
  }

  .login-card__title {
    width: min(100%, 280px);
  }
}

@media (max-width: 420px) {
  .login-card {
    padding-right: 22px;
    padding-left: 22px;
  }

  .login-card__title {
    width: min(100%, 250px);
  }

  .login-form :deep(h2) {
    font-size: 25px;
  }
}
</style>
