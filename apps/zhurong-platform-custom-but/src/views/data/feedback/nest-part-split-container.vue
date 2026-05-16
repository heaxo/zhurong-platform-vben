<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal,useVbenDrawer } from '@vben/common-ui';
import { Button, Input, InputNumber, Select, Space, Tag, message,Form,
  FormItem } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({
  name: 'SplitNestPart',
});

type RowKey = number | string;
type SplitMode = 'manual' | 'auto';

export interface NestPartItem {
  ordRef: string;
  prdRefDst: string;
  nstRef: string;
  quantity: number;
  recID?: RowKey;
  remark?: string;
  [key: string]: any;
}

export interface OpenPayload {
  /**
   * 基准原始数据：每次传入的都是未拆分前的数据
   */
  nestParts: NestPartItem[];
  /**
   * 变更数据：只包含被拆动过的数据
   * 每组 2 条：原始剩余 + 新拆分
   */
  changedNestParts?: NestPartItem[];
}

export interface SplitRecord {
  sourceRowKey: string;
  linkKey: string;
  sourceRecID?: RowKey;
  originalOrdRef: string;
  splitOrdRef: string;
  prdRefDst: string;
  nstRef: string;
  quantity: number;
  remainderQuantity: number;
  suffix: string;
  remark?: string;
  mode: SplitMode;
}

export interface SubmitPayload {
  finalNestParts: NestPartItem[];
  splitRecords: SplitRecord[];
  changedNestParts: NestPartItem[];
}

interface SourceRow extends NestPartItem {
  __rowKey: string;
  __linkKey: string;
  __originOrdRef: string;
  __originQuantity: number;
  __splitStatus: 'split' | 'unsplit';
  __rawSourceItem: NestPartItem;
  __rawSplitItem?: NestPartItem;
}

const DEFAULT_SUFFIX = '_B';

const sourceRows = ref<SourceRow[]>([]);
const splitRecords = ref<SplitRecord[]>([]);

const selectedSourceRowKey = ref<string>();
const selectedSplitRowKey = ref<string>();
const manualSplitQuantity = ref<number>(1);
const manualSuffix = ref<string>(DEFAULT_SUFFIX);

const autoOrdRef = ref<string>();
const autoSplitQuantity = ref<number>();
const autoSuffix = ref<string>(DEFAULT_SUFFIX);

const selectedSourceRow = computed(() => {
  return sourceRows.value.find((item) => item.__rowKey === selectedSourceRowKey.value);
});

const selectedSplitRecord = computed(() => {
  return splitRecords.value.find((item) => item.sourceRowKey === selectedSplitRowKey.value);
});

const orderOptions = computed(() => {
  return [...new Set(sourceRows.value.map((item) => item.__originOrdRef))].map((value) => ({
    label: value,
    value,
  }));
});

const finalSourceNestParts = computed<NestPartItem[]>(() => {
  return sourceRows.value.map((sourceRow) => ({
    ...cloneDeep(sourceRow.__rawSourceItem),
    ordRef: sourceRow.__originOrdRef,
    quantity: sourceRow.quantity,
    recID: sourceRow.recID,
    remark: sourceRow.__rawSourceItem.remark,
  }));
});

const finalSplitNestParts = computed<NestPartItem[]>(() => {
  return splitRecords.value
    .map((record) => {
      const sourceRow = sourceRows.value.find((item) => item.__rowKey === record.sourceRowKey);
      if (!sourceRow) {
        return null;
      }

      const rawSplitBase = sourceRow.__rawSplitItem ?? sourceRow.__rawSourceItem;
      console.log("rawSplitBase",rawSplitBase);
      return {
        ...cloneDeep(rawSplitBase),
        ordRef: record.splitOrdRef,
        quantity: record.quantity,
        recID: sourceRow.recID,
        remark: record.remark,
      } satisfies NestPartItem;
    })
    .filter(Boolean) as NestPartItem[];
});

