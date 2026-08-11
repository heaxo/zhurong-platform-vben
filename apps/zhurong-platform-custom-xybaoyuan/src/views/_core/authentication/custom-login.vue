<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { preferences } from '@vben/preferences';

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
  <div class="template-login">
    <section class="template-login__visual">
      <span class="brand-line brand-line--top" aria-hidden="true"></span>
      <span class="brand-line brand-line--bottom" aria-hidden="true"></span>

      <div class="brand-content">
        <img :src="logoSource" alt="" class="brand-logo" />
        <p class="brand-kicker">统一认证中心</p>
        <h1 class="brand-title">{{ appName }}</h1>
        <p class="brand-copy">安全、稳定、高效的业务系统访问入口</p>
      </div>
    </section>

    <main class="template-login__main">
      <section class="login-card">
        <div class="login-card__brand">
          <img :src="logoSource" alt="" />
          <span>{{ appName }}</span>
        </div>

        <AuthenticationLogin
          :form-schema="formSchema"
          :loading="authStore.loginLoading"
          :show-code-login="false"
          :show-forget-password="false"
          :show-qrcode-login="false"
          :show-register="false"
          :show-remember-me="false"
          :show-third-party-login="false"
          sub-title="请输入账号密码访问系统"
          title="欢迎登录"
          @submit="authStore.authLogin"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.template-login {
  --login-primary: #f97316;
  --login-primary-strong: #c2410c;
  --login-accent: #ffc500;
  --login-danger: #dc2626;
  --login-ink: #1f2937;
  --login-muted: #64748b;
  --login-line: rgb(15 23 42 / 10%);
  --login-surface: rgb(255 255 255 / 92%);

  display: grid;
  grid-template-columns: minmax(420px, 0.95fr) minmax(440px, 1.05fr);
  min-height: 100vh;
  overflow: auto;
  color: var(--login-ink);
  background:
    linear-gradient(135deg, rgb(255 247 237 / 92%) 0%, #fff 46%, #f8fafc 100%),
    linear-gradient(180deg, transparent 54%, rgb(255 237 213 / 42%) 100%), #fff;
}

.template-login::before {
  position: fixed;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(135deg, rgb(249 115 22 / 5%) 0 1px, transparent 1px 100%),
    linear-gradient(
      108deg,
      transparent 14%,
      rgb(255 197 0 / 9%) 46%,
      transparent 76%
    );
  background-size:
    34px 34px,
    auto;
}

.template-login::after {
  position: fixed;
  top: 29%;
  left: -8%;
  width: 116%;
  height: 1px;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    90deg,
    transparent,
    rgb(249 115 22 / 18%),
    transparent
  );
  transform: rotate(-10deg);
}

.template-login__visual {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding: clamp(40px, 6vw, 88px);
  overflow: hidden;
}

.brand-line {
  position: absolute;
  width: min(46vw, 560px);
  height: 1px;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(249 115 22 / 42%),
    transparent
  );
}

.brand-line--top {
  top: 22%;
  right: -6%;
  transform: rotate(-12deg);
}

.brand-line--bottom {
  bottom: 20%;
  left: -8%;
  transform: rotate(-12deg);
}

.brand-content {
  position: relative;
  z-index: 1;
  width: min(100%, 560px);
}

.brand-logo {
  width: 96px;
  height: 96px;
  margin-bottom: 28px;
  object-fit: contain;
  filter: drop-shadow(0 18px 34px rgb(249 115 22 / 20%));
}

.brand-kicker {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--login-primary-strong);
}

.brand-title {
  max-width: 560px;
  margin: 0;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.08;
  color: var(--login-ink);
}

.brand-copy {
  max-width: 420px;
  margin: 24px 0 0;
  font-size: 16px;
  line-height: 1.8;
  color: var(--login-muted);
}

.template-login__main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: clamp(28px, 5vw, 72px);
  overflow: hidden;
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(100%, 432px);
  padding: 40px;
  background: var(--login-surface);
  border: 1px solid rgb(15 23 42 / 8%);
  border-radius: 8px;
  box-shadow: 0 24px 70px rgb(15 23 42 / 12%);
  backdrop-filter: blur(18px);
}

.login-card__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
  font-size: 16px;
  font-weight: 700;
  color: var(--login-ink);
}

.login-card__brand img {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

:deep(.text-foreground) {
  color: var(--login-ink);
}

:deep(.text-muted-foreground) {
  color: var(--login-muted);
}

:deep(input) {
  min-height: 44px;
  color: var(--login-ink);
  background: #fff;
  border-color: rgb(15 23 42 / 12%);
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(input:focus),
:deep(input:focus-visible) {
  border-color: var(--login-primary);
  box-shadow: 0 0 0 3px rgb(249 115 22 / 14%);
}

:deep(button[aria-label='login']) {
  min-height: 44px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--login-primary),
    var(--login-danger)
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgb(249 115 22 / 24%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

:deep(button[aria-label='login']:hover) {
  box-shadow: 0 16px 34px rgb(249 115 22 / 30%);
  filter: brightness(1.03);
  transform: translateY(-1px);
}

:deep(button[aria-label='login']:disabled) {
  transform: none;
}

@media (max-width: 960px) {
  .template-login {
    grid-template-columns: 1fr;
  }

  .template-login__visual {
    min-height: auto;
    padding: 32px 24px 20px;
    border-right: 0;
  }

  .brand-line {
    display: none;
  }

  .brand-logo {
    width: 64px;
    height: 64px;
    margin-bottom: 18px;
  }

  .brand-title {
    font-size: 30px;
  }

  .brand-copy {
    display: none;
  }

  .template-login__main {
    align-items: start;
    min-height: auto;
    padding: 24px;
  }

  .login-card {
    padding: 28px 24px;
    box-shadow: 0 18px 46px rgb(15 23 42 / 10%);
  }

  .login-card__brand {
    display: none;
  }
}
</style>
