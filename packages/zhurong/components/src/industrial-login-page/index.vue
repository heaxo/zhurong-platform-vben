<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { AuthenticationLogin } from '@vben/common-ui';

interface Props {
  appName: string;
  formSchema: VbenFormSchema[];
  loading?: boolean;
  logoSource: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

const currentYear = new Date().getFullYear();

function handleSubmit(values: Recordable<any>) {
  emit('submit', values);
}
</script>

<template>
  <div class="enterprise-login">
    <section class="enterprise-login__story">
      <div class="story-grid" aria-hidden="true"></div>
      <span class="story-orbit story-orbit--large" aria-hidden="true"></span>
      <span class="story-orbit story-orbit--small" aria-hidden="true"></span>

      <header class="story-brand">
        <span class="story-brand__mark">
          <img :src="logoSource" :alt="`${appName}标识`" />
        </span>
        <span class="story-brand__name">
          <strong>ZHURONG</strong>
          <small>INDUSTRIAL PLATFORM</small>
        </span>
      </header>

      <div class="story-content">
        <p class="story-eyebrow">
          <span aria-hidden="true"></span>
          数字化生产协同平台
        </p>
        <h1>{{ appName }}</h1>
        <p class="story-description">
          连接业务订单、生产设备与现场执行，让每一次协同都有迹可循，让生产运营更加稳定高效。
        </p>

        <ul class="capability-list">
          <li>
            <span class="capability-list__index">01</span>
            <span>
              <strong>业务协同</strong>
              <small>统一数据入口与业务流程</small>
            </span>
          </li>
          <li>
            <span class="capability-list__index">02</span>
            <span>
              <strong>可靠执行</strong>
              <small>连接设备与客户端自动化任务</small>
            </span>
          </li>
          <li>
            <span class="capability-list__index">03</span>
            <span>
              <strong>全程可控</strong>
              <small>清晰掌握生产与反馈状态</small>
            </span>
          </li>
        </ul>
      </div>

      <footer class="story-footer">
        <span class="service-status">
          <i aria-hidden="true"></i>
          安全认证服务
        </span>
        <span>稳定连接 · 可靠执行</span>
      </footer>
    </section>

    <main class="enterprise-login__main">
      <span class="main-accent" aria-hidden="true"></span>

      <section class="login-card">
        <div class="login-card__brand">
          <span class="login-card__logo">
            <img :src="logoSource" :alt="`${appName}标识`" />
          </span>
          <span>
            <small>统一身份认证</small>
            <strong>{{ appName }}</strong>
          </span>
        </div>

        <div class="login-card__rule" aria-hidden="true"></div>

        <AuthenticationLogin
          :form-schema="formSchema"
          :loading="loading"
          :show-code-login="false"
          :show-forget-password="false"
          :show-qrcode-login="false"
          :show-register="false"
          :show-remember-me="false"
          :show-third-party-login="false"
          sub-title="请输入您的账号与密码，验证身份后进入系统"
          submit-button-text="登录系统"
          title="欢迎回来"
          @submit="handleSubmit"
        />

        <div class="security-note">
          <span class="security-note__icon" aria-hidden="true"></span>
          <p>
            <strong>安全访问</strong>
            <small>您的登录信息将通过安全连接进行验证</small>
          </p>
        </div>
      </section>

      <footer class="main-footer">
        © {{ currentYear }} Zhurong Platform. All rights reserved.
      </footer>
    </main>
  </div>
</template>

<style scoped>
.enterprise-login {
  --login-accent: #f97316;
  --login-accent-strong: #c2410c;
  --login-accent-soft: #9a4a22;
  --login-ink: #342b27;
  --login-muted: #766a63;
  --login-paper: #f8f6f3;
  --login-surface: rgb(255 255 255 / 94%);

  display: grid;
  grid-template-columns: minmax(520px, 1.15fr) minmax(440px, 0.85fr);
  min-height: 100vh;
  min-height: 100svh;
  color: var(--login-ink);
  background: var(--login-paper);
}

.enterprise-login__story {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  padding: clamp(36px, 5vw, 72px);
  overflow: hidden;
  color: var(--login-ink);
  background:
    radial-gradient(circle at 84% 18%, rgb(249 115 22 / 15%), transparent 28%),
    radial-gradient(circle at 18% 82%, rgb(194 65 12 / 7%), transparent 32%),
    linear-gradient(145deg, #fffaf5, #f3e4d7);
}

.story-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgb(194 65 12 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(194 65 12 / 5%) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.42;
  mask-image: linear-gradient(
    90deg,
    #000 0%,
    rgb(0 0 0 / 58%) 72%,
    transparent
  );
}

.story-grid::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    112deg,
    transparent 0 53%,
    rgb(249 115 22 / 10%) 53.1% 53.25%,
    transparent 53.35% 100%
  );
}

.story-orbit {
  position: absolute;
  pointer-events: none;
  border: 1px solid rgb(194 65 12 / 16%);
  border-radius: 50%;
}