const finalNestParts = computed<NestPartItem[]>(() => {
  const splitMap = new Map(finalSplitNestParts.value.map((item) => [item.recID??item.recId, item]));

  return finalSourceNestParts.value.flatMap((sourceItem) => {
    const splitItem = splitMap.get(sourceItem.recID??sourceItem.recId);
    return splitItem ? [sourceItem, splitItem] : [sourceItem];
  });
});
const changedNestParts = computed<NestPartItem[]>(() => {
  return splitRecords.value.flatMap((record) => {
    const sourceItem = finalSourceNestParts.value.find(
      (item) => (item.recID??item.recId) === record.linkKey,
    );
    const splitItem = finalSplitNestParts.value.find(
      (item) => (item.recID??item.recId) === record.linkKey,
    );
    console.log(sourceItem,splitItem)
    return [sourceItem, splitItem].filter(Boolean) as NestPartItem[];
  });
});
const propsData = ref({});
const [Container, containerApi] = useVbenDrawer({
  closeOnClickModal: false,
  confirmText: '确认',
  placement: 'bottom',
  destroyOnClose: true,
  class:'h-[90%]',
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    const data = containerApi.getData<OpenPayload>();
    propsData.value = data;
    initState(data?.nestParts ?? [], data?.changedNestParts ?? []);
  },
  onConfirm() {
    Object.keys(remarkDraftMap.value).forEach((key) => {
      commitSplitRemark(key);
    });

    containerApi.lock();
    containerApi.setData<SubmitPayload>({
      submit: true,
      finalNestParts: cloneDeep(finalNestParts.value),
      changedNestParts: cloneDeep(changedNestParts.value),
      splitRecords: cloneDeep(splitRecords.value),
    } satisfies SubmitPayload);
    containerApi.close();
  },
});

const sourceGridOptions: VxeGridProps<SourceRow> = {
  border: true,
  columnConfig: { resizable: true },
  columns: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'prdRefDst', title: '零件编号', minWidth: 120 },
    { field: 'quantity', title: '数量', minWidth: 50 },
    { field: 'ordRef', title: '订单号', minWidth: 160 },
    {
      field: '__splitStatus',
      title: '拆分状态',
      minWidth: 80,
      slots: { default: 'sourceStatus' },
    },
  ],
  data: [],
  pagerConfig: { enabled: false },
  rowConfig: { isCurrent: true, isHover: true },
  scrollY: { enabled: true, gt: 0 },
  showOverflow: true,
  stripe: true,
};

const splitGridOptions: VxeGridProps<SplitRecord> = {
  border: true,
  columnConfig: { resizable: true },
  columns: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'prdRefDst', title: '零件编码', minWidth: 150, slots: { default: 'splitPrdRef' } },
    {
      field: 'quantity',
      title: '数量',
      minWidth: 75,
      slots: { default: 'splitQuantity' },
    },
    {
      field: 'splitOrdRef',
      title: '订单号',
      minWidth: 180,
      slots: { default: 'splitOrdRef' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 240,
      slots: { default: 'splitRemark' },
    },
  ],
  data: [],
  pagerConfig: { enabled: false },
  rowConfig: { isCurrent: true, isHover: true },
  scrollY: { enabled: true, gt: 0 },
  showOverflow: true,
  stripe: true,
};

const [SourceGrid, sourceGridApi] = useVbenVxeGrid({
  gridEvents: {
    cellClick({ row }) {
      handleSourceRowClick(row as SourceRow);
    },
  },
  gridOptions: sourceGridOptions,
});

const [SplitGrid, splitGridApi] = useVbenVxeGrid({
  gridEvents: {
    cellClick({ row }) {
      handleSplitRowClick(row as SplitRecord);
    },
  },
  gridOptions: splitGridOptions,
});

function normalizeSuffix(value?: string) {
  return value?.trim() || DEFAULT_SUFFIX;
}

function extractSuffix(originalOrdRef: string, splitOrdRef: string) {
  if (splitOrdRef?.startsWith(originalOrdRef)) {
    return normalizeSuffix(splitOrdRef.slice(originalOrdRef.length));
  }
  return DEFAULT_SUFFIX;
}

function refreshGrids() {
  sourceGridApi.setGridOptions({
    data: [...sourceRows.value],
    rowClassName: ({ row }: { row: SourceRow }) => {
      return row.__rowKey === selectedSourceRowKey.value ? 'split-source-row--active' : '';
    },
  });

  splitGridApi.setGridOptions({
    data: [...splitRecords.value],
    rowClassName: ({ row }: { row: SplitRecord }) => {
      return row.sourceRowKey === selectedSplitRowKey.value ? 'split-result-row--active' : '';
    },
  });
}

function resetEditorState() {
  selectedSourceRowKey.value = undefined;
  selectedSplitRowKey.value = undefined;
  manualSplitQuantity.value = 1;
  manualSuffix.value = DEFAULT_SUFFIX;
  autoOrdRef.value = undefined;
  autoSplitQuantity.value = undefined;
  autoSuffix.value = DEFAULT_SUFFIX;
}

