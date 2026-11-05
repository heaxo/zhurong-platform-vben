<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { preferences, usePreferences } from '@vben/preferences';

defineOptions({ name: 'FallbackNotFound' });

const router = useRouter();
const { isDark } = usePreferences();

const appName = computed(() => preferences.app.name);
const homePath = computed(() => preferences.app.defaultHomePath || '/');
const logoSource = computed(
  () =>
    (isDark.value ? preferences.logo.sourceDark : preferences.logo.source) ||
    preferences.logo.source ||
    preferences.logo.sourceDark ||
    '/log.png',
);

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.replace(homePath.value);
}

function goHome() {
  router.replace(homePath.value);
}
</script>

<template>
  <main class="not-found-page">
    <section class="not-found-shell">
      <div class="not-found-content">
        <div class="not-found-brand">
          <img :src="logoSource" alt="" />
          <span>{{ appName }}</span>
        </div>

        <p class="not-found-kicker">404 NOT FOUND</p>
        <h1>页面走丢了</h1>
        <p class="not-found-copy">
          当前访问的地址不存在、已被移动，或你没有权限查看该页面。
        </p>

        <div class="not-found-actions">
          <button class="primary-action" type="button" @click="goHome">
            返回首页
          </button>
          <button class="secondary-action" type="button" @click="goBack">
            返回上一页
          </button>
        </div>
      </div>

      <div class="not-found-visual" aria-hidden="true">
        <span class="error-code">404</span>
        <span class="route-line route-line--top"></span>
        <span class="route-line route-line--bottom"></span>
        <span class="route-dot route-dot--one"></span>
        <span class="route-dot route-dot--two"></span>
        <span class="route-dot route-dot--three"></span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found-page {
  --error-primary: hsl(var(--primary));
  --error-primary-strong: hsl(var(--primary));
  --error-ink: hsl(var(--foreground));
  --error-muted: hsl(var(--muted-foreground));
  --error-line: hsl(var(--border) / 80%);
  --error-surface: hsl(var(--card) / 88%);
  --error-page-bg: hsl(var(--background));
  --error-page-bg-deep: hsl(var(--background-deep));
  --error-visual-bg: hsl(var(--accent) / 76%);
  --error-soft: hsl(var(--muted) / 72%);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: clamp(24px, 5vw, 72px);
  overflow: hidden;
  color: var(--error-ink);
  background:
    linear-gradient(
      135deg,
      hsl(var(--accent) / 72%) 0%,
      var(--error-page-bg) 48%,
      var(--error-page-bg-deep) 100%
    ),
    linear-gradient(180deg, transparent 56%, hsl(var(--muted) / 62%) 100%),
    var(--error-page-bg);
}

.not-found-page::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(
      135deg,
      hsl(var(--border) / 38%) 0 1px,
      transparent 1px 100%
    ),
    linear-gradient(
      108deg,
      transparent 12%,
      hsl(var(--accent) / 42%) 44%,
      transparent 76%
    );
  background-size:
    34px 34px,
    auto;
}

.not-found-page::after {
  position: absolute;
  top: 30%;
  left: -8%;
  width: 116%;
  height: 1px;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    90deg,
    transparent,
    hsl(var(--border) / 56%),
    transparent
  );
  transform: rotate(-10deg);
}

.not-found-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(360px, 0.86fr) minmax(420px, 1fr);
  width: min(100%, 1120px);
  min-height: 560px;
  overflow: hidden;
  background: var(--error-surface);
  border: 1px solid var(--error-line);
  border-radius: 8px;
  box-shadow: 0 24px 70px hsl(var(--foreground) / 10%);
  backdrop-filter: blur(18px);
}

.not-found-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(36px, 6vw, 72px);
}

.not-found-brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 56px;
  font-size: 16px;
  font-weight: 700;
}

.not-found-brand img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.not-found-kicker {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 800;
  color: var(--error-primary-strong);
}

.not-found-content h1 {
  margin: 0;
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.08;
}

.not-found-copy {
  max-width: 420px;
  margin: 22px 0 0;
  font-size: 16px;
  line-height: 1.8;
  color: var(--error-muted);
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}

.not-found-actions button {
  height: 42px;
  padding: 0 22px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.not-found-actions button:hover {
  transform: translateY(-1px);
}

.primary-action {
  color: #fff;
  background: var(--error-primary);
  border: 0;
  box-shadow: 0 12px 28px hsl(var(--primary) / 24%);
}

.primary-action:hover {
  box-shadow: 0 16px 34px hsl(var(--primary) / 30%);
}

.secondary-action {
  color: var(--error-ink);
  background: hsl(var(--card) / 70%);
  border: 1px solid var(--error-line);
}

.secondary-action:hover {
  color: var(--error-primary-strong);
  border-color: hsl(var(--primary) / 28%);
  box-shadow: 0 10px 24px hsl(var(--foreground) / 8%);
}

.not-found-visual {
  position: relative;
  min-height: 560px;
  overflow: hidden;
  background:
    linear-gradient(135deg, transparent 34%, var(--error-soft) 100%),
    linear-gradient(180deg, hsl(var(--card) / 42%), var(--error-visual-bg));
}

.error-code {
  position: absolute;
  right: clamp(36px, 7vw, 92px);
  bottom: clamp(42px, 8vw, 110px);
  font-size: clamp(120px, 18vw, 240px);
  font-weight: 900;
  line-height: 0.8;
  color: hsl(var(--foreground) / 7%);
}

.route-line {
  position: absolute;
  width: 120%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    hsl(var(--border) / 82%),
    transparent
  );
}

.route-line--top {
  top: 30%;
  left: -18%;
  transform: rotate(-16deg);
}

.route-line--bottom {
  right: -18%;
  bottom: 28%;
  transform: rotate(-16deg);
}

.route-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: hsl(var(--card));
  border: 3px solid var(--error-primary);
  border-radius: 999px;
  box-shadow: 0 10px 26px hsl(var(--primary) / 18%);
}

.route-dot--one {
  top: 24%;
  left: 26%;
}

.route-dot--two {
  top: 50%;
  right: 24%;
  border-color: hsl(var(--muted-foreground));
}

.route-dot--three {
  right: 38%;
  bottom: 24%;
  border-color: hsl(var(--border));
}

@media (max-width: 900px) {
  .not-found-page {
    padding: 24px;
  }

  .not-found-shell {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .not-found-content {
    padding: 32px 24px;
  }

  .not-found-brand {
    margin-bottom: 40px;
  }

  .not-found-visual {
    order: -1;
    min-height: 180px;
  }

  .error-code {
    right: 24px;
    bottom: 20px;
    font-size: 108px;
  }

  .route-dot--one {
    left: 18%;
  }

  .route-dot--two {
    right: 18%;
  }
}
</style>
