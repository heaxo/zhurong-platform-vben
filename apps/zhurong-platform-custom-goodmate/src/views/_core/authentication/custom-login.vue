<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { AuthenticationLogin, z } from '@vben/common-ui';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const formSchema: VbenFormSchema[] = [
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
];

const metrics = [
  {
    label: '服务企业',
    value: '1000+',
  },
  {
    label: '行业深耕',
    value: '20年',
  },
  {
    label: '一体化方案',
    value: 'ERP+MES',
  },
];
</script>

<template>
  <div class="goodmate-login">
    <header class="goodmate-login__brand">
      <img src="/goodmate-logo.png" alt="Goodmate SYSTEM" />
      <span>固美特科技</span>
    </header>

    <section class="goodmate-login__visual" aria-label="固美特下料平台">
      <div class="visual-media" aria-hidden="true">
        <img src="/goodmate-login-visual.jpg" alt="" />
      </div>

      <div class="visual-content">
        <p class="visual-kicker">GOODMATE DIGITAL FACTORY</p>
        <h1>打造数字化工厂，落地看得见</h1>
        <p class="visual-copy">
          聚焦钣金、五金、冲压、机加行业，融合精益化、信息化与 ERP+MES
          管理体系。
        </p>

        <div class="visual-metrics">
          <div v-for="item in metrics" :key="item.label" class="metric-item">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <main class="goodmate-login__main">
      <section class="login-card">
        <div class="login-card__logo">
          <img src="/goodmate-logo.png" alt="Goodmate SYSTEM" />
        </div>

        <AuthenticationLogin
          class="login-form"
          :form-schema="formSchema"
          :loading="authStore.loginLoading"
          :show-code-login="false"
          :show-forget-password="false"
          :show-qrcode-login="false"
          :show-register="true"
          :show-remember-me="false"
          :show-third-party-login="false"
          register-path="/auth/register"
          submit-button-text="登录"
          sub-title="请输入账号密码进入 Goodmate System"
          title="账号登录"
          @submit="authStore.authLogin"
        />

        <p class="login-card__footer">ERP / MES / 生产计划 / 设备协同</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.goodmate-login {
  --primary: 202 94% 35%;
  --goodmate-blue: #056faf;
  --goodmate-blue-deep: #063f78;
  --goodmate-blue-soft: #eaf5fb;
  --goodmate-green: #46af32;
  --goodmate-green-deep: #16813a;
  --goodmate-ink: #12304f;
  --goodmate-muted: #6a7d90;
  --goodmate-line: rgb(5 111 175 / 15%);

  position: relative;
  display: grid;
  grid-template-columns: minmax(520px, 1.08fr) minmax(420px, 0.92fr);
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  color: var(--goodmate-ink);
  background:
    linear-gradient(90deg, transparent 0 49%, rgb(5 111 175 / 5%) 49% 100%),
    linear-gradient(135deg, #f6fbff 0%, #ffffff 54%, #edf7f0 100%);
}

.goodmate-login::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(135deg, rgb(5 111 175 / 8%) 0 1px, transparent 1px 100%),
    linear-gradient(90deg, rgb(5 111 175 / 6%) 0 1px, transparent 1px 100%);
  background-size:
    34px 34px,
    68px 68px;
  mask-image: linear-gradient(90deg, black 0%, transparent 58%);
}

.goodmate-login__brand {
  position: absolute;
  top: 30px;
  left: 42px;
  z-index: 5;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 9px 14px;
  color: var(--goodmate-blue-deep);
  background: rgb(255 255 255 / 90%);
  border: 1px solid rgb(255 255 255 / 60%);
  border-radius: 8px;
  box-shadow: 0 16px 34px rgb(0 30 70 / 18%);
  backdrop-filter: blur(12px);
}

.goodmate-login__brand img {
  width: 176px;
  height: auto;
  object-fit: contain;
}

.goodmate-login__brand span {
  padding-left: 14px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  color: var(--goodmate-blue-deep);
  border-left: 1px solid rgb(5 111 175 / 22%);
}