function initState(nestParts: NestPartItem[], changedNestParts: NestPartItem[]) {
  resetEditorState();

  const changedGroupMap = new Map<string, NestPartItem[]>();

  changedNestParts.forEach((item) => {
    const linkKey = item.recID??item.recId;
    const group = changedGroupMap.get(linkKey) ?? [];
    group.push(cloneDeep(item));
    changedGroupMap.set(linkKey, group);
  });

  sourceRows.value = cloneDeep(nestParts).map((item, index) => {
    const linkKey = item.recID??item.recId;
    const changedGroup = changedGroupMap.get(linkKey) ?? [];
    console.log(changedGroup);
    // changedNestParts 里：
    // 1 条是“原始剩余数据”（订单号仍然等于原 ordRef）
    // 1 条是“新拆分数据”（订单号 != 原 ordRef）
    const changedSourceItem =
      changedGroup.find((changedItem) => changedItem.ordRef === item.ordRef) ?? null;
    const splitItem =
      changedGroup.find((changedItem) => changedItem.ordRef !== item.ordRef) ?? null;

    const originQuantity = Number(item.quantity ?? 0); // 基准原始总数，永远来自 nestParts
    const currentSourceQuantity = Number(changedSourceItem?.quantity ?? originQuantity);

    const mergedSourceItem: NestPartItem = {
      ...cloneDeep(item),
      quantity: currentSourceQuantity,
      remark: changedSourceItem?.remark ?? item.remark,
    };

    return {
      ...mergedSourceItem,
      __linkKey: linkKey,
      __originOrdRef: item.ordRef,
      __originQuantity: originQuantity,
      __rawSourceItem: cloneDeep(mergedSourceItem),
      __rawSplitItem: splitItem ? cloneDeep(splitItem) : undefined,
      __rowKey: item.recID??item.recId,
      __splitStatus: splitItem ? 'split' : 'unsplit',
    } satisfies SourceRow;
  });

  splitRecords.value = sourceRows.value
    .filter((sourceRow) => sourceRow.__splitStatus === 'split' && sourceRow.__rawSplitItem)
    .map((sourceRow) => {
      const splitItem = sourceRow.__rawSplitItem!;
      return {
        linkKey: sourceRow.__linkKey,
        mode: 'manual',
        nstRef: sourceRow.nstRef,
        originalOrdRef: sourceRow.__originOrdRef,
        prdRefDst: sourceRow.prdRefDst,
        quantity: Number(splitItem.quantity ?? 0),
        remainderQuantity: Number(sourceRow.quantity ?? 0),
        remark: splitItem.remark,
        sourceRecID: sourceRow.recID,
        sourceRowKey: sourceRow.__rowKey,
        splitOrdRef: splitItem.ordRef,
        suffix: extractSuffix(sourceRow.__originOrdRef, splitItem.ordRef),
      } satisfies SplitRecord;
    });

  remarkDraftMap.value = Object.fromEntries(
    splitRecords.value.map((item) => [item.sourceRowKey, item.remark ?? '']),
  );

  nextTick(() => {
    refreshGrids();
  });
}

function handleSourceRowClick(row: SourceRow) {
  if (row.__splitStatus === 'split') {
    message.warning('当前行已经拆分，如需重新调整，请修改右表或先撤销。');
    return;
  }
  if (row.__originQuantity <= 1) {
    message.warning('只有数量大于 1 的数据才允许拆分。');
    return;
  }

  selectedSourceRowKey.value = row.__rowKey;
  manualSplitQuantity.value = 1;
  manualSuffix.value = DEFAULT_SUFFIX;
}

function handleSplitRowClick(row: SplitRecord) {
  selectedSplitRowKey.value = row.sourceRowKey;
}

function validateSplit(row: SourceRow | undefined, splitQty?: number | null) {
  if (!row) {
    return '请先点击左表选择一条源数据';
  }
  if (row.__splitStatus === 'split') {
    return '当前源数据已经拆分';
  }
  if (!Number.isInteger(splitQty) || Number(splitQty) <= 0) {
    return '拆分数量必须是大于 0 的整数';
  }
  if (Number(splitQty) >= row.__originQuantity) {
    return '拆分数量必须小于原始数量';
  }
  return '';
}