.story-orbit::before,
.story-orbit::after {
  position: absolute;
  width: 7px;
  height: 7px;
  content: '';
  background: var(--login-accent);
  border: 2px solid #f5e7da;
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgb(249 115 22 / 10%);
}

.story-orbit--large {
  right: -150px;
  bottom: -210px;
  width: 520px;
  height: 520px;
}

.story-orbit--large::before {
  top: 55px;
  left: 104px;
}

.story-orbit--large::after {
  top: 175px;
  right: -4px;
}

.story-orbit--small {
  top: 26%;
  right: 10%;
  width: 170px;
  height: 170px;
  border-color: rgb(194 65 12 / 11%);
}

.story-orbit--small::before {
  top: 23px;
  left: 19px;
}

.story-orbit--small::after {
  right: 2px;
  bottom: 42px;
  background: #d79a6f;
}

.story-brand {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 15px;
  align-items: center;
}

.story-brand__mark,
.login-card__logo {
  display: grid;
  flex: none;
  place-items: center;
  overflow: hidden;
  background: rgb(255 255 255 / 76%);
  border: 1px solid rgb(194 65 12 / 13%);
}

.story-brand__mark {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgb(154 74 34 / 12%);
}

.story-brand__mark img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.story-brand__name {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.story-brand__name strong {
  font-size: 17px;
  font-weight: 700;
  color: var(--login-ink);
  letter-spacing: 0.18em;
}

.story-brand__name small {
  margin-top: 7px;
  font-size: 9px;
  color: rgb(74 57 48 / 52%);
  letter-spacing: 0.24em;
}

.story-content {
  position: relative;
  z-index: 1;
  width: min(100%, 670px);
  padding: clamp(56px, 8vh, 96px) 0;
  margin: auto 0;
}

.story-eyebrow {
  display: flex;
  gap: 11px;
  align-items: center;
  margin: 0 0 22px;
  font-size: 13px;
  font-weight: 600;
  color: var(--login-accent-soft);
  letter-spacing: 0.18em;
}

.story-eyebrow span {
  width: 32px;
  height: 1px;
  background: var(--login-accent);
}

.story-content h1 {
  max-width: 660px;
  margin: 0;
  font-size: clamp(40px, 4.8vw, 68px);
  font-weight: 650;
  line-height: 1.12;
  color: var(--login-ink);
  letter-spacing: -0.035em;
}

.story-description {
  max-width: 580px;
  margin: 28px 0 0;
  font-size: 16px;
  line-height: 1.9;
  color: rgb(76 61 53 / 68%);
}

.capability-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin: clamp(38px, 6vh, 64px) 0 0;
  overflow: hidden;
  list-style: none;
  background: rgb(194 65 12 / 11%);
  border: 1px solid rgb(194 65 12 / 10%);
  border-radius: 14px;
}

.capability-list li {
  display: flex;
  gap: 13px;
  min-width: 0;
  padding: 18px 16px;
  background: rgb(255 252 249 / 78%);
  backdrop-filter: blur(10px);
}

.capability-list__index {
  padding-top: 2px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  color: var(--login-accent-soft);
}

.capability-list li > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.capability-list strong {
  font-size: 13px;
  font-weight: 600;
  color: rgb(52 43 39 / 90%);
}

.capability-list small {
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  color: rgb(91 72 62 / 58%);
  white-space: nowrap;
}

.story-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgb(89 68 57 / 48%);
  letter-spacing: 0.08em;
}

.service-status {
  display: flex;
  gap: 9px;
  align-items: center;
}

.service-status i {
  width: 6px;
  height: 6px;
  background: var(--login-accent);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgb(249 115 22 / 11%);
}

.enterprise-login__main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100svh;
  padding: clamp(32px, 5vw, 76px);
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0%, rgb(249 115 22 / 10%), transparent 30%),
    linear-gradient(145deg, #fff, #f8f4ef);
}

.enterprise-login__main::before {
  position: absolute;
  top: -180px;
  right: -180px;
  width: 420px;
  height: 420px;
  pointer-events: none;
  content: '';
  border: 1px solid rgb(194 65 12 / 7%);
  border-radius: 50%;
  box-shadow:
    0 0 0 42px rgb(249 115 22 / 2.5%),
    0 0 0 84px rgb(249 115 22 / 1.5%);
}

.main-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent,
    rgb(249 115 22 / 48%) 24%,
    rgb(249 115 22 / 18%) 76%,
    transparent
  );
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(100%, 450px);
  padding: clamp(30px, 4vw, 44px);
  background: var(--login-surface);
  border: 1px solid rgb(23 34 46 / 8%);
  border-radius: 20px;
  box-shadow:
    0 28px 70px rgb(125 64 30 / 12%),
    0 2px 8px rgb(125 64 30 / 4%);
  backdrop-filter: blur(20px);
}

.login-card::before {
  position: absolute;
  top: 0;
  left: 44px;
  width: 68px;
  height: 2px;
  content: '';
  background: linear-gradient(90deg, var(--login-accent), transparent);
}

