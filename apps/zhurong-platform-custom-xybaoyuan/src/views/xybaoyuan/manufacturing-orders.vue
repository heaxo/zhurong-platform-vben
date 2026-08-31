<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { JobBrowserTreeNode } from '#/api/lantek/job-selection';
import type { ManufacturingOrder } from '#/api/xybaoyuan';

import { computed, ref, shallowRef } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import {
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from '@ant-design/icons-vue';
import {
  Button,
  Empty,
  message,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Tree,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getJobBrowserTree,
  pageMachineTools,
} from '#/api/lantek/job-selection';
import {
  createJob,
  exportOrders,
  importOrders,
  pageOrders,
  updateOrders,
} from '#/api/xybaoyuan';

type JobMode = 'create' | 'existing';
interface JobTreeNode extends JobBrowserTreeNode {
  children?: JobTreeNode[];
  key: string;
  path: string;
  title: string;
}

const selectedRows = ref<ManufacturingOrder[]>([]);
const actionLoading = ref(false);
const rawJobTree = shallowRef<JobTreeNode[]>([]);
const jobTree = shallowRef<JobTreeNode[]>([]);
const jobNodeMap = shallowRef(new Map<string, JobTreeNode>());
const selectedJobKeys = ref<string[]>([]);
const expandedJobKeys = ref<string[]>([]);
const jobTreeLoading = ref(false);
const selectedJobNode = computed(() =>
  jobNodeMap.value.get(selectedJobKeys.value[0] ?? ''),
);

const searchSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'productionOrderNumber',
    label: '生产订单号',
  },
  {
    component: 'Input',
    fieldName: 'productionOrderErpInternalCode',
    label: 'ERP内码',
  },
  { component: 'Input', fieldName: 'productionWorkshopName', label: '车间' },
  { component: 'Select', fieldName: 'sendState', label: '状态',defaultValue: false,componentProps:{
    options:[{
      label:"全部",
      value: null,
    },{
      label:"未导入",
      value: false,
    },{
      label:"已导入",
      value: true,
    },]
    } },
  { component: 'Input', fieldName: 'drawingCode', label: '图号' },
  { component: 'Input', fieldName: 'matRef', label: '材质' },
];

const machineSchema: VbenFormSchema[] = [
  {
    component: 'ApiSelect',
    componentProps: {
      allowClear: true,
      api: pageMachineTools,
      class: 'w-full',
      filterOption(input: string, option: any) {
        return String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase());
      },
      labelField: 'wrkRef',
      params: { page: 1, pageSize: -1 },
      resultField: 'items',
      showSearch: true,
      valueField: 'wrkRef',
    },
    fieldName: 'wrkRef',
    label: '切割设备',
    rules: 'selectRequired',
  },
];

const jobSearchSchema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'jobName', label: '作业名称' },
  { component: 'Input', fieldName: 'jobRef', label: '作业编码' },
];

const jobOptionSchema: VbenFormSchema[] = [
  {
    component: 'RadioGroup',
    componentProps: { options: jobModeOptions(false) },
    defaultValue: 'existing',
    fieldName: 'mode',
    label: '设置方式',
  },
  {
    component: 'Input',
    dependencies: {
      required: (values) => values.mode === 'create',
      show: (values) => values.mode === 'create',
      triggerFields: ['mode'],
    },
    fieldName: 'newJobName',
    label: '新作业名称',
  },
];

