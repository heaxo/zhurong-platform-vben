<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useVbenForm} from '#/adapter/form';
import type {TreeProps} from 'ant-design-vue';
import {Button, Spin, Tree, Tooltip,Row,Col, Space} from 'ant-design-vue';
import {
  type JobBrowserTreeVO,
  requestGetDisMmttMmtt00000100PageList,
  requestGetJobBrowserTree,
  requestGetJobRefs,
  requestGetWwccWwcc00000100PageList
} from "@zhurong/api";
import {isEmpty} from 'lodash-es';
import {FolderOpenOutlined, AimOutlined, MinusSquareOutlined, PlusSquareOutlined,} from '@ant-design/icons-vue';
import {$t} from '@vben/locales';

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

// ========== 状态 ==========
const treeData = ref<JobBrowserTreeVO[]>([]);
const rawTreeData = ref<JobBrowserTreeVO[]>([]);
const checkedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([]);
const treeLoading = ref(false);

// id -> node map（用于快速过滤）
const nodeMap = ref<Map<string, JobBrowserTreeVO>>(new Map());

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
  if (!ids.length) {
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
  expandedKeys.value = Array.from(keepSet);
}

// ========== 树选择逻辑 ==========
function handleSelect(keys: string[]) {
  selectedKeys.value = keys;
}

function handleCheck(keys: any) {
  checkedKeys.value = keys.checked || keys;
}

// 是否允许选择
function isSelectable(node: JobBrowserTreeVO) {
  if (props.selectFolder) return true;
  return !node.isFolder;
}

// ========== 表单（右侧查询） ==========
const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-2',
  schema: [
    {
      component: 'Input',
      fieldName: 'nestingRecID',
      label: '套料ID',
    },
    {
      component: 'Input',
      fieldName: 'cnc',
      label: 'CNC',
    },
    {
      component: 'Input',
      fieldName: 'jobName',
      label: '作业名称',
    },
    {
      component: 'Input',
      fieldName: 'mnORef',
      label: '工单号',
    },
    {
      component: 'Input',
      fieldName: 'ordRef',
      label: '订单号',
    },
  ],
  showDefaultActions: true,
  handleSubmit: onSearch,
  handleReset: resetForm,
  submitButtonOptions: {
    content: '搜索',
  }
});
const [OptionForm, optionFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-3',
  compact: true,
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        api: requestGetWwccWwcc00000100PageList,
        allowClear: true,
        labelField: 'wrkRef',
        valueField: 'wrkRef',
        resultField: 'items',
        showSearch: true,
        style: {
          width: '200px',
        }
      },
      fieldName: 'wrkRef',
      label: $t('lantek.wrkRef'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: requestGetDisMmttMmtt00000100PageList,
        allowClear: true,
        labelField: 'matRef',
        valueField: 'matRef',
        resultField: 'items',
        showSearch: true,
        style: {
          width: '200px',
        }
      },
      fieldName: 'matRef',
      label: $t('lantek.matRef'),
    },
  ],
  showDefaultActions: false,
});

// 模拟查询接口（返回 nodeId 列表）
async function onSearch(values: any) {
  try {
    treeLoading.value = true;
    const nodeIds = await requestGetJobRefs(values);
    filterTreeByIds(nodeIds);
  } finally {
    treeLoading.value = false;
  }
}


// ========== 获取选中结果 ==========
function getSelectedNodes(): JobBrowserTreeVO[] {
  const keys = props.multiple ? checkedKeys.value : selectedKeys.value;

  return keys
    .map((k) => nodeMap.value.get(k))
    .filter((n): n is JobBrowserTreeVO => {
      if (!n) return false;
      return isSelectable(n);
    });
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
  formApi.resetForm();
}

function collapseAll() {
  expandedKeys.value = [];
}

function expandAll() {
  expandedKeys.value = Array.from(nodeMap.value.keys());
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
    const node = nodeMap.value.get(id);
    if (!node) return;

    // 先把当前选中节点加入展开集合
    // 这样它下面的 children 才能显示出来
    result.add(node.id);

    // 再递归展开它下面所有有子节点的文件夹
    collectDescendantFolders(node);
  });

  expandedKeys.value = Array.from(result);
}

onMounted(() => {
  fetchTree();
});
</script>

<template>
  <Row>
    <!-- 左侧树 -->
    <Col :span="6">

      <!-- 工具栏 -->
      <Space class="ml-2 mt-2">
        <Tooltip title="展开所有">
          <Button size="small" @click="expandAll">
            <template #icon>
              <PlusSquareOutlined/>
            </template>
          </Button>
        </Tooltip>
        <Tooltip title="收起所有">
          <Button size="small" @click="collapseAll">
            <template #icon>
              <MinusSquareOutlined/>
            </template>
          </Button>
        </Tooltip>
        <Tooltip title="展开已选择">
          <Button
            :disabled="isEmpty(selectedKeys)"
            size="small"
            @click="expandSelected"
          >
            <template #icon>
              <AimOutlined />
            </template>
          </Button>
        </Tooltip>
      </Space>
      <Spin :spinning="treeLoading" wrapperClassName="h-full">
        <Tree
          :block-node="true"
          :checkable="props.multiple"
          :checked-keys="checkedKeys"
          :expanded-keys="expandedKeys"
          :field-names="treeProps.fieldNames"
          :selected-keys="selectedKeys"
          :tree-data="treeData"
          virtual
          @check="handleCheck"
          @expand="(keys) => expandedKeys = keys"
          @select="handleSelect"
          class="m-2"
          style="height: 100%;"
        >
          <template #title="{ data }">
            <span
              :style="{
                cursor: isSelectable(data) ? 'pointer' : 'not-allowed',
              }"
            >
              {{ data.label }}
            </span>
          </template>
        </Tree>
      </Spin>
    </Col>

    <!-- 右侧插槽 -->
    <Col :span="18">
      <slot name="default"></slot>
    </Col>
  </Row>
</template>

<style scoped>
::v-deep(.ant-tree){
  height: calc(100% - 50px);
}
::v-deep(.ant-spin-container){
  height: 100%;
}
</style>
