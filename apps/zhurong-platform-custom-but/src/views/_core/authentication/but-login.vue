<script lang="ts" setup>
import type {VbenFormSchema} from '@vben/common-ui';

import {computed, markRaw} from 'vue';
import {AuthenticationLogin, SliderCaptcha, z} from '@vben/common-ui';
import {useAuthStore} from '#/store';

defineOptions({name: 'Login'});

const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => [
  {
    component: 'VbenInput',
    componentProps: {
      placeholder: '用户名',
    },
    fieldName: 'username',
  },
  {
    component: 'VbenInputPassword',
    componentProps: {
      placeholder: '密码',
    },
    fieldName: 'password',
  },
  {
    component: markRaw(SliderCaptcha),
    fieldName: 'captcha',
  },
]);
</script>

<template>
  <div class="login-root">
    <!-- 动态背景 -->
    <div class="bg-grid"></div>
    <div class="bg-gradient"></div>

    <!-- 主体 -->
    <div class="login-wrapper">
      <!-- 左侧品牌区 -->
      <div class="login-left">
        <h1 class="logo">BUT</h1>
        <p class="desc">专注于液压控制，结构力学，仿真模拟，金属热处理，智能制造等专业领域</p>

        <div class="scan-line"></div>
      </div>

      <!-- 右侧登录 -->
      <div class="login-panel">

        <div class="panel-inner">
          <h2>LOGIN</h2>

          <AuthenticationLogin
            :form-schema="formSchema"
            :loading="authStore.loginLoading"
            @submit="authStore.authLogin"
            title="巴特车间下料平台"
            :showRegister="false"
            :showRememberMe="false"
            :showThirdPartyLogin="false"
            :showForgetPassword="false"
            :showQrcodeLogin="false"
            :showCodeLogin="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================= 背景 ================= */

.login-root {
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at 20% 30%, rgba(253, 204, 6, 0.08), transparent 40%),
  #050505;
}

/* 网格 */
.bg-grid {
  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(rgba(253, 204, 6, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(253, 204, 6, 0.08) 1px, transparent 1px);

  background-size: 60px 60px;

  /* 👇 初始位置 */
  background-position: 0 0;

  animation: moveGrid 20s linear infinite;
}
.bg-grid::after {
  content: '';
  position: absolute;
  inset: 0;

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6),
    transparent 40%
  );

  pointer-events: none;
}
@keyframes moveGrid {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 60px;
  }
}

/* 渐变光 */
.bg-gradient {
  position: absolute;
  width: 1000px;
  height: 1000px;
  background: radial-gradient(circle, #fdcc06 0%, transparent 60%);
  filter: blur(150px);
  opacity: 0.15;
  top: -200px;
  left: -200px;
}

/* ================= 布局 ================= */

.login-wrapper {
  display: flex;
  height: 100%;
  position: relative;
  z-index: 2;
  justify-content: center;
}

/* 左侧 */
.login-left {
  flex: 0.9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 120px;
  position: relative;
}

.logo {
  font-size: 80px;
  color: #fdcc06;
  letter-spacing: 8px;
  text-shadow: 0 0 20px rgba(253, 204, 6, 0.6);
}

.desc {
  color: #888;
  margin-top: 20px;
}

.scan-line {
  position: absolute;
  top: 50%;
  left: 0;

  width: 100%;
  height: 2px;

  transform: translateY(calc(-50% + 50px));
  pointer-events: none;
  overflow: hidden;
}

.scan-line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -20%;

  width: 120px;
  height: 2px;

  transform: translateY(-50%);

  /* 核心：细光线 + 渐变头尾 */
  background: linear-gradient(
    90deg,
    transparent,
    rgba(253, 204, 6, 0.9),
    transparent
  );

  /* 光晕 */
  box-shadow: 0 0 8px rgba(253, 204, 6, 0.8),
  0 0 20px rgba(253, 204, 6, 0.4);

  animation: scanMove 4s linear infinite;
}

@keyframes scanMove {
  0% {
    left: -20%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 120%;
    opacity: 0;
  }
}

.scan-line::after {
  content: '';
  position: absolute;
  inset: 0;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(253, 204, 6, 0.08),
    transparent
  );
}

/* ================= 登录面板 ================= */

