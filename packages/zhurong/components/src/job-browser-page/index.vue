<script lang="ts" setup>
import type { JobBrowserTreeVO } from '@zhurong/api';
import type { TreeProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/vc-tree/interface';

import { computed, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  AimOutlined,
  CreditCardOutlined,
  DownOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  MinusSquareOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { requestGetJobBrowserTree } from '@zhurong/api';
import { Button, Col, Row, Spin, Tooltip, Tree } from 'ant-design-vue';

import JobBrowserSearchForm from './modules/form.vue';

// ========== props ==========
const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    selectFolder?: boolean;
  }>(),
  {
    multiple: false,
    selectFolder: false,
  },
);

const emit = defineEmits(['select']);

// ========== 状态 ==========
const treeData = ref<JobBrowserTreeVO[]>([]);
const rawTreeData = ref<JobBrowserTreeVO[]>([]);
const checkedKeys = ref<Key[]>([]);
const selectedKeys = ref<Key[]>([]);
const expandedKeys = ref<Key[]>([]);
const treeLoading = ref(false);
const browserTreeData = computed(
  () => treeData.value as unknown as TreeProps['treeData'],
);

// id -> node map（用于快速过滤）
const nodeMap = ref<Map<string, JobBrowserTreeVO>>(new Map());

const [JobBrowserSearchFormModal, jobBrowserSearchFormModalApi] = useVbenModal({
  connectedComponent: JobBrowserSearchForm,
  draggable: true,
  onClosed: async () => {
    try {
      treeLoading.value = true;
      const data = jobBrowserSearchFormModalApi.getData();
      const jobRefs = Array.isArray(data?.jobRefs) ? data.jobRefs : [];
      filterTreeByIds(jobRefs);
    } finally {
      treeLoading.value = false;
    }
  },
});

// ========== API（自行替换） ==========
async function fetchTree() {
  const data = await requestGetJobBrowserTree();
  rawTreeData.value = data || [];
  treeData.value = rawTreeData.value;
  buildNodeMap(rawTreeData.value);
}

// ========== 构建索引 ==========
function buildNodeMap(tree: JobBrowserTreeVO[]) {
  const map = new Map<string, JobBrowserTreeVO>();

  const dfs = (nodes: JobBrowserTreeVO[]) => {
    nodes.forEach((n) => {
      map.set(n.id, n);
      if (n.children) dfs(n.children);
    });
  };

  dfs(tree);
  nodeMap.value = map;
}

// ========== 树过滤（核心能力） ==========
function filterTreeByIds(ids: string[]) {
  if (ids.length === 0) {
    treeData.value = rawTreeData.value;
    return;
  }

  const keepSet = new Set<string>();

  // 向上递归保留父节点
  ids.forEach((id) => {
    let current = nodeMap.value.get(id);
    while (current) {
      keepSet.add(current.id);
      current = current.parentId
        ? nodeMap.value.get(current.parentId)
        : undefined;
    }
  });

  // 构建新树
  const build = (nodes: JobBrowserTreeVO[]): JobBrowserTreeVO[] => {
    return nodes
      .filter((n) => keepSet.has(n.id))
      .map((n) => ({
        ...n,
        children: n.children ? build(n.children) : undefined,
      }));
  };

  treeData.value = build(rawTreeData.value);
  expandedKeys.value = [...keepSet];
}

// ========== 树选择逻辑 ==========
function handleSelect(keys: Key[]) {
  selectedKeys.value = keys;
  emit('select', keys.map(String));
}

function handleCheck(keys: Key[] | { checked: Key[] }) {
  checkedKeys.value = Array.isArray(keys) ? keys : keys.checked;
}

// 是否允许选择
function isSelectable(node: JobBrowserTreeVO) {
  if (props.selectFolder) return true;
  return !node.isFolder;
}

// ========== Tree props ==========
const treeProps: TreeProps = {
  fieldNames: {
    title: 'label',
    key: 'id',
    children: 'children',
  },
};

function resetForm() {
  treeData.value = rawTreeData.value;
}

function collapseAll() {
  expandedKeys.value = [];
}

function expandSelected() {
  const keys = props.multiple ? checkedKeys.value : selectedKeys.value;

  const result = new Set<string>();

  const collectDescendantFolders = (node?: JobBrowserTreeVO) => {
    if (!node) return;

    // 只要这个节点有 children，就把它作为展开节点
    if (node.children && node.children.length > 0) {
      result.add(node.id);

      node.children.forEach((child) => {
        collectDescendantFolders(child);
      });
    }
  };

  keys.forEach((id) => {
    const node = nodeMap.value.get(String(id));
    if (!node) return;

    // 先把当前选中节点加入展开集合
    // 这样它下面的 children 才能显示出来
    result.add(node.id);

    // 再递归展开它下面所有有子节点的文件夹
    collectDescendantFolders(node);
  });

  expandedKeys.value = [...result];
}

