<script lang="ts" setup>
import {ref,toRaw} from 'vue';
import {useVbenModal} from '@vben/common-ui';
import {useVbenForm} from '#/adapter/form';
import type {TreeProps} from 'ant-design-vue';
import {Button, message, Tree,Spin} from 'ant-design-vue';
import type {JobBrowserTreeVO} from "@zhurong/api";
import {requestGetJobBrowserTree,requestGetJobRefs} from "@zhurong/api";
import {isEmpty} from 'lodash-es';
import {
  FolderOpenOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons-vue';

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
  wrapperClass:'grid-cols-2',
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
  handleReset:  resetForm,
  submitButtonOptions:{
    content:'搜索',
  }
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

// ========== Modal ==========
const [Modal, modalApi] = useVbenModal({
  title: '作业浏览器',
  fullscreenButton: true,
  onOpenChange(isOpen) {
    if (isOpen) {
      fetchTree();
    }
  },
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const result = getSelectedNodes();

    if (!result.length) {
      message.warning('请选择数据');
      return;
    }

    modalApi.close();
    modalApi.setData({selected: result.map((item) => toRaw(item))});
  },
});

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
</script>

<template>
  <Modal class="w-[1000px]">
    <div class="flex h-[500px] gap-4">
      <!-- 左侧树 -->
      <div class="flex-[1] border rounded p-2 overflow-auto">
        <!-- 工具栏 -->
        <div class="mb-2 flex gap-2">
          <Button
            size="small"
            @click="expandSelected"
            :disabled="isEmpty(selectedKeys)"
          >
            <template #icon>
              <FolderOpenOutlined />
            </template>
            展开选中
          </Button>

          <Button size="small" @click="expandAll">
            <template #icon>
              <PlusSquareOutlined />
            </template>
            展开全部
          </Button>

          <Button size="small" @click="collapseAll">
            <template #icon>
              <MinusSquareOutlined />
            </template>
            收起全部
          </Button>
        </div>

        <Spin :spinning="treeLoading">
          <Tree
            virtual
            :block-node="true"
            :checkable="props.multiple"
            :checked-keys="checkedKeys"
            :field-names="treeProps.fieldNames"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            :expanded-keys="expandedKeys"
            @expand="(keys) => expandedKeys = keys"
            @check="handleCheck"
            @select="handleSelect"
          >
            <template #title="{ data }">
            <span
              :style="{
                color: data.isFolder ? '#999' : '#000',
                cursor: isSelectable(data) ? 'pointer' : 'not-allowed',
              }"
            >
              {{ data.label }}
            </span>
            </template>
          </Tree>
        </Spin>
      </div>

      <!-- 右侧查询 -->
      <div class="flex-[2] border rounded p-2">
        <Form/>
      </div>
    </div>
  </Modal>
</template>