function applySplit(row: SourceRow, splitQty: number, suffix: string, mode: SplitMode) {
  const normalizedSuffix = normalizeSuffix(suffix);
  const remainderQuantity = row.__originQuantity - splitQty;
  const splitOrdRef = `${row.__originOrdRef}${normalizedSuffix}`;

  row.quantity = remainderQuantity;
  row.__splitStatus = 'split';

  const existingIndex = splitRecords.value.findIndex((item) => item.sourceRowKey === row.__rowKey);
  const existingRecord = existingIndex >= 0 ? splitRecords.value[existingIndex] : undefined;

  const record: SplitRecord = {
    linkKey: row.__linkKey,
    mode,
    nstRef: row.nstRef,
    originalOrdRef: row.__originOrdRef,
    prdRefDst: row.prdRefDst,
    quantity: splitQty,
    remainderQuantity,
    remark: existingRecord?.remark ?? row.__rawSplitItem?.remark ?? '',
    sourceRecID: row.recID,
    sourceRowKey: row.__rowKey,
    splitOrdRef,
    suffix: normalizedSuffix,
  };

  if (existingIndex >= 0) {
    splitRecords.value.splice(existingIndex, 1, record);
  } else {
    splitRecords.value.unshift(record);
  }

  selectedSplitRowKey.value = row.__rowKey;
  refreshGrids();
}

function handleManualSplit() {
  const error = validateSplit(selectedSourceRow.value, manualSplitQuantity.value);
  if (error) {
    message.warning(error);
    return;
  }

  applySplit(
    selectedSourceRow.value!,
    Number(manualSplitQuantity.value),
    manualSuffix.value,
    'manual',
  );

  selectedSourceRowKey.value = undefined;
  manualSplitQuantity.value = 1;
  manualSuffix.value = DEFAULT_SUFFIX;
}

function handleAutoSplit() {
  const ordRef = autoOrdRef.value?.trim();
  const targetQty = Number(autoSplitQuantity.value);

  if (!ordRef) {
    message.warning('请选择订单号');
    return;
  }
  if (!Number.isInteger(targetQty) || targetQty <= 0) {
    message.warning('自动拆分数量必须是大于 0 的整数');
    return;
  }

  const targetRow = [...sourceRows.value]
    .filter(
      (item) =>
        item.__originOrdRef === ordRef &&
        item.__splitStatus === 'unsplit' &&
        item.__originQuantity > targetQty,
    )
    .sort((a, b) => b.__originQuantity - a.__originQuantity)[0];

  if (!targetRow) {
    message.warning('没有找到满足条件的可拆分数据');
    return;
  }

  applySplit(targetRow, targetQty, autoSuffix.value, 'auto');
  autoSplitQuantity.value = undefined;
  autoSuffix.value = DEFAULT_SUFFIX;
}

function updateSplitQuantity(record: SplitRecord, value: number | null) {
  const nextQty = Number(value);
  if (!Number.isInteger(nextQty) || nextQty <= 0) {
    message.warning('拆分数量必须是大于 0 的整数');
    refreshGrids();
    return;
  }

  const recordIndex = splitRecords.value.findIndex((item) => item.sourceRowKey === record.sourceRowKey);
  if (recordIndex < 0) {
    return;
  }

  const targetRecord = splitRecords.value[recordIndex]!;
  const sourceRow = sourceRows.value.find((item) => item.__rowKey === targetRecord.sourceRowKey);
  if (!sourceRow) {
    return;
  }

  if (nextQty >= sourceRow.__originQuantity) {
    message.warning('拆分数量必须小于原始数量');
    refreshGrids();
    return;
  }

  targetRecord.quantity = nextQty;
  targetRecord.remainderQuantity = sourceRow.__originQuantity - nextQty;
  sourceRow.quantity = targetRecord.remainderQuantity;

  if (sourceRow.__rawSplitItem) {
    sourceRow.__rawSplitItem.quantity = nextQty;
  }

  refreshGrids();
}