.goodmate-login__visual {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 118px clamp(44px, 6vw, 88px) 68px;
  overflow: hidden;
  background: var(--goodmate-blue-deep);
  clip-path: polygon(0 0, 88% 0, 100% 100%, 0 100%);
}

.goodmate-login__visual::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(
      110deg,
      rgb(3 34 71 / 82%) 0%,
      rgb(5 111 175 / 70%) 43%,
      rgb(70 175 50 / 32%) 100%
    ),
    linear-gradient(180deg, rgb(0 0 0 / 16%), rgb(0 0 0 / 24%));
}

.goodmate-login__visual::after {
  position: absolute;
  top: -12%;
  right: 5.5%;
  z-index: 2;
  width: 2px;
  height: 124%;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    180deg,
    transparent,
    rgb(255 255 255 / 62%) 18%,
    rgb(70 175 50 / 58%) 54%,
    rgb(5 111 175 / 50%) 78%,
    transparent
  );
  box-shadow: 0 0 32px rgb(70 175 50 / 26%);
  transform: rotate(-6.8deg);
  transform-origin: center;
}

.visual-media {
  position: absolute;
  inset: 0;
}

.visual-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.02);
}

.visual-content {
  position: relative;
  z-index: 3;
  width: min(100%, 660px);
  color: #fff;
}

.visual-kicker {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  margin: 0 0 22px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(
    90deg,
    rgb(5 111 175 / 72%),
    rgb(70 175 50 / 76%)
  );
  border-left: 4px solid var(--goodmate-green);
}

.visual-content h1 {
  max-width: 600px;
  margin: 0;
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0;
  text-shadow: 0 6px 24px rgb(0 26 62 / 34%);
}

.visual-copy {
  max-width: 560px;
  margin: 26px 0 0;
  font-size: 18px;
  line-height: 1.85;
  color: rgb(255 255 255 / 88%);
}

.visual-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: min(100%, 590px);
  margin-top: 42px;
  overflow: hidden;
  background: rgb(255 255 255 / 22%);
  border: 1px solid rgb(255 255 255 / 22%);
}

.metric-item {
  min-width: 0;
  padding: 18px 20px;
  background: rgb(3 50 94 / 62%);
  backdrop-filter: blur(8px);
}

.metric-item strong,
.metric-item span {
  display: block;
}

.metric-item strong {
  overflow-wrap: anywhere;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
}

.metric-item span {
  margin-top: 6px;
  font-size: 13px;
  color: rgb(255 255 255 / 72%);
}

.goodmate-login__main {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 56px clamp(38px, 7vw, 112px) 56px 22px;
}

.goodmate-login__main::before,
.goodmate-login__main::after {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  content: '';
  border: 1px solid var(--goodmate-line);
}

.goodmate-login__main::before {
  top: 12%;
  right: 12%;
  width: 168px;
  height: 168px;
  transform: rotate(45deg);
}

.goodmate-login__main::after {
  right: 20%;
  bottom: 12%;
  width: 88px;
  height: 88px;
  background: rgb(70 175 50 / 7%);
  transform: rotate(45deg);
}

.login-card {
  width: min(100%, 430px);
  padding: 42px 40px 28px;
  background: rgb(255 255 255 / 96%);
  border: 1px solid rgb(5 111 175 / 12%);
  border-radius: 8px;
  box-shadow:
    0 32px 80px rgb(18 48 79 / 14%),
    0 8px 24px rgb(5 111 175 / 8%);
  backdrop-filter: blur(14px);
}

.login-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  margin-bottom: 28px;
}

.login-card__logo img {
  width: min(100%, 252px);
  height: auto;
  object-fit: contain;
}

.login-card__footer {
  padding-top: 20px;
  margin: 24px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--goodmate-muted);
  text-align: center;
  border-top: 1px solid rgb(5 111 175 / 10%);
}

:deep(.text-foreground) {
  color: var(--goodmate-ink);
}

:deep(.text-muted-foreground) {
  color: var(--goodmate-muted);
}

.login-form :deep(h2) {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.25;
  color: var(--goodmate-ink);
  letter-spacing: 0;
}

.login-form :deep(p) {
  font-size: 13px;
  color: var(--goodmate-muted);
}

