<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationRegister, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { registerApi } from '#/api';

defineOptions({ name: 'Register' });

const loading = ref(false);
const router = useRouter();

const formSchema: VbenFormSchema[] = [
  {
    component: 'VbenInput',
    componentProps: {
      autocomplete: 'username',
      placeholder: $t('authentication.usernameTip'),
    },
    fieldName: 'username',
    label: $t('authentication.username'),
    rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
  },
  {
    component: 'VbenInput',
    componentProps: {
      autocomplete: 'name',
      placeholder: '请输入姓名',
    },
    fieldName: 'realName',
    label: '姓名',
    rules: z.string().min(1, { message: '请输入姓名' }),
  },
  {
    component: 'VbenInputPassword',
    componentProps: {
      autocomplete: 'new-password',
      passwordStrength: true,
      placeholder: $t('authentication.password'),
    },
    fieldName: 'password',
    label: $t('authentication.password'),
    renderComponentContent() {
      return {
        strengthText: () => $t('authentication.passwordStrength'),
      };
    },
    rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
  },
  {
    component: 'VbenInputPassword',
    componentProps: {
      autocomplete: 'new-password',
      placeholder: $t('authentication.confirmPassword'),
    },
    dependencies: {
      rules(values) {
        const { password } = values;
        return z
          .string({ required_error: $t('authentication.passwordTip') })
          .min(1, { message: $t('authentication.passwordTip') })
          .refine((value) => value === password, {
            message: $t('authentication.confirmPasswordTip'),
          });
      },
      triggerFields: ['password'],
    },
    fieldName: 'confirmPassword',
    label: $t('authentication.confirmPassword'),
  },
  {
    component: 'VbenCheckbox',
    fieldName: 'agreePolicy',
    renderComponentContent: () => ({
      default: () =>
        h('span', [
          $t('authentication.agree'),
          h(
            'a',
            {
              class: 'vben-link ml-1',
              href: '',
            },
            `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
          ),
        ]),
    }),
    rules: z.boolean().refine((value) => !!value, {
      message: $t('authentication.agreeTip'),
    }),
  },
];

async function handleSubmit(value: Recordable<any>) {
  try {
    loading.value = true;
    await registerApi({
      password: value.password,
      realName: value.realName,
      username: value.username,
    });
    message.success('注册成功，请登录');
    await router.replace('/auth/login');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="goodmate-register">
    <header class="goodmate-register__brand">
      <img src="/goodmate-logo.png" alt="Goodmate SYSTEM" />
      <span>固美特科技</span>
    </header>

    <section class="goodmate-register__visual" aria-hidden="true">
      <img src="/goodmate-login-visual.jpg" alt="" />
      <div class="visual-copy">
        <p>GOODMATE DIGITAL FACTORY</p>
        <h1>打造数字化工厂，落地看得见</h1>
      </div>
    </section>

    <main class="goodmate-register__main">
      <section class="register-card">
        <div class="register-card__logo">
          <img src="/goodmate-logo.png" alt="Goodmate SYSTEM" />
        </div>

        <AuthenticationRegister
          class="register-form"
          :form-schema="formSchema"
          :loading="loading"
          login-path="/auth/login"
          submit-button-text="注册"
          sub-title="填写账号信息后即可创建 Goodmate System 账户"
          @submit="handleSubmit"
        >
          <template #title>创建账号</template>
        </AuthenticationRegister>
      </section>
    </main>
  </div>
</template>

<style scoped>
.goodmate-register {
  --primary: 202 94% 35%;
  --goodmate-blue: #056faf;
  --goodmate-blue-deep: #063f78;
  --goodmate-blue-soft: #eaf5fb;
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
    linear-gradient(135deg, #f6fbff 0%, #fff 54%, #edf7f0 100%);
}

.goodmate-register__brand {
  position: absolute;
  top: 30px;
  left: 42px;
  z-index: 5;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 9px 14px;
  background: rgb(255 255 255 / 90%);
  border: 1px solid rgb(255 255 255 / 60%);
  border-radius: 8px;
  box-shadow: 0 16px 34px rgb(0 30 70 / 18%);
  backdrop-filter: blur(12px);
}

.goodmate-register__brand img {
  width: 176px;
  height: auto;
  object-fit: contain;
}

.goodmate-register__brand span {
  padding-left: 14px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  color: var(--goodmate-blue-deep);
  border-left: 1px solid rgb(5 111 175 / 22%);
}

.goodmate-register__visual {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 118px clamp(44px, 6vw, 88px) 68px;
  overflow: hidden;
  background: var(--goodmate-blue-deep);
  clip-path: polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%);
}

.goodmate-register__visual::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: '';
  background:
    linear-gradient(
      110deg,
      rgb(3 34 71 / 84%) 0%,
      rgb(5 111 175 / 72%) 43%,
      rgb(70 175 50 / 32%) 100%
    ),
    linear-gradient(180deg, rgb(0 0 0 / 16%), rgb(0 0 0 / 24%));
}

.goodmate-register__visual img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.02);
}

.visual-copy {
  position: relative;
  z-index: 2;
  width: min(100%, 620px);
  color: #fff;
}

.visual-copy p {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  margin: 0 0 22px;
  font-size: 13px;
  font-weight: 800;
  background: linear-gradient(
    90deg,
    rgb(5 111 175 / 72%),
    rgb(70 175 50 / 76%)
  );
  border-left: 4px solid #46af32;
}

.visual-copy h1 {
  max-width: 600px;
  margin: 0;
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0;
  text-shadow: 0 6px 24px rgb(0 26 62 / 34%);
}

.goodmate-register__main {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 56px clamp(38px, 7vw, 112px) 56px 22px;
}

.goodmate-register__main::before,
.goodmate-register__main::after {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  content: '';
  border: 1px solid var(--goodmate-line);
}

.goodmate-register__main::before {
  top: 12%;
  right: 12%;
  width: 168px;
  height: 168px;
  transform: rotate(45deg);
}

.goodmate-register__main::after {
  right: 20%;
  bottom: 12%;
  width: 88px;
  height: 88px;
  background: rgb(70 175 50 / 7%);
  transform: rotate(45deg);
}

.register-card {
  width: min(100%, 430px);
  max-height: calc(100vh - 112px);
  padding: 34px 40px 28px;
  overflow-y: auto;
  background: rgb(255 255 255 / 96%);
  border: 1px solid rgb(5 111 175 / 12%);
  border-radius: 8px;
  box-shadow:
    0 32px 80px rgb(18 48 79 / 14%),
    0 8px 24px rgb(5 111 175 / 8%);
  backdrop-filter: blur(14px);
}

.register-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-bottom: 24px;
}

.register-card__logo img {
  width: min(100%, 238px);
  height: auto;
  object-fit: contain;
}

:deep(.text-foreground) {
  color: var(--goodmate-ink);
}

:deep(.text-muted-foreground) {
  color: var(--goodmate-muted);
}

.register-form :deep(h2) {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.25;
  color: var(--goodmate-ink);
  letter-spacing: 0;
}

.register-form :deep(p) {
  font-size: 13px;
  color: var(--goodmate-muted);
}

.register-form :deep(input) {
  min-height: 46px;
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

.register-form :deep(input::placeholder) {
  color: #7f92a4;
}

.register-form :deep(input:focus),
.register-form :deep(input:focus-visible) {
  background: #fff;
  border-color: var(--goodmate-blue);
  box-shadow: 0 0 0 3px rgb(5 111 175 / 12%);
  outline: none;
}

.register-form :deep(button[aria-label='register']),
.register-form :deep(form button[type='submit']) {
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

.register-form :deep(button[aria-label='register']:hover),
.register-form :deep(form button[type='submit']:hover) {
  box-shadow: 0 18px 34px rgb(5 111 175 / 28%);
  filter: brightness(1.04);
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .goodmate-register {
    grid-template-columns: 1fr;
    overflow: auto;
    background: linear-gradient(180deg, #063f78 0 220px, #f6fbff 220px);
  }

  .goodmate-register__brand {
    top: 22px;
    left: 22px;
  }

  .goodmate-register__brand img {
    width: 156px;
  }

  .goodmate-register__brand span {
    display: none;
  }

  .goodmate-register__visual {
    min-height: 300px;
    padding: 94px 24px 34px;
    clip-path: none;
  }

  .visual-copy p {
    height: 30px;
    margin-bottom: 16px;
    font-size: 11px;
  }

  .visual-copy h1 {
    max-width: 430px;
    font-size: 34px;
  }

  .goodmate-register__main {
    align-items: flex-start;
    min-height: auto;
    padding: 24px 18px 30px;
  }

  .goodmate-register__main::before,
  .goodmate-register__main::after {
    display: none;
  }

  .register-card {
    max-height: none;
    padding: 32px 26px 24px;
  }
}

@media (max-width: 420px) {
  .goodmate-register__brand img {
    width: 138px;
  }

  .visual-copy h1 {
    font-size: 30px;
  }

  .register-card {
    padding-right: 22px;
    padding-left: 22px;
  }

  .register-card__logo img {
    width: min(100%, 220px);
  }

  .register-form :deep(h2) {
    font-size: 24px;
  }
}
</style>