function updateSplitOrdRef(record: SplitRecord, value?: string) {
  const nextOrdRef = value?.trim();
  if (!nextOrdRef) {
    message.warning('订单号不能为空');
    refreshGrids();
    return;
  }

  const recordIndex = splitRecords.value.findIndex((item) => item.sourceRowKey === record.sourceRowKey);
  if (recordIndex < 0) {
    return;
  }

  const targetRecord = splitRecords.value[recordIndex]!;
  if (!nextOrdRef.startsWith(targetRecord.originalOrdRef)) {
    message.warning('被拆分订单号必须以原始订单号开头');
    refreshGrids();
    return;
  }

  targetRecord.splitOrdRef = nextOrdRef;
  targetRecord.suffix = extractSuffix(targetRecord.originalOrdRef, nextOrdRef);

  const sourceRow = sourceRows.value.find((item) => item.__rowKey === targetRecord.sourceRowKey);
  if (sourceRow?.__rawSplitItem) {
    sourceRow.__rawSplitItem.ordRef = nextOrdRef;
  }

  refreshGrids();
}
const remarkDraftMap = ref<Record<string, string>>({});
function updateSplitRemark(record: SplitRecord, value?: string) {
  const recordIndex = splitRecords.value.findIndex((item) => item.sourceRowKey === record.sourceRowKey);
  if (recordIndex < 0) {
    return;
  }

  const targetRecord = splitRecords.value[recordIndex]!;
  targetRecord.remark = value ?? '';

  const sourceRow = sourceRows.value.find((item) => item.__rowKey === targetRecord.sourceRowKey);
  if (sourceRow) {
    sourceRow.remark = targetRecord.remark;

    if (sourceRow.__rawSplitItem) {
      sourceRow.__rawSplitItem.remark = targetRecord.remark;
    }
  }

  refreshGrids();
}
function commitSplitRemark(sourceRowKey: string) {
  const targetRecord = splitRecords.value.find(
    (item) => item.sourceRowKey === sourceRowKey,
  );
  if (!targetRecord) {
    return;
  }

  const nextRemark = remarkDraftMap.value[sourceRowKey] ?? '';
  targetRecord.remark = nextRemark;

  const sourceRow = sourceRows.value.find(
    (item) => item.__rowKey === sourceRowKey,
  );
  if (sourceRow?.__rawSplitItem) {
    sourceRow.__rawSplitItem.remark = nextRemark;
  }
}

function removeSplit(record?: SplitRecord) {
  const targetRecord = record ?? selectedSplitRecord.value;
  if (!targetRecord) {
    message.warning('请先点击右表选择一条拆分数据');
    return;
  }

  const sourceRow = sourceRows.value.find((item) => item.__rowKey === targetRecord.sourceRowKey);
  if (sourceRow) {
    sourceRow.quantity = sourceRow.__originQuantity;
    sourceRow.__splitStatus = 'unsplit';
  }

  splitRecords.value = splitRecords.value.filter((item) => item.sourceRowKey !== targetRecord.sourceRowKey);

  if (selectedSplitRowKey.value === targetRecord.sourceRowKey) {
    selectedSplitRowKey.value = undefined;
  }

  refreshGrids();
}

function getSplitPrdRef(record: SplitRecord) {
  return sourceRows.value.find((item) => item.__rowKey === record.sourceRowKey)?.prdRefDst ?? '';
}
</script>