function searchJobTree() {
  jobBrowserSearchFormModalApi.open();
}

onMounted(() => {
  fetchTree();
});
</script>

<template>
  <div class="job-browser-page">
    <JobBrowserSearchFormModal />
    <Row class="job-browser-layout">
      <!-- 左侧树 -->
      <Col :span="6" class="job-browser-aside">
        <section class="job-browser-tree-panel">
          <!-- 工具栏 -->
          <div class="job-browser-tree-toolbar">
            <Tooltip title="收起所有">
              <Button
                class="job-browser-toolbar-button"
                size="small"
                @click="collapseAll"
              >
                <template #icon>
                  <MinusSquareOutlined />
                </template>
              </Button>
            </Tooltip>
            <Tooltip title="展开已选择">
              <Button
                :disabled="selectedKeys.length === 0"
                class="job-browser-toolbar-button"
                size="small"
                @click="expandSelected"
              >
                <template #icon>
                  <AimOutlined />
                </template>
              </Button>
            </Tooltip>
            <Tooltip title="检索作业">
              <Button
                class="job-browser-toolbar-button"
                size="small"
                @click="searchJobTree"
              >
                <template #icon>
                  <SearchOutlined />
                </template>
              </Button>
            </Tooltip>
            <Tooltip title="重置作业">
              <Button
                class="job-browser-toolbar-button"
                size="small"
                @click="resetForm"
              >
                <template #icon>
                  <ReloadOutlined />
                </template>
              </Button>
            </Tooltip>
          </div>

          <div class="job-browser-tree-body">
            <Spin
              :spinning="treeLoading"
              wrapper-class-name="job-browser-spin-wrapper"
            >
              <Tree
                :block-node="true"
                :checkable="props.multiple"
                :checked-keys="checkedKeys"
                :expanded-keys="expandedKeys"
                :field-names="treeProps.fieldNames"
                :selected-keys="selectedKeys"
                :tree-data="browserTreeData"
                class="job-browser-tree"
                virtual
                show-icon
                @check="handleCheck"
                @expand="(keys) => (expandedKeys = keys)"
                @select="handleSelect"
              >
                <template #title="{ data }">
                  <span
                    :style="{
                      cursor: isSelectable(data) ? 'pointer' : 'not-allowed',
                      color: data.isFolder ? 'hsl(var(--primary))' : 'unset',
                    }"
                  >
                    {{ data.label }}
                  </span>
                </template>
                <template #icon="{ expanded, dataRef }">
                  <FolderOutlined
                    v-if="dataRef.isFolder && !expanded"
                    style="color: hsl(var(--primary))"
                  />
                  <FolderOpenOutlined
                    v-else-if="dataRef.isFolder && expanded"
                    style="color: hsl(var(--primary))"
                  />
                  <CreditCardOutlined v-else-if="!dataRef.isFolder" />
                </template>
                <template #switcherIcon="{ switcherCls, dataRef }">
                  <DownOutlined
                    :class="switcherCls"
                    :style="{
                      color: dataRef.isFolder ? 'hsl(var(--primary))' : 'unset',
                    }"
                  />
                </template>
              </Tree>
            </Spin>
          </div>
        </section>
      </Col>

      <!-- 右侧插槽 -->
      <Col :span="18" class="job-browser-content">
        <slot name="default"></slot>
      </Col>
    </Row>
  </div>
</template>

<style scoped>
.job-browser-page,
.job-browser-layout {
  height: 100%;
  min-height: 0;
}

.job-browser-aside,
.job-browser-content {
  height: 100%;
  min-height: 0;
}

.job-browser-aside {
  display: flex;
  box-sizing: border-box;
  padding: 8px 10px 8px 8px;
}

.job-browser-tree-panel {
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  flex-direction: column;
}

.job-browser-tree-toolbar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  height: 42px;
  padding: 6px 10px;
  gap: 6px;
  border-bottom: 1px solid hsl(var(--border));
}

.job-browser-toolbar-button {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: hsl(var(--muted-foreground));
}

.job-browser-tree-body {
  flex: 1;
  min-height: 0;
  padding: 8px 6px 10px;
  overflow: hidden;
}

.job-browser-tree {
  height: 100%;
  overflow: auto;
  background: transparent;
}

:deep(.job-browser-spin-wrapper),
:deep(.job-browser-spin-wrapper .ant-spin-container) {
  height: 100%;
  min-height: 0;
}

:deep(.job-browser-tree .ant-tree-list) {
  height: 100%;
}

:deep(.job-browser-tree .ant-tree-node-content-wrapper) {
  min-height: 28px;
  line-height: 28px;
}

.icon svg {
  fill: currentColor;
}
</style>
