<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  Button,
  Input,
  InputNumber,
  Space,
  Tag,
  message,
  Form,
  FormItem,
} from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestGetDetachableParts } from '#/api';

defineOptions({
  name: 'SplitNestPart',
});

type RowKey = number | string;
type SplitMode = 'manual';

export interface NestPartItem {
  mnORef: string;
  orgMnoRef: string;
  prdRefDst: string;
  nstRef: string;
  quantity: number;
  rq?: number;
  minQuan?: number;
  recID?: RowKey;
  remark?: string;
  [key: string]: any;
}

export interface OpenPayload {
  /**
   * 基准原始数据：每次传入的都是未拆分前的数据
   */
  nestParts: NestPartItem[];
  cnc?: string;
  nstRef?: string;
  /**
   * 变更数据：只包含被拆动过的数据
   * 每组 2 条：原始剩余 + 新拆分
   */
  changedNestParts?: NestPartItem[];
}

interface DetachablePartItem {
  mnORef?: string;
  mnoRef?: string;
  orgMnoRef?: string;
  prdRef?: string;
  prdRefDst?: string;
  rq?: number;
  minQuan?: number;
  [key: string]: any;
}

export interface SplitRecord {
  sourceRowKey: string;
  linkKey: string;
  sourceRecID?: RowKey;
  originalMnORef: string;
  splitMnORef: string;
  prdRefDst: string;
  nstRef: string;
  quantity: number;
  remainderQuantity: number;
  suffix: string;
  remark?: string;
  mode: SplitMode;
}

export interface SubmitPayload {
  submit?: boolean;
  finalNestParts: NestPartItem[];
  splitRecords: SplitRecord[];
  changedNestParts: NestPartItem[];
}