<template>
  <Container>
    <div class="flex gap-4 max-md:flex-col">
      <div class="flex min-w-0 basis-[50%] flex-col gap-4">
        <section class="rounded-lg border bg-card p-4">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">手动拆分</div>
              <div class="text-muted-foreground text-sm">
                点击左表一行后，填写拆分数量和后缀即可拆分。
              </div>
            </div>
            <Tag v-if="selectedSourceRow" color="processing">
              当前选择：{{ selectedSourceRow.ordRef }}
            </Tag>
          </div>


          <Form layout="inline">
            <FormItem label="原始数量">
              <Input
                :value="selectedSourceRow?.__originQuantity ?? ''"
                disabled
                placeholder="请选择左表数据"
                class="w-[100px]"
              />
            </FormItem>

            <FormItem label="拆分数量">
              <InputNumber
                v-model:value="manualSplitQuantity"
                :max="selectedSourceRow ? selectedSourceRow.__originQuantity - 1 : 1"
                :min="1"
                placeholder="请输入拆分数量"
                class="w-[85px]"
              />
            </FormItem>

            <FormItem label="后缀">
              <Input
                class="w-[85px]"
                v-model:value="manualSuffix"
                placeholder="默认 _B"
              />
            </FormItem>

            <FormItem >
              <Button type="primary" @click="handleManualSplit">手动拆分</Button>
            </FormItem>
          </Form>
        </section>

        <section class="flex min-h-0 flex-1 flex-col rounded-lg border bg-card p-4">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">原始数据</div>
              <div class="text-muted-foreground text-sm">
              </div>
            </div>
            <div class="text-muted-foreground text-sm">共 {{ sourceRows.length }} 条</div>
          </div>

          <SourceGrid>
            <template #sourceStatus="{ row }">
              <Tag :color="row.__splitStatus === 'split' ? 'success' : 'default'">
                {{ row.__splitStatus === 'split' ? '已拆分' : '未拆分' }}
              </Tag>
            </template>
          </SourceGrid>
        </section>
      </div>

      <div class="flex min-w-0 basis-[50%] flex-col gap-4">
        <section class="rounded-lg border bg-card p-4">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">自动拆分</div>
              <div class="text-muted-foreground text-sm">
                输入订单号和目标拆分数量，自动选择该订单下数量最大且可拆的一条。
              </div>
            </div>
            <Button danger :disabled="!selectedSplitRecord" @click="removeSplit()">
              撤销当前拆分
            </Button>
          </div>

          <Form layout="inline">
            <FormItem label="订单号">
              <Select
                v-model:value="autoOrdRef"
                :options="orderOptions"
                allow-clear
                placeholder="请选择订单号"
                show-search
              />
            </FormItem>
            <FormItem label="目标拆分数量">
              <InputNumber
                v-model:value="autoSplitQuantity"
                :min="1"
                placeholder="请输入目标数量"
                class="w-[85px]"
              />
            </FormItem>
            <FormItem label="后缀">
              <Input v-model:value="autoSuffix" placeholder="默认 _B"
                     class="w-[85px]"/>
            </FormItem>
            <FormItem>
              <Button block type="primary" @click="handleAutoSplit">自动拆分</Button>
            </FormItem>
          </Form>
        </section>

        <section class="flex min-h-0 flex-1 flex-col rounded-lg border bg-card p-4">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">拆分数据</div>
              <div class="text-muted-foreground text-sm">
              </div>
            </div>
            <div class="text-muted-foreground text-sm">共 {{ splitRecords.length }} 条</div>
          </div>

          <SplitGrid>
            <template #splitPrdRef="{ row }">
              <span>{{ getSplitPrdRef(row) }}</span>
            </template>

            <template #splitQuantity="{ row }">
              <InputNumber
                :max="sourceRows.find((item) => item.__rowKey === row.sourceRowKey)?.__originQuantity - 1"
                :min="1"
                :value="row.quantity"
                class="w-full"
                @change="(value) => updateSplitQuantity(row, value as number | null)"
              />
            </template>

            <template #splitOrdRef="{ row }">
              <Input
                :value="row.splitOrdRef"
                placeholder="请输入被拆分订单号"
                @blur="updateSplitOrdRef(row, ($event.target as HTMLInputElement)?.value)"
              />
            </template>

            <template #splitStatus>
              <Tag color="success">已拆分</Tag>
            </template>

            <template #splitRemark="{ row }">
              <Input
                v-model:value="remarkDraftMap[row.sourceRowKey]"
                placeholder="请输入拆分原因备注"
                @blur="commitSplitRemark(row.sourceRowKey)"
              />
            </template>
          </SplitGrid>
        </section>
      </div>
    </div>

    <template #prepend-footer>
      <div class="flex w-full items-center justify-between text-sm">
        <div>
          <span class="font-bold">程序号：</span>
          <span class="text-muted-fordeground">
           {{propsData.cnc}}
        </span>
        </div>
        <Space>
          <Tag color="blue">原始 {{ sourceRows.length }}</Tag>
          <Tag color="green">拆分 {{ splitRecords.length }}</Tag>
          <Tag color="processing">合并 {{ finalNestParts.length }}</Tag>
        </Space>
      </div>
    </template>
  </Container>
</template>

<style scoped>
:deep(.split-source-row--active td) {
  background-color: hsl(var(--accent)) !important;
  color: hsl(var(--accent-foreground)) !important;
}

:deep(.split-result-row--active td) {
  background-color: hsl(var(--muted)) !important;
  color: hsl(var(--foreground)) !important;
}

:deep(.split-source-row--active td:first-child) {
  box-shadow: inset 2px 0 0 hsl(var(--primary));
}

:deep(.split-result-row--active td:first-child) {
  box-shadow: inset 2px 0 0 hsl(var(--primary));
}
:deep(.dark .vxe-cell--checkbox){
  color: white !important;
}
</style>
