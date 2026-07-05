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
  <div class="haobao-login">
    <span class="login-shape login-shape--blue" aria-hidden="true"></span>
    <span class="login-shape login-shape--orange" aria-hidden="true"></span>
    <span class="login-grid" aria-hidden="true"></span>

    <main class="haobao-login__main">
      <section class="login-card">
        <div class="login-card__brand">
          <img :src="logoSource" alt="" />
          <span>{{ appName }}</span>
        </div>

        <div class="login-card__heading">
          <p>统一认证中心</p>
          <h1>欢迎登录</h1>
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
          submit-button-text="登录系统"
          sub-title="请输入账号密码访问系统"
          title=""
          @submit="authStore.authLogin"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.haobao-login {
  --login-blue: hsl(var(--primary));
  --login-blue-deep: hsl(var(--sidebar-deep));
  --login-blue-dark: hsl(var(--foreground));
  --login-orange: hsl(var(--warning));
  --login-orange-deep: #ef692a;
  --login-ink: hsl(var(--foreground));
  --login-muted: hsl(var(--muted-foreground));
  --login-border: hsl(var(--border) / 80%);
  --login-surface: hsl(var(--card) / 94%);
  --login-page-bg: hsl(var(--background));
  --login-page-bg-deep: hsl(var(--background-deep));

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
  overflow: hidden;
  color: var(--login-ink);
  background:
    linear-gradient(135deg, hsl(var(--primary) / 14%), transparent 36%),
    linear-gradient(315deg, hsl(var(--warning) / 14%), transparent 34%),
    var(--login-page-bg-deep);
}

.haobao-login__main {
  position: relative;
  z-index: 2;
  width: min(100%, 440px);
}

.login-card {
  position: relative;
  width: 100%;
  padding: 42px 40px;
  overflow: hidden;
  background: var(--login-surface);
  border: 1px solid var(--login-border);
  border-radius: 8px;
  box-shadow: 0 28px 80px hsl(var(--foreground) / 10%);
  backdrop-filter: blur(18px);
}

.login-card::before {
  position: absolute;
  inset: 0 0 auto;
  height: 6px;
  content: '';
  background: linear-gradient(90deg, var(--login-blue), var(--login-orange));
}

.login-card__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 700;
  color: var(--login-blue-dark);
}

.login-card__brand img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.login-card__brand span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.login-card__heading {
  margin-bottom: 28px;
}

.login-card__heading p {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--login-orange);
  letter-spacing: 0;
}

.login-card__heading h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--login-blue-dark);
}

.login-shape,
.login-grid {
  position: absolute;
  pointer-events: none;
}

.login-shape {
  border-radius: 8px;
  transform: rotate(-12deg);
}

.login-shape--blue {
  top: -90px;
  left: -80px;
  width: min(44vw, 520px);
  height: min(44vw, 520px);
  background: linear-gradient(
    135deg,
    hsl(var(--primary) / 24%),
    hsl(var(--primary) / 4%)
  );
}

.login-shape--orange {
  right: -120px;
  bottom: -150px;
  width: min(38vw, 420px);
  height: min(38vw, 420px);
  background: linear-gradient(
    135deg,
    hsl(var(--warning) / 24%),
    hsl(var(--warning) / 6%)
  );
}

.login-grid {
  inset: 0;
  background:
    linear-gradient(
      90deg,
      hsl(var(--primary) / 7%) 0 1px,
      transparent 1px 100%
    ),
    linear-gradient(
      180deg,
      hsl(var(--primary) / 6%) 0 1px,
      transparent 1px 100%
    );
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, #000 0%, transparent 72%);
}

:deep(.text-foreground) {
  color: var(--login-blue-dark);
}

:deep(.text-muted-foreground) {
  color: var(--login-muted);
}

:deep(input) {
  min-height: 46px;
  color: var(--login-ink);
  background: hsl(var(--input-background));
  border-color: hsl(var(--input));
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(input:focus),
:deep(input:focus-visible) {
  border-color: var(--login-blue);
  box-shadow: 0 0 0 3px hsl(var(--primary) / 14%);
}

:deep(button[aria-label='login']) {
  min-height: 46px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--login-orange),
    var(--login-orange-deep)
  );
  border: none;
  border-radius: 999px;
  box-shadow: 0 14px 28px hsl(var(--warning) / 24%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

:deep(button[aria-label='login']:hover) {
  box-shadow: 0 18px 36px hsl(var(--warning) / 30%);
  filter: brightness(1.03);
  transform: translateY(-1px);
}

:deep(button[aria-label='login']:disabled) {
  transform: none;
}

@media (max-width: 640px) {
  .haobao-login {
    align-items: flex-start;
    padding: 24px;
    overflow: auto;
  }

  .haobao-login__main {
    margin-top: 24px;
  }

  .login-shape--blue {
    width: 280px;
    height: 280px;
  }

  .login-shape--orange {
    width: 240px;
    height: 240px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-card__heading h1 {
    font-size: 24px;
  }
}
</style>