.login-form :deep(input) {
  min-height: 48px;
  padding-right: 15px;
  padding-left: 15px;
  color: var(--goodmate-ink);
  background: var(--goodmate-blue-soft);
  border: 1px solid rgb(5 111 175 / 16%);
  border-radius: 8px;
  box-shadow: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.login-form :deep(input::placeholder) {
  color: #7f92a4;
}

.login-form :deep(input:hover) {
  border-color: rgb(5 111 175 / 36%);
}

.login-form :deep(input:focus),
.login-form :deep(input:focus-visible) {
  background: #fff;
  border-color: var(--goodmate-blue);
  box-shadow: 0 0 0 3px rgb(5 111 175 / 12%);
  outline: none;
}

.login-form :deep(input:-webkit-autofill),
.login-form :deep(input:-webkit-autofill:hover),
.login-form :deep(input:-webkit-autofill:focus) {
  -webkit-text-fill-color: var(--goodmate-ink);
  box-shadow: 0 0 0 1000px var(--goodmate-blue-soft) inset;
}

.login-form :deep(button[aria-label='login']),
.login-form :deep(form button[type='submit']) {
  min-height: 48px;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(
    90deg,
    var(--goodmate-blue),
    var(--goodmate-green-deep)
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 14px 28px rgb(5 111 175 / 22%);
  transition:
    box-shadow 0.2s ease,
    filter 0.2s ease,
    transform 0.2s ease;
}

.login-form :deep(button[aria-label='login']:hover),
.login-form :deep(form button[type='submit']:hover) {
  box-shadow: 0 18px 34px rgb(5 111 175 / 28%);
  filter: brightness(1.04);
  transform: translateY(-1px);
}

.login-form :deep(button[aria-label='login']:active),
.login-form :deep(form button[type='submit']:active) {
  transform: translateY(0);
}

.login-form :deep(button[aria-label='login']:disabled),
.login-form :deep(form button[type='submit']:disabled) {
  box-shadow: none;
  opacity: 0.65;
  transform: none;
}

@media (max-width: 1120px) {
  .goodmate-login {
    grid-template-columns: minmax(420px, 0.95fr) minmax(390px, 1.05fr);
  }

  .goodmate-login__visual {
    padding-right: 64px;
  }

  .visual-content h1 {
    font-size: 46px;
  }

  .visual-metrics {
    grid-template-columns: 1fr;
    width: min(100%, 360px);
  }
}

@media (max-width: 860px) {
  .goodmate-login {
    grid-template-columns: 1fr;
    overflow: auto;
    background: linear-gradient(180deg, #063f78 0 220px, #f6fbff 220px);
  }

  .goodmate-login::before {
    mask-image: none;
  }

  .goodmate-login__brand {
    top: 22px;
    left: 22px;
  }

  .goodmate-login__brand img {
    width: 156px;
  }

  .goodmate-login__brand span {
    display: none;
  }

  .goodmate-login__visual {
    min-height: 330px;
    padding: 96px 24px 34px;
    clip-path: none;
  }

  .goodmate-login__visual::after {
    display: none;
  }

  .visual-content {
    width: 100%;
  }

  .visual-kicker {
    height: 30px;
    margin-bottom: 16px;
    font-size: 11px;
  }

  .visual-content h1 {
    max-width: 430px;
    font-size: 34px;
  }

  .visual-copy {
    max-width: 470px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.7;
  }

  .visual-metrics {
    display: none;
  }

  .goodmate-login__main {
    align-items: flex-start;
    min-height: auto;
    padding: 24px 18px 30px;
  }

  .goodmate-login__main::before,
  .goodmate-login__main::after {
    display: none;
  }

  .login-card {
    padding: 34px 26px 24px;
  }

  .login-card__logo {
    margin-bottom: 24px;
  }
}

@media (max-width: 420px) {
  .goodmate-login__brand img {
    width: 138px;
  }

  .visual-content h1 {
    font-size: 30px;
  }

  .login-card {
    padding-right: 22px;
    padding-left: 22px;
  }

  .login-card__logo img {
    width: min(100%, 220px);
  }

  .login-form :deep(h2) {
    font-size: 25px;
  }
}
</style>
