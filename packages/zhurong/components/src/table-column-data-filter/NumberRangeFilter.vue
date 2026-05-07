<template>
  <div v-if="currOption" class="my-number-range-filter">
    <VxeInput
      v-model="filterData.min"
      mode="number"
      placeholder="最小值"
      clearable
      @input="changeOptionEvent"
      @keyup="keyupEvent"
    />

    <span class="separator">-</span>

    <VxeInput
      v-model="filterData.max"
      mode="number"
      placeholder="最大值"
      clearable
      @input="changeOptionEvent"
      @keyup="keyupEvent"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, reactive, ref, watch } from 'vue';

import type {
  VxeGlobalRendererHandles,
  VxeTableDefines,
} from '@vben/plugins/vxe-table';

interface RangeData {
  min: null | number | string;
  max: null | number | string;
}

const props = defineProps({
  renderOpts: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterOptions>,
  renderParams: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterParams>,
});

const currOption = ref<VxeTableDefines.FilterOption>();

const filterData = reactive<RangeData>({
  min: null,
  max: null,
});

const currField = computed(() => {
  const { column } = props.renderParams || {};
  return column ? column.field : '';
});

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== '';
}

function load() {
  const { renderParams } = props;

  if (!renderParams) {
    return;
  }

  const { column } = renderParams;
  const option = column.filters[0];

  if (!option.data || typeof option.data !== 'object') {
    option.data = {
      min: null,
      max: null,
    };
  }

  currOption.value = option;
  filterData.min = option.data.min ?? null;
  filterData.max = option.data.max ?? null;
}

function syncOptionData() {
  const option = currOption.value;

  if (!option) {
    return;
  }

  option.data = {
    min: filterData.min,
    max: filterData.max,
  };
}

function changeOptionEvent() {
  const { renderParams } = props;
  const option = currOption.value;

  if (!renderParams || !option) {
    return;
  }

  syncOptionData();

  const checked = hasValue(filterData.min) || hasValue(filterData.max);

  renderParams.$table.updateFilterOptionStatus(option, checked);
}

const keyupEvent = ({ $event }) => {
  const { renderParams } = props;

  if (!renderParams) {
    return;
  }

  if ($event.key === 'Enter') {
    changeOptionEvent();
    renderParams.$table.saveFilterPanel();
  }
};

watch(currField, () => {
  load();
});

load();
</script>

<style scoped>
.my-number-range-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
}

.separator {
  color: hsl(var(--muted-foreground));
}
</style>