.login-panel {
  width: 420px;

  height: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
}

/* 内部 */
.panel-inner {
  width: 100%;
  padding: 42px 36px;
  border-radius: 18px;
  position: relative;
  overflow: hidden;

  /* 真毛玻璃核心 */
  background: rgba(255, 255, 255, 0.04);

  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);

  /* 边缘高光（关键） */
  border: 1px solid rgba(255, 255, 255, 0.08);

  /* 空间感 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
  inset 0 0 20px rgba(255, 255, 255, 0.03);
}

.panel-inner::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 18px;

  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(253, 204, 6, 0.12),
    transparent 25%
  );

  animation: rotateBorder 8s linear infinite;

  -webkit-mask: linear-gradient(#000 0 0) content-box,
  linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;

  padding: 1px;
  opacity: 0.4; /* 👈 更隐约 */
  pointer-events: none;
}

.panel-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;

  /* 模拟玻璃反光 */
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.02) 30%,
    transparent 60%
  );

  opacity: 0.6;
  pointer-events: none;
}

.panel-inner h2 {
  color: #fdcc06;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

/* ================= 表单增强 ================= */

:deep(.vben-input),
:deep(.vben-select) {
  background: #111 !important;
  border: 1px solid rgba(253, 204, 6, 0.3);
  color: #fff;
}

/* 按钮（重点） */
:deep(.vben-button) {
  background: linear-gradient(90deg, #fdcc06, #ffe45e);
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 20px rgba(253, 204, 6, 0.6);
  border: none;
  transition: all 0.3s;
}

:deep(.vben-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(253, 204, 6, 1);
}

/* ================= 左侧品牌（升级） ================= */

.logo {
  font-size: 88px;
  font-weight: 800;
  letter-spacing: 10px;
  color: #fdcc06;
  text-shadow: 0 0 10px rgba(253, 204, 6, 0.6),
  0 0 30px rgba(253, 204, 6, 0.4),
  0 0 60px rgba(253, 204, 6, 0.2);
}

/* ================= 登录面板（重做） ================= */

.login-panel {
  width: 420px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-inner {
  width: 100%;
  padding: 42px 36px;
  border-radius: 18px;
  position: relative;

  background: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(20px);

  box-shadow: inset 0 0 40px rgba(253, 204, 6, 0.05),
  0 20px 60px rgba(0, 0, 0, 0.8);
}

/* ✨ 渐变边框（移到这里） */
.panel-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  padding: 1px;

  background: linear-gradient(
    135deg,
    rgba(253, 204, 6, 0.4),
    rgba(253, 204, 6, 0.2),
    transparent
  );

  -webkit-mask: linear-gradient(#000 0 0) content-box,
  linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  pointer-events: none;
}

/* 标题 */
.panel-inner h2 {
  color: #fdcc06;
  margin-bottom: 24px;
  letter-spacing: 4px;
  font-weight: 600;
}

/* ================= 表单优化 ================= */

/* 输入框（更细腻） */
:deep(.vben-input),
:deep(.vben-select) {
  background: rgba(20, 20, 20, 0.9) !important;
  border: 1px solid rgba(253, 204, 6, 0.2);
  color: #fff;
  transition: all 0.3s;
}

/* focus效果（关键细节） */
:deep(.vben-input:focus),
:deep(.vben-select:focus) {
  border-color: #fdcc06;
  box-shadow: 0 0 0 2px rgba(253, 204, 6, 0.2);
}

/* ================= 按钮（升级为CTA） ================= */

:deep(.vben-button) {
  background: linear-gradient(90deg, #fdcc06, #ffe45e);
  color: #000;
  font-weight: 700;
  letter-spacing: 1px;

  border: none;
  border-radius: 10px;

  /* 发光更真实 */
  box-shadow: 0 0 10px rgba(253, 204, 6, 0.6),
  0 0 30px rgba(253, 204, 6, 0.3);

  transition: all 0.25s ease;
}

/* hover 动效 */
:deep(.vben-button:hover) {
  transform: translateY(-2px) scale(1.01);

  box-shadow: 0 0 20px rgba(253, 204, 6, 0.9),
  0 0 40px rgba(253, 204, 6, 0.5);
}
</style>
