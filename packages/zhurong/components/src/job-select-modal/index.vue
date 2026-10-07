<script setup lang="ts">
import type { JobBrowserTreeNode } from '@zhurong/api';
import type {
  CreateJobFn,
  JobSelectMode,
  JobSelectOpenOptions,
  JobSelectResult,
  JobSelectTreeNode,
} from './types';
import type { VbenFormSchema } from '#/adapter/form';

import { computed, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from '@ant-design/icons-vue';
import { Empty, message, Spin, Tree } from 'ant-design-vue';
import { getJobBrowserTree } from '@zhurong/api';

import { useVbenForm } from '#/adapter/form';

const props = withDefaults(
  defineProps<{
    allowCreate?: boolean;
    createJob?: CreateJobFn;
    title?: string;
  }>(),
  {
    allowCreate: true,
    title: '设置作业',
  },
);

const emit = defineEmits<{
  confirm: [payload: JobSelectResult];
}>();

const pendingJobRefs = ref<string[]>([]);
const rawJobTree = shallowRef<JobSelectTreeNode[]>([]);
const jobTree = shallowRef<JobSelectTreeNode[]>([]);
const jobNodeMap = shallowRef(new Map<string, JobSelectTreeNode>());
const selectedJobKeys = ref<string[]>([]);
const expandedJobKeys = ref<string[]>([]);
const jobTreeLoading = ref(false);
const selectedJobNode = computed(() =>
  jobNodeMap.value.get(selectedJobKeys.value[0] ?? ''),
);

const jobSearchSchema: VbenFormSchema[] = [
  { component: 'Input', fieldName: 'jobName', label: '作业名称' },
  { component: 'Input', fieldName: 'jobRef', label: '作业编码' },
];

const jobOptionSchema: VbenFormSchema[] = props.allowCreate
  ? [
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
    ]
  : [];

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

const [JobModal, jobModalApi] = useVbenModal({
  class: 'w-[920px]',
  contentClass: '!overflow-hidden',
  async onConfirm() {
    const values = await jobOptionFormApi.getValues();
    const mode = (values.mode ?? 'existing') as JobSelectMode;
    const node = selectedJobNode.value;

    jobModalApi.lock();
    try {
      if (mode === 'create') {
        const jobName = String(values.newJobName ?? '').trim();
        if (!jobName) return void message.warning('新作业名称不能为空');
        if (node?.isFolder && hasJobWithName(node, jobName)) {
          return void message.warning(`当前目录已存在作业“${jobName}”`);
        }
        const jobPath = node?.isFolder ? node.path : '';
        const jobRef = props.createJob
          ? await props.createJob(jobName, jobPath)
          : undefined;
        emit('confirm', { jobName, jobPath, jobRef, mode, node });
        await jobModalApi.close();
        return;
      }

      if (!node || node.isFolder) {
        return void message.warning('请选择一个已有作业');
      }
      const jobName = node.label;
      const jobRef = node.id;
      emit('confirm', { jobName, jobRef, mode, node });
      await jobModalApi.close();
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

    const existingJobRef = pendingJobRefs.value.at(0);
    if (
      pendingJobRefs.value.length === 1 &&
      existingJobRef &&
      jobNodeMap.value.has(existingJobRef)
    ) {
      selectedJobKeys.value = [existingJobRef];
    }
  },
  title: props.title,
});

function open(options: JobSelectOpenOptions = {}) {
  pendingJobRefs.value = [
    ...new Set(
      (options.jobRefs ?? []).map((item) => item?.trim()).filter(Boolean),
    ),
  ] as string[];
  jobModalApi.open();
}

async function close() {
  await jobModalApi.close();
}

defineExpose({ close, open });

function jobModeOptions(canCreate: boolean) {
  const options: Array<{
    disabled?: boolean;
    label: string;
    value: JobSelectMode;
  }> = [{ label: '选择已有作业', value: 'existing' }];
  if (props.allowCreate) {
    options.push({
      label: canCreate ? '在选中文件夹中新建作业' : '新建作业',
      value: 'create',
    });
  }
  return options;
}

async function setJobModeAvailability(canCreate: boolean, mode: JobSelectMode) {
  if (props.allowCreate) {
    await jobOptionFormApi.updateSchema([
      {
        componentProps: { options: jobModeOptions(canCreate) },
        fieldName: 'mode',
      },
    ]);
    await jobOptionFormApi.setValues({ mode });
  }
}

function indexJobNodes(nodes: JobSelectTreeNode[]) {
  const map = new Map<string, JobSelectTreeNode>();
  const visit = (items: JobSelectTreeNode[]) =>
    items.forEach((item) => {
      map.set(item.key, item);
      if (item.children?.length) visit(item.children);
    });
  visit(nodes);
  jobNodeMap.value = map;
}

function normalizeJobTree(
  nodes: JobBrowserTreeNode[],
  parentPath = '',
): JobSelectTreeNode[] {
  return nodes.map((node) => {
    const path = node.isFolder ? `${parentPath}\\${node.label}` : parentPath;
    return {
      ...node,
      children: normalizeJobTree(node.children ?? [], path),
      key: String(node.id),
      path,
      title: node.label,
    };
  });
}

async function loadJobTree() {
  jobTreeLoading.value = true;
  try {
    const data = await getJobBrowserTree();
    rawJobTree.value = normalizeJobTree(Array.isArray(data) ? data : []);
    jobTree.value = rawJobTree.value;
    indexJobNodes(rawJobTree.value);
    expandedJobKeys.value = [];
  } finally {
    jobTreeLoading.value = false;
  }
}

function collectFolderKeys(nodes: JobSelectTreeNode[], result: string[] = []) {
  nodes.forEach((node) => {
    if (node.isFolder && node.children?.length) {
      result.push(node.key);
      collectFolderKeys(node.children, result);
    }
  });
  return result;
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
  const filter = (nodes: JobSelectTreeNode[]): JobSelectTreeNode[] =>
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
    Boolean(props.allowCreate && node?.isFolder),
    props.allowCreate && node?.isFolder ? 'create' : 'existing',
  );
}

function hasJobWithName(folder: JobSelectTreeNode, jobName: string) {
  const normalizedName = jobName.trim().toLocaleLowerCase();
  return (folder.children ?? []).some(
    (child) =>
      !child.isFolder &&
      child.label.trim().toLocaleLowerCase() === normalizedName,
  );
}
</script>

<template>
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
              <span v-if="!dataRef.isFolder" class="ml-2 text-xs text-gray-400">
                {{ dataRef.id }}
              </span>
            </template>
          </Tree>
          <Empty v-else description="暂无匹配作业" />
        </Spin>
      </section>
      <div class="text-muted-foreground text-sm">
        <template v-if="selectedJobNode?.isFolder">
          {{
            props.allowCreate
              ? `新作业目录：${selectedJobNode.path}`
              : `已选择文件夹：${selectedJobNode.path}`
          }}
        </template>
        <template v-else-if="selectedJobNode">
          已选择作业：{{ selectedJobNode.label }}（{{ selectedJobNode.id }}）
        </template>
        <template v-else>
          {{
            props.allowCreate
              ? '请选择已有作业，或直接新建作业；选择文件夹后会带入作业路径。'
              : '请选择已有作业。'
          }}
        </template>
      </div>
      <JobOptionForm />
    </div>
  </JobModal>
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