const [MachineForm, machineFormApi] = useVbenForm({
  schema: machineSchema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [JobSearchForm, jobSearchFormApi] = useVbenForm({
  actionLayout: 'rowEnd',
  handleReset: resetJobSearch,
  handleSubmit: filterJobTree,
  schema: jobSearchSchema,
  showDefaultActions: true,
  submitButtonOptions: { content: '搜索' },
  wrapperClass: 'grid-cols-3',
});

const [JobOptionForm, jobOptionFormApi] = useVbenForm({
  schema: jobOptionSchema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const [MachineModal, machineModalApi] = useVbenModal({
  class: 'w-[560px]',
  draggable: true,
  fullscreenButton: false,
  async onConfirm() {
    const { valid } = await machineFormApi.validate();
    if (!valid) return;
    const values = await machineFormApi.getValues();
    machineModalApi.lock();
    try {
      await updateOrders(
        selectedRows.value.map((row) => ({
          id: row.id,
          wrkRef: values.wrkRef,
        })),
      );
      message.success('设备已更新');
      await machineModalApi.close();
      await refreshGrid();
    } finally {
      machineModalApi.unlock();
    }
  },
  async onOpenChange(open) {
    if (!open) return;
    const wrkRefs = [
      ...new Set(selectedRows.value.map((row) => row.wrkRef).filter(Boolean)),
    ];
    await machineFormApi.resetForm();
    if (wrkRefs.length === 1) {
      await machineFormApi.setValues({ wrkRef: wrkRefs[0] });
    }
  },
  title: '批量设置设备',
});

const [JobModal, jobModalApi] = useVbenModal({
  class: 'w-[920px]',
  contentClass: '!overflow-hidden',
  async onConfirm() {
    const values = await jobOptionFormApi.getValues();
    const mode = values.mode as JobMode;
    const node = selectedJobNode.value;
    let jobName: string;
    let jobRef: string;

    jobModalApi.lock();
    try {
      if (mode === 'create') {
        if (!node?.isFolder) {
          return void message.warning('请先选择新作业所在的文件夹');
        }
        jobName = String(values.newJobName ?? '').trim();
        if (!jobName) return void message.warning('新作业名称不能为空');
        if (hasJobWithName(node, jobName)) {
          return void message.warning(`当前目录已存在作业“${jobName}”`);
        }
        jobRef = await createJob(jobName, node.path);
      } else {
        if (!node || node.isFolder) {
          return void message.warning('请选择一个已有作业');
        }
        jobName = node.label;
        jobRef = node.id;
      }

      await updateOrders(
        selectedRows.value.map((row) => ({ id: row.id, jobName, jobRef })),
      );
      message.success(
        mode === 'create' ? `作业 ${jobRef} 创建并设置成功` : '作业已设置',
      );
      await jobModalApi.close();
      await refreshGrid();
    } finally {
      jobModalApi.unlock();
    }
  },
  async onOpenChange(open) {
    if (!open) return;
    selectedJobKeys.value = [];
    await jobSearchFormApi.resetForm();
    await jobOptionFormApi.resetForm();
    await setJobModeAvailability(false, 'existing');
    await loadJobTree();

    const jobRefs = [
      ...new Set(selectedRows.value.map((row) => row.jobRef).filter(Boolean)),
    ] as string[];
    const existingJobRef = jobRefs.at(0);
    if (
      jobRefs.length === 1 &&
      existingJobRef &&
      jobNodeMap.value.has(existingJobRef)
    ) {
      selectedJobKeys.value = [existingJobRef];
    }
  },
  title: '设置作业',
});

const gridOptions: VxeTableGridOptions<ManufacturingOrder> = {
  checkboxConfig: { highlight: true, range: true },
  columns: [
    { type: 'checkbox', width: 48 },
    { field: 'productionOrderNumber', minWidth: 170, title: '生产订单号' },
    {
      field: 'productionOrderErpInternalCode',
      minWidth: 130,
      title: 'ERP内码',
    },
    { field: 'productionWorkshopName', minWidth: 100, title: '生产车间' },
    { field: 'prdRef', minWidth: 150, title: '零件编号' },
    { field: 'prdName', minWidth: 160, title: '零件名称' },
    { field: 'drawingCode', minWidth: 160, title: '图号' },
    { field: 'matRef', minWidth: 90, title: '材质' },
    { field: 'thickness', title: '厚度', width: 65 },
    { field: 'quantity', title: '数量', width: 65 },
    { field: 'cusRef', minWidth: 160, title: '计划跟踪号' },
    { field: 'wrkRef', minWidth: 110, title: '设备' },
    { field: 'jobName', minWidth: 150, title: '作业' },
    {
      field: 'task',
      minWidth: 220,
      slots: { default: 'task' },
      title: '最近导入结果',
    },
    {
      field: 'partMaintenance',
      slots: { default: 'partMaintenance' },
      title: '零件档案',
      fixed: 'right',
      width: 80,
    },
    {
      field: 'sendState',
      slots: { default: 'sendState' },
      title: '导入状态',
      fixed: 'right',
      width: 80,
    },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      async query({ page }, formValues) {
        const result = await pageOrders({
          ...formValues,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return { ...result, total: Number(result.total) };
      },
    },
  },
  rowConfig: { keyField: 'id' },
  toolbarConfig: {
    custom: true,
    refresh: { code: 'query' },
    search: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid<ManufacturingOrder>({
  formOptions: {
    wrapperClass:'grid-cols-4',
    collapsed: true,
    schema: searchSchema,
    submitOnChange: false,
  },
  gridEvents: {
    checkboxAll: handleSelectionChange,
    checkboxChange: handleSelectionChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions,
});

function handleSelectionChange({ records }: { records: ManufacturingOrder[] }) {
  selectedRows.value = records;
}

function jobModeOptions(canCreate: boolean) {
  return [
    { label: '选择已有作业', value: 'existing' },
    {
      disabled: !canCreate,
      label: canCreate
        ? '在选中文件夹中新建作业'
        : '新建作业（请先选择文件夹）',
      value: 'create',
    },
  ];
}

function hasJobWithName(folder: JobTreeNode, jobName: string) {
  const normalizedName = jobName.trim().toLocaleLowerCase();
  return (folder.children ?? []).some(
    (child) =>
      !child.isFolder &&
      child.label.trim().toLocaleLowerCase() === normalizedName,
  );
}

async function setJobModeAvailability(canCreate: boolean, mode: JobMode) {
  await jobOptionFormApi.updateSchema([
    {
      componentProps: { options: jobModeOptions(canCreate) },
      fieldName: 'mode',
    },
  ]);
  await jobOptionFormApi.setValues({ mode });
}

function indexJobNodes(nodes: JobTreeNode[]) {
  const map = new Map<string, JobTreeNode>();
  const visit = (items: JobTreeNode[]) =>
    items.forEach((item) => {
      map.set(item.key, item);
      if (item.children?.length) visit(item.children);
    });
  visit(nodes);
  jobNodeMap.value = map;
}

function collectFolderKeys(nodes: JobTreeNode[], result: string[] = []) {
  nodes.forEach((node) => {
    if (node.isFolder && node.children?.length) {
      result.push(node.key);
      collectFolderKeys(node.children, result);
    }
  });
  return result;
}

async function loadJobTree() {
  jobTreeLoading.value = true;
  try {
    const data = await getJobBrowserTree();
    const normalize = (
      nodes: JobBrowserTreeNode[],
      parentPath = '',
    ): JobTreeNode[] =>
      nodes.map((node) => {
        const path = node.isFolder
          ? `${parentPath}\\${node.label}`
          : parentPath;
        return {
          ...node,
          children: normalize(node.children ?? [], path),
          key: String(node.id),
          path,
          title: node.label,
        };
      });
    rawJobTree.value = normalize(Array.isArray(data) ? data : []);
    jobTree.value = rawJobTree.value;
    indexJobNodes(rawJobTree.value);
    expandedJobKeys.value = [];
  } finally {
    jobTreeLoading.value = false;
  }
}

function filterJobTree(values: Record<string, any>) {
  const name = String(values.jobName ?? '')
    .trim()
    .toLowerCase();
  const ref = String(values.jobRef ?? '')
    .trim()
    .toLowerCase();
  if (!name && !ref) {
    jobTree.value = rawJobTree.value;
    expandedJobKeys.value = [];
    return;
  }
  const filter = (nodes: JobTreeNode[]): JobTreeNode[] =>
    nodes.flatMap((node) => {
      const children = filter(node.children ?? []);
      const matches =
        !node.isFolder &&
        (!name || node.label.toLowerCase().includes(name)) &&
        (!ref || node.id.toLowerCase().includes(ref));
      return matches || children.length > 0 ? [{ ...node, children }] : [];
    });
  jobTree.value = filter(rawJobTree.value);
  expandedJobKeys.value = collectFolderKeys(jobTree.value);
  selectedJobKeys.value = [];
  void setJobModeAvailability(false, 'existing');
}

async function resetJobSearch() {
  jobTree.value = rawJobTree.value;
  expandedJobKeys.value = [];
  selectedJobKeys.value = [];
  await setJobModeAvailability(false, 'existing');
}

async function onJobTreeSelect(keys: Array<number | string>) {
  selectedJobKeys.value = keys.map(String);
  const node = selectedJobNode.value;
  await setJobModeAvailability(
    Boolean(node?.isFolder),
    node?.isFolder ? 'create' : 'existing',
  );
}

async function refreshGrid() {
  selectedRows.value = [];
  await gridApi.grid.clearCheckboxRow();
  await gridApi.query();
}

async function invalidate() {
  await updateOrders(
    selectedRows.value.map((row) => ({ id: row.id, invalidState: true })),
  );
  message.success('已作废');
  await refreshGrid();
}

async function importSelected() {
  if (selectedRows.value.length === 0) return message.warning('请选择生产订单');
  const missingJobs = selectedRows.value.filter(
    (row) => !String(row.jobRef ?? '').trim(),
  );
  const missingMachines = selectedRows.value.filter(
    (row) => !String(row.wrkRef ?? '').trim(),
  );
  const errors: string[] = [];
  if (missingJobs.length > 0) {
    errors.push(`未设置作业：${formatOrderNames(missingJobs)}`);
  }
  if (missingMachines.length > 0) {
    errors.push(`未设置设备：${formatOrderNames(missingMachines)}`);
  }
  if (errors.length > 0) return message.warning(errors.join('；'));
  actionLoading.value = true;
  try {
    const result = await importOrders(selectedRows.value.map((row) => row.id));
    if (result.status === 'SUCCESS') {
      message.success(result.message || '导入成功');
    } else {
      message.error(result.message || '导入失败');
    }
    await refreshGrid();
  } finally {
    actionLoading.value = false;
  }
}

function formatOrderNames(orders: ManufacturingOrder[]) {
  const names = orders
    .slice(0, 5)
    .map(
      (order) =>
        order.productionOrderNumber || order.productionOrderErpInternalCode,
    );
  return `${names.join('、')}${orders.length > names.length ? `等${orders.length}条` : ''}`;
}

async function exportData() {
  await exportOrders(await gridApi.formApi.getValues());
}
</script>

<template>
  <Page auto-content-height content-class="!overflow-hidden">
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button
            :disabled="selectedRows.length === 0"
            @click="machineModalApi.open()"
          >
            设置设备
          </Button>
          <Button
            :disabled="selectedRows.length === 0"
            @click="jobModalApi.open()"
          >
            设置作业
          </Button>
          <Button
            type="primary"
            :disabled="selectedRows.length === 0"
            :loading="actionLoading"
            @click="importSelected"
          >
            导入到套料软件
          </Button>
          <Popconfirm title="确认作废所选生产订单？" @confirm="invalidate">
            <Button danger :disabled="selectedRows.length === 0">作废</Button>
          </Popconfirm>
          <Button @click="exportData">导出 CSV</Button>
          <!-- prettier-ignore -->
          <span class="text-muted-foreground">已选 {{ selectedRows.length }} 条</span>
        </Space>
      </template>
      <template #partMaintenance="{ row }">
        <Tag :color="row.partMaintenance ? 'green' : 'red'">
          {{ row.partMaintenance ? '已维护' : '未维护' }}
        </Tag>
      </template>
      <template #sendState="{ row }">
        <Tag :color="row.sendState ? 'green' : 'default'">
          {{ row.sendState ? '已导入' : '未导入' }}
        </Tag>
      </template>
      <template #task="{ row }">
        <Tag
          v-if="row.task"
          :color="row.task.status === 'SUCCESS' ? 'green' : 'red'"
        >
          {{ row.task.status === 'SUCCESS' ? '成功' : '失败' }}
        </Tag>
        <span class="ml-1">{{ row.task?.message }}</span>
      </template>
    </Grid>

    <MachineModal><MachineForm /></MachineModal>
    <JobModal>
      <div class="job-selector">
        <JobSearchForm />
        <section class="job-tree-panel">
          <Spin :spinning="jobTreeLoading">
            <Tree
              v-if="jobTree.length > 0"
              v-model:expanded-keys="expandedJobKeys"
              v-model:selected-keys="selectedJobKeys"
              block-node
              :show-line="{ showLeafIcon: false }"
              :tree-data="jobTree"
              show-icon
              virtual
              @select="onJobTreeSelect"
            >
              <template #icon="{ expanded, dataRef }">
                <FolderOpenOutlined v-if="dataRef.isFolder && expanded" />
                <FolderOutlined v-else-if="dataRef.isFolder" />
                <FileTextOutlined v-else />
              </template>
              <template #title="{ dataRef }">
                <span :class="{ 'font-medium': !dataRef.isFolder }">
                  {{ dataRef.label }}
                </span>
                <span
                  v-if="!dataRef.isFolder"
                  class="ml-2 text-xs text-gray-400"
                >
                  {{ dataRef.id }}
                </span>
              </template>
            </Tree>
            <Empty v-else description="暂无匹配作业" />
          </Spin>
        </section>
        <div class="text-sm text-muted-foreground">
          <template v-if="selectedJobNode?.isFolder">
            新作业目录：{{ selectedJobNode.path }}
          </template>
          <template v-else-if="selectedJobNode">
            已选作业：{{ selectedJobNode.label }}（{{ selectedJobNode.id }}）
          </template>
          <template v-else>请选择已有作业，或选择文件夹后新建作业。</template>
        </div>
        <JobOptionForm />
      </div>
    </JobModal>
  </Page>
</template>

<style scoped>
.job-selector {
  display: grid;
  height: min(62vh, 600px);
  gap: 12px;
  grid-template-rows: auto minmax(0, 1fr) auto auto;
  overflow: hidden;
}

.job-tree-panel {
  min-height: 0;
  padding: 12px;
  overflow-y: auto;
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
}
</style>
