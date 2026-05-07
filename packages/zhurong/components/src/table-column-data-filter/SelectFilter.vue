<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';

import type {
  VxeGlobalRendererHandles,
  VxeTableDefines,
} from '@vben/plugins/vxe-table';

interface SelectOption {
  label: string;
  value: number | string | boolean;
}

interface SelectFilterRenderOpts {
  options?: SelectOption[];
  fetchOptions?: () => Promise<SelectOption[]> | SelectOption[];
  source?: 'column';
  labelFormatter?: (value: any, row?: any) => string;
}

const props = defineProps({
  renderOpts: Object as PropType<
    VxeGlobalRendererHandles.RenderTableFilterOptions & SelectFilterRenderOpts
  >,
  renderParams: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterParams>,
});

const currOption = ref<VxeTableDefines.FilterOption>();
const selectOptions = ref<SelectOption[]>([]);

const currField = computed(() => {
  const { column } = props.renderParams || {};
  return column ? column.field : '';
});

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== '';
}

function buildOptionsFromColumn(): SelectOption[] {
  const { renderParams, renderOpts } = props;

  if (!renderParams) {
    return [];
  }

  const { $table, column } = renderParams;
  const field = column.field;
  const labelFormatter = renderOpts?.labelFormatter;

  // 当前表格全量数据
  const tableData = $table.getTableData().fullData || [];
  console.log(tableData);
  const map = new Map<any, SelectOption>();

  tableData.forEach((row: any) => {
    const value = row[field];

    if (!hasValue(value)) {
      return;
    }

    if (!map.has(value)) {
      map.set(value, {
        label: labelFormatter ? labelFormatter(value, row) : String(value),
        value,
      });
    }
  });

  return [...map.values()];
}

async function loadOptions() {
  const options = props.renderOpts?.options;
  const fetchOptions = props.renderOpts?.fetchOptions;
  const source = props.renderOpts?.source;

  if (Array.isArray(options)) {
    selectOptions.value = options;
    return;
  }

  if (fetchOptions) {
    selectOptions.value = await fetchOptions();
    return;
  }

  if (source === 'column') {
    selectOptions.value = buildOptionsFromColumn();
    return;
  }

  selectOptions.value = [];
}

async function load() {
  const { renderParams } = props;

  if (!renderParams) {
    return;
  }

  const { column } = renderParams;
  currOption.value = column.filters[0];

  await loadOptions();
}

function changeOptionEvent() {
  const { renderParams } = props;
  const option = currOption.value;

  if (!renderParams || !option) {
    return;
  }

  renderParams.$table.updateFilterOptionStatus(option, hasValue(option.data));
}

watch(currField, () => {
  load();
});

load();
</script>

<template>
  <div v-if="currOption" class="my-select-filter">
    <VxeSelect
      v-model="currOption.data"
      clearable
      filterable
      transfer
      placeholder="请选择"
      @change="changeOptionEvent"
    >
      <VxeOption
        v-for="item in selectOptions"
        :key="String(item.value)"
        :label="item.label"
        :value="item.value"
      />
    </VxeSelect>
  </div>
</template>

<style scoped>
.my-select-filter {
  min-width: 180px;
  padding: 10px;
}
</style>
