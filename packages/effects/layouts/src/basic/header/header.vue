<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { useRefresh } from '@vben/hooks';
import {
  ArrowRightLeft,
  BookOpenText,
  createIconifyIcon,
  Expand,
  Grid,
  Lightbulb,
  LightbulbOff,
  Shrink,
  Wrench,
} from '@vben/icons';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { VbenIconButton } from '@vben-core/shadcn-ui';

import { useFullscreen } from '@vueuse/core';

import {
  GlobalSearch,
  LanguageToggle,
  PreferencesButton,
  ThemeToggle,
  TimezoneButton,
} from '../../widgets';

interface Props {
  /**
   * Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'LayoutHeader',
});

withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const REFERENCE_VALUE = 50;

const accessStore = useAccessStore();
const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences();
const slots = useSlots();
const { refresh } = useRefresh();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

const HeaderTimezoneIcon = createIconifyIcon('lucide:alarm-clock');

const rightSlots = computed(() => {
  const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }];
  if (preferences.widget.globalSearch) {
    list.push({
      index: REFERENCE_VALUE + 60,
      name: 'global-search',
    });
  }

  if (preferencesButtonPosition.value.header) {
    list.push({
      index: REFERENCE_VALUE + 50,
      name: 'preferences',
    });
  }
  if (preferences.widget.themeToggle) {
    list.push({
      index: REFERENCE_VALUE,
      name: 'theme-toggle',
    });
  }
  if (preferences.widget.languageToggle) {
    list.push({
      index: REFERENCE_VALUE + 30,
      name: 'language-toggle',
    });
  }
  if (preferences.widget.timezone) {
    list.push({
      index: REFERENCE_VALUE + 40,
      name: 'timezone',
    });
  }
  if (preferences.widget.fullscreen) {
    list.push({
      index: REFERENCE_VALUE + 20,
      name: 'fullscreen',
    });
  }
  if (preferences.widget.notification) {
    list.push({
      index: REFERENCE_VALUE + 60,
      name: 'notification',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-right')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.toSorted((a, b) => a.index - b.index);
});

const leftSlots = computed(() => {
  const list: Array<{ index: number; name: string }> = [];

  if (preferences.widget.refresh) {
    list.push({
      index: 0,
      name: 'refresh',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-left')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.toSorted((a, b) => a.index - b.index);
});

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <template
    v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <VbenIconButton class="my-0 mr-1 rounded-md" @click="refresh">
          <ArrowRightLeft class="size-4" />
        </VbenIconButton>
      </template>
    </slot>
  </template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <template
    v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div
    :class="`menu-align-${preferences.header.menuAlign}`"
    class="flex h-full min-w-0 flex-1 items-center"
  >
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 flex-shrink-0 items-center">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-1 sm:mr-4"
          >
            <template #trigger-icon>
              <Grid
                class="text-muted-foreground group-hover:text-foreground size-4 group-hover:opacity-100"
              />
            </template>
          </GlobalSearch>
        </template>

        <template v-else-if="slot.name === 'preferences'">
          <PreferencesButton
            class="mr-1"
            @clear-preferences-and-logout="clearPreferencesAndLogout"
          >
            <template #icon>
              <Wrench class="text-foreground size-4" />
            </template>
          </PreferencesButton>
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <ThemeToggle class="mr-1 mt-[2px]">
            <template #icon="{ isDark }">
              <LightbulbOff v-if="isDark" class="text-foreground size-4" />
              <Lightbulb v-else class="text-foreground size-4" />
            </template>
          </ThemeToggle>
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <LanguageToggle class="mr-1">
            <template #icon>
              <BookOpenText class="text-foreground size-4" />
            </template>
          </LanguageToggle>
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <VbenIconButton
            class="mr-1 hover:animate-[shrink_0.3s_ease-in-out]"
            @click="toggleFullscreen"
          >
            <Shrink v-if="isFullscreen" class="text-foreground size-4" />
            <Expand v-else class="text-foreground size-4" />
          </VbenIconButton>
        </template>
        <template v-else-if="slot.name === 'timezone'">
          <TimezoneButton class="mr-1 mt-[2px]">
            <template #icon>
              <HeaderTimezoneIcon class="text-foreground size-4" />
            </template>
          </TimezoneButton>
        </template>
      </slot>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.menu-align-start {
  --menu-align: start;
}

.menu-align-center {
  --menu-align: center;
}

.menu-align-end {
  --menu-align: end;
}
</style>