.login-card__brand {
  display: flex;
  gap: 13px;
  align-items: center;
}

.login-card__logo {
  width: 44px;
  height: 44px;
  background: linear-gradient(145deg, #fff8f1, #ffedd5);
  border-color: rgb(249 115 22 / 14%);
  border-radius: 12px;
}

.login-card__logo img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.login-card__brand > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.login-card__brand small {
  font-size: 10px;
  font-weight: 600;
  color: var(--login-accent);
  letter-spacing: 0.16em;
}

.login-card__brand strong {
  max-width: 310px;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
  color: var(--login-ink);
  white-space: nowrap;
}

.login-card__rule {
  height: 1px;
  margin: 25px 0 31px;
  background: linear-gradient(90deg, rgb(23 34 46 / 10%), transparent);
}

.login-card :deep(h2) {
  font-size: 30px;
  font-weight: 650;
  color: var(--login-ink);
  letter-spacing: -0.025em;
}

.login-card :deep(.text-muted-foreground) {
  color: var(--login-muted);
}

.login-card :deep(input) {
  min-height: 46px;
  color: var(--login-ink);
  background: rgb(247 248 248 / 86%);
  border-color: rgb(23 34 46 / 11%);
  border-radius: 9px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.login-card :deep(input:hover) {
  border-color: rgb(23 34 46 / 22%);
}

.login-card :deep(input:focus),
.login-card :deep(input:focus-visible) {
  background: #fff;
  border-color: var(--login-accent);
  box-shadow: 0 0 0 3px rgb(249 115 22 / 13%);
}

.login-card :deep(button[aria-label='login']) {
  min-height: 46px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, var(--login-accent), #e85d0d);
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 9px;
  box-shadow: 0 12px 24px rgb(234 88 12 / 20%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.login-card :deep(button[aria-label='login']:hover) {
  background: linear-gradient(135deg, #fb7e27, var(--login-accent-strong));
  box-shadow: 0 15px 30px rgb(234 88 12 / 26%);
  transform: translateY(-1px);
}

.login-card :deep(button[aria-label='login']:disabled) {
  transform: none;
}

.security-note {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 13px 15px;
  margin-top: 25px;
  background: rgb(255 247 237 / 72%);
  border: 1px solid rgb(249 115 22 / 9%);
  border-radius: 10px;
}

.security-note__icon {
  position: relative;
  flex: none;
  width: 25px;
  height: 28px;
  border: 1.5px solid var(--login-accent);
  border-radius: 12px 12px 10px 10px;
  clip-path: polygon(50% 0, 94% 16%, 88% 72%, 50% 100%, 12% 72%, 6% 16%);
}

.security-note__icon::after {
  position: absolute;
  top: 9px;
  left: 8px;
  width: 7px;
  height: 4px;
  content: '';
  border-bottom: 1.5px solid var(--login-accent);
  border-left: 1.5px solid var(--login-accent);
  transform: rotate(-45deg);
}

.security-note p {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.security-note strong {
  font-size: 11px;
  font-weight: 600;
  color: #684431;
}

.security-note small {
  margin-top: 3px;
  font-size: 10px;
  color: #9b8172;
}

.main-footer {
  position: absolute;
  right: 24px;
  bottom: 20px;
  left: 24px;
  font-size: 10px;
  color: rgb(87 64 52 / 42%);
  text-align: center;
  letter-spacing: 0.06em;
}

@media (max-width: 1080px) {
  .enterprise-login {
    grid-template-columns: minmax(420px, 0.9fr) minmax(410px, 1.1fr);
  }

  .capability-list {
    grid-template-columns: 1fr;
  }

  .capability-list li:not(:first-child) {
    display: none;
  }
}

@media (max-width: 820px) {
  .enterprise-login {
    display: block;
    min-height: 100vh;
    min-height: 100svh;
    background: linear-gradient(145deg, #fff8f1, #fff);
  }

  .enterprise-login__story {
    min-height: auto;
    padding: 25px 24px 76px;
  }

  .story-content {
    padding: 48px 0 8px;
  }

  .story-content h1 {
    font-size: clamp(30px, 8vw, 42px);
  }

  .story-description,
  .capability-list,
  .story-footer,
  .story-orbit {
    display: none;
  }

  .enterprise-login__main {
    min-height: auto;
    padding: 0 18px 56px;
    overflow: visible;
    background: transparent;
  }

  .enterprise-login__main::before {
    display: none;
  }

  .main-accent {
    display: none;
  }

  .login-card {
    padding: 28px 24px;
    margin-top: -42px;
    border-radius: 16px;
    box-shadow: 0 22px 56px rgb(125 64 30 / 14%);
  }

  .main-footer {
    bottom: 20px;
  }
}

@media (max-height: 760px) and (min-width: 821px) {
  .story-content {
    padding: 36px 0;
  }

  .story-description {
    margin-top: 18px;
  }

  .capability-list {
    margin-top: 30px;
  }

  .login-card {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .login-card__rule {
    margin-top: 20px;
    margin-bottom: 24px;
  }
}
</style>