interface SourceRow extends NestPartItem {
  __rowKey: string;
  __linkKey: string;
  __originMnORef: string;
  __originQuantity: number;
  __splitStatus: 'detachable' | 'split' | 'unsplit';
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

const selectedSourceRow = computed(() => {
  return sourceRows.value.find(
    (item) => item.__rowKey === selectedSourceRowKey.value,
  );
});

const selectedSplitRecord = computed(() => {
  return splitRecords.value.find(
    (item) => item.sourceRowKey === selectedSplitRowKey.value,
  );
});

const finalSourceNestParts = computed<NestPartItem[]>(() => {
  return sourceRows.value.map((sourceRow) => ({
    ...cloneDeep(sourceRow.__rawSourceItem),
    mnORef: sourceRow.__originMnORef,
    quantity: sourceRow.quantity,
    rq: sourceRow.rq,
    minQuan: sourceRow.minQuan,
    recID: sourceRow.recID,
    remark: sourceRow.__rawSourceItem.remark,
  }));
});

const finalSplitNestParts = computed<NestPartItem[]>(() => {
  return splitRecords.value
    .map((record) => {
      const sourceRow = sourceRows.value.find(
        (item) => item.__rowKey === record.sourceRowKey,
      );
      if (!sourceRow) {
        return null;
      }

      const rawSplitBase =
        sourceRow.__rawSplitItem ?? sourceRow.__rawSourceItem;
      return {
        ...cloneDeep(rawSplitBase),
        mnORef: record.splitMnORef,
        quantity: record.quantity,
        rq: sourceRow.rq,
        minQuan: sourceRow.minQuan,
        recID: sourceRow.recID,
        remark: record.remark,
      } satisfies NestPartItem;
    })
    .filter(Boolean) as NestPartItem[];
});

const finalNestParts = computed<NestPartItem[]>(() => {
  const splitMap = new Map(
    finalSplitNestParts.value.map((item) => [getRowKey(item), item]),
  );

  return finalSourceNestParts.value.flatMap((sourceItem) => {
    const splitItem = splitMap.get(getRowKey(sourceItem));
    return splitItem ? [sourceItem, splitItem] : [sourceItem];
  });
});
const changedNestParts = computed<NestPartItem[]>(() => {
  return splitRecords.value.flatMap((record) => {
    const sourceItem = finalSourceNestParts.value.find(
      (item) => getRowKey(item) === record.linkKey,
    );
    const splitItem = finalSplitNestParts.value.find(
      (item) => getRowKey(item) === record.linkKey,
    );
    return [sourceItem, splitItem].filter(Boolean) as NestPartItem[];
  });
});
const propsData = ref<Partial<OpenPayload> & Record<string, any>>({});
const [Container, containerApi] = useVbenDrawer({
  closeOnClickModal: false,
  confirmText: '确认',
  placement: 'bottom',
  destroyOnClose: true,
  class: 'h-[90%]',
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    const data = containerApi.getData<OpenPayload>();
    propsData.value = data;
    initState(data?.nestParts ?? [], data?.changedNestParts ?? []);
    void loadDetachableParts();
  },
  onConfirm() {
    Object.keys(remarkDraftMap.value).forEach((key) => {
      commitSplitRemark(key);
    });

    containerApi.lock();
    containerApi.setData<SubmitPayload>({
      nstRef: propsData.value.nstRef,
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
    { field: 'quantity', title: '套料数量', minWidth: 70 },
    { field: 'rq', title: '计划数量', minWidth: 70 },
    { field: 'minQuan', title: '原始计划数量', minWidth: 90 },
    { field: 'mnORef', title: '订单号', minWidth: 160 },
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
    {
      field: 'prdRefDst',
      title: '零件编码',
      minWidth: 150,
      slots: { default: 'splitPrdRef' },
    },
    {
      field: 'quantity',
      title: '数量',
      minWidth: 75,
      slots: { default: 'splitQuantity' },
    },
    {
      field: 'splitMnORef',
      title: '订单号',
      minWidth: 180,
      slots: { default: 'splitMnORef' },
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

function getMnORef(item: Record<string, any>) {
  return String(item.mnORef ?? item.mnoRef ?? '').trim();
}

function getPrdRef(item: Record<string, any>) {
  return String(item.prdRefDst ?? item.prdRef ?? '').trim();
}

function getRowKey(item: Record<string, any>) {
  return String(item.recID ?? item.recId ?? '');
}

function normalizeNestPart(item: NestPartItem) {
  return {
    ...cloneDeep(item),
    mnORef: getMnORef(item),
  };
}

function extractSuffix(originalMnORef: string, splitMnORef: string) {
  if (splitMnORef?.startsWith(originalMnORef)) {
    return normalizeSuffix(splitMnORef.slice(originalMnORef.length));
  }
  return DEFAULT_SUFFIX;
}

function refreshGrids() {
  sourceGridApi.setGridOptions({
    data: [...sourceRows.value],
    rowClassName: ({ row }: { row: SourceRow }) => {
      return row.__rowKey === selectedSourceRowKey.value
        ? 'split-source-row--active'
        : '';
    },
  });

  splitGridApi.setGridOptions({
    data: [...splitRecords.value],
    rowClassName: ({ row }: { row: SplitRecord }) => {
      return row.sourceRowKey === selectedSplitRowKey.value
        ? 'split-result-row--active'
        : '';
    },
  });
}

function resetEditorState() {
  selectedSourceRowKey.value = undefined;
  selectedSplitRowKey.value = undefined;
  manualSplitQuantity.value = 1;
  manualSuffix.value = DEFAULT_SUFFIX;
}

function initState(
  nestParts: NestPartItem[],
  changedNestParts: NestPartItem[],
) {
  resetEditorState();

  const changedGroupMap = new Map<string, NestPartItem[]>();

  changedNestParts.forEach((item) => {
    const changedItem = normalizeNestPart(item);
    const linkKey = getRowKey(changedItem);
    const group = changedGroupMap.get(linkKey) ?? [];
    group.push(changedItem);
    changedGroupMap.set(linkKey, group);
  });

  sourceRows.value = cloneDeep(nestParts).map(
    (item: NestPartItem, index: number) => {
      const normalizedItem = normalizeNestPart(item);
      const linkKey =
        getRowKey(normalizedItem) ||
        `${normalizedItem.mnORef}_${getPrdRef(normalizedItem)}_${index}`;
      const changedGroup = changedGroupMap.get(linkKey) ?? [];
      // changedNestParts 里：
      // 1 条是“原始剩余数据”（订单号仍然等于原 mnORef）
      // 1 条是“新拆分数据”（订单号 != 原 mnORef）
      const changedSourceItem =
        changedGroup.find(
          (changedItem) => changedItem.mnORef === normalizedItem.mnORef,
        ) ?? null;
      const splitItem =
        changedGroup.find(
          (changedItem) => changedItem.mnORef !== normalizedItem.mnORef,
        ) ?? null;

      const originQuantity = Number(normalizedItem.quantity ?? 0); // 基准原始总数，永远来自 nestParts
      const currentSourceQuantity = Number(
        changedSourceItem?.quantity ?? originQuantity,
      );

      const mergedSourceItem: NestPartItem = {
        ...cloneDeep(normalizedItem),
        quantity: currentSourceQuantity,
        rq: normalizedItem.rq,
        minQuan: normalizedItem.minQuan,
        remark: changedSourceItem?.remark ?? normalizedItem.remark,
      };

      return {
        ...mergedSourceItem,
        __linkKey: linkKey,
        __originMnORef: normalizedItem.mnORef,
        __originQuantity: originQuantity,
        __rawSourceItem: cloneDeep(mergedSourceItem),
        __rawSplitItem: splitItem ? cloneDeep(splitItem) : undefined,
        __rowKey: linkKey,
        __splitStatus: splitItem ? 'split' : 'unsplit',
      } satisfies SourceRow;
    },
  );

  splitRecords.value = sourceRows.value
    .filter(
      (sourceRow) =>
        sourceRow.__splitStatus === 'split' && sourceRow.__rawSplitItem,
    )
    .map((sourceRow) => {
      const splitItem = sourceRow.__rawSplitItem!;
      return {
        linkKey: sourceRow.__linkKey,
        mode: 'manual',
        nstRef: sourceRow.nstRef,
        originalMnORef: sourceRow.__originMnORef,
        prdRefDst: sourceRow.prdRefDst,
        quantity: Number(splitItem.quantity ?? 0),
        remainderQuantity: Number(sourceRow.quantity ?? 0),
        remark: splitItem.remark,
        sourceRecID: sourceRow.recID,
        sourceRowKey: sourceRow.__rowKey,
        splitMnORef: splitItem.mnORef,
        suffix: extractSuffix(sourceRow.__originMnORef, splitItem.mnORef),
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

function applySplit(
  row: SourceRow,
  splitQty: number,
  suffix: string,
  mode: SplitMode,
) {
  const normalizedSuffix = normalizeSuffix(suffix);
  const remainderQuantity = row.__originQuantity - splitQty;
  const splitMnORef = `${row.__originMnORef}${normalizedSuffix}`;

  row.quantity = remainderQuantity;
  row.__splitStatus = 'split';

  const existingIndex = splitRecords.value.findIndex(
    (item) => item.sourceRowKey === row.__rowKey,
  );
  const existingRecord =
    existingIndex >= 0 ? splitRecords.value[existingIndex] : undefined;

  const record: SplitRecord = {
    linkKey: row.__linkKey,
    mode,
    nstRef: row.nstRef,
    originalMnORef: row.__originMnORef,
    prdRefDst: row.prdRefDst,
    quantity: splitQty,
    remainderQuantity,
    remark: existingRecord?.remark ?? row.__rawSplitItem?.remark ?? '',
    sourceRecID: row.recID,
    sourceRowKey: row.__rowKey,
    splitMnORef,
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
  const error = validateSplit(
    selectedSourceRow.value,
    manualSplitQuantity.value,
  );
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

function findSourceRowsByDetachablePart(part: DetachablePartItem) {
  const mnORef = getMnORef(part);
  return sourceRows.value.filter((item) => item.__originMnORef === mnORef);
}

async function loadDetachableParts() {
  const nstRef = propsData.value.nstRef;
  if (!nstRef) {
    return;
  }

  try {
    const detachableParts = (await requestGetDetachableParts({
      nstRef,
    })) as DetachablePartItem[];
    if (!Array.isArray(detachableParts) || detachableParts.length === 0) {
      return;
    }

    let updated = false;

    detachableParts.forEach((part) => {
      const rq = Number(part.rq);
      const minQuan = Number(part.minQuan);
      const matchedRows = findSourceRowsByDetachablePart(part);

      if (
        matchedRows.length === 0 ||
        !Number.isFinite(rq) ||
        !Number.isFinite(minQuan)
      ) {
        return;
      }

      matchedRows.forEach((sourceRow) => {
        if (sourceRow.__splitStatus !== 'unsplit') {
          return;
        }

        sourceRow.quantity = sourceRow.__originQuantity;
        sourceRow.rq = rq;
        sourceRow.minQuan = minQuan;
        sourceRow.__splitStatus = 'detachable';
        updated = true;
      });
    });

    if (updated) {
      refreshGrids();
    }
  } catch (error) {
    console.error(error);
  }
}

function updateSplitQuantity(record: SplitRecord, value: number | null) {
  const nextQty = Number(value);
  if (!Number.isInteger(nextQty) || nextQty <= 0) {
    message.warning('拆分数量必须是大于 0 的整数');
    refreshGrids();
    return;
  }

  const recordIndex = splitRecords.value.findIndex(
    (item) => item.sourceRowKey === record.sourceRowKey,
  );
  if (recordIndex < 0) {
    return;
  }

  const targetRecord = splitRecords.value[recordIndex]!;
  const sourceRow = sourceRows.value.find(
    (item) => item.__rowKey === targetRecord.sourceRowKey,
  );
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

function updateSplitMnORef(record: SplitRecord, value?: string) {
  const nextMnORef = value?.trim();
  if (!nextMnORef) {
    message.warning('订单号不能为空');
    refreshGrids();
    return;
  }

  const recordIndex = splitRecords.value.findIndex(
    (item) => item.sourceRowKey === record.sourceRowKey,
  );
  if (recordIndex < 0) {
    return;
  }

  const targetRecord = splitRecords.value[recordIndex]!;
  if (!nextMnORef.startsWith(targetRecord.originalMnORef)) {
    message.warning('被拆分订单号必须以原始订单号开头');
    refreshGrids();
    return;
  }

  targetRecord.splitMnORef = nextMnORef;
  targetRecord.suffix = extractSuffix(targetRecord.originalMnORef, nextMnORef);

  const sourceRow = sourceRows.value.find(
    (item) => item.__rowKey === targetRecord.sourceRowKey,
  );
  if (sourceRow?.__rawSplitItem) {
    sourceRow.__rawSplitItem.mnORef = nextMnORef;
  }

  refreshGrids();
}
const remarkDraftMap = ref<Record<string, string>>({});
function updateSplitRemark(record: SplitRecord, value?: string) {
  const recordIndex = splitRecords.value.findIndex(
    (item) => item.sourceRowKey === record.sourceRowKey,
  );
  if (recordIndex < 0) {
    return;
  }

  const targetRecord = splitRecords.value[recordIndex]!;
  targetRecord.remark = value ?? '';

  const sourceRow = sourceRows.value.find(
    (item) => item.__rowKey === targetRecord.sourceRowKey,
  );
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

  const sourceRow = sourceRows.value.find(
    (item) => item.__rowKey === targetRecord.sourceRowKey,
  );
  if (sourceRow) {
    sourceRow.quantity = sourceRow.__originQuantity;
    sourceRow.__splitStatus = 'unsplit';
    sourceRow.rq = undefined;
    sourceRow.minQuan = undefined;
  }

  splitRecords.value = splitRecords.value.filter(
    (item) => item.sourceRowKey !== targetRecord.sourceRowKey,
  );

  if (selectedSplitRowKey.value === targetRecord.sourceRowKey) {
    selectedSplitRowKey.value = undefined;
  }

  refreshGrids();
}

function getSplitPrdRef(record: SplitRecord) {
  return (
    sourceRows.value.find((item) => item.__rowKey === record.sourceRowKey)
      ?.prdRefDst ?? ''
  );
}

function getSourceStatusColor(status: SourceRow['__splitStatus']) {
  if (status === 'split') {
    return 'success';
  }
  if (status === 'detachable') {
    return 'processing';
  }
  return 'default';
}

function getSourceStatusText(status: SourceRow['__splitStatus']) {
  if (status === 'split') {
    return '已拆分';
  }
  if (status === 'detachable') {
    return '可拆分';
  }
  return '未拆分';
}
</script>

<template>
  <Container>
    <div class="flex gap-4 max-md:flex-col">
      <div class="flex min-w-0 basis-[50%] flex-col gap-4">
        <section
          class="flex min-h-[132px] flex-col rounded-lg border bg-card p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">手动拆分</div>
              <div class="text-sm text-muted-foreground">
                点击左表一行后，填写拆分数量和后缀即可拆分。
              </div>
            </div>
            <Tag v-if="selectedSourceRow" color="processing">
              当前选择：{{ selectedSourceRow.mnORef }}
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
                :max="
                  selectedSourceRow ? selectedSourceRow.__originQuantity - 1 : 1
                "
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

            <FormItem>
              <Button type="primary" @click="handleManualSplit"
                >手动拆分</Button
              >
            </FormItem>
          </Form>
        </section>

        <section
          class="flex min-h-0 flex-1 flex-col rounded-lg border bg-card p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">原始数据</div>
              <div class="text-sm text-muted-foreground"></div>
            </div>
            <div class="text-sm text-muted-foreground">
              共 {{ sourceRows.length }} 条
            </div>
          </div>

          <SourceGrid>
            <template #sourceStatus="{ row }">
              <Tag :color="getSourceStatusColor(row.__splitStatus)">
                {{ getSourceStatusText(row.__splitStatus) }}
              </Tag>
            </template>
          </SourceGrid>
        </section>
      </div>

      <div class="flex min-w-0 basis-[50%] flex-col gap-4">
        <section class="flex min-h-[132px] rounded-lg border bg-card p-4">
          <div class="flex w-full items-center justify-between gap-4">
            <div>
              <div class="text-base font-medium">拆分操作</div>
            </div>
            <Space>
              <Button
                danger
                :disabled="!selectedSplitRecord"
                @click="removeSplit()"
              >
                撤销当前拆分
              </Button>
            </Space>
          </div>
        </section>

        <section
          class="flex min-h-0 flex-1 flex-col rounded-lg border bg-card p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-base font-medium">拆分数据</div>
              <div class="text-sm text-muted-foreground"></div>
            </div>
            <div class="text-sm text-muted-foreground">
              共 {{ splitRecords.length }} 条
            </div>
          </div>

          <SplitGrid>
            <template #splitPrdRef="{ row }">
              <span>{{ getSplitPrdRef(row) }}</span>
            </template>

            <template #splitQuantity="{ row }">
              <InputNumber
                :max="
                  (sourceRows.find((item) => item.__rowKey === row.sourceRowKey)
                    ?.__originQuantity ?? 1) - 1
                "
                :min="1"
                :value="row.quantity"
                class="w-full"
                @change="
                  (value) => updateSplitQuantity(row, value as number | null)
                "
              />
            </template>

            <template #splitMnORef="{ row }">
              <Input
                :value="row.splitMnORef"
                placeholder="请输入被拆分订单号"
                @blur="
                  updateSplitMnORef(
                    row,
                    ($event.target as HTMLInputElement)?.value,
                  )
                "
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
            {{ propsData.cnc }}
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
:deep(.dark .vxe-cell--checkbox) {
  color: white !important;
}
</style>
