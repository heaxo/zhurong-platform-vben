<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  ScjinggongInventoryDirectImportDTO,
  ScjinggongInventoryDirectRow,
  U8InventoryResponse,
} from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { CloudDownloadOutlined, ExportOutlined } from '@ant-design/icons-vue';
import { Button, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  requestGetScjinggongInventoryDirectPage,
  requestImportScjinggongInventoryDirectToExpert,
  requestLoadScjinggongInventoryDirectFromU8,
} from '#/api';

import { useColumns, useGridFormSchema } from './data';

const ALLOWED_WAREHOUSE_CODES = new Set([
  '101',
  '102',
  '301',
  '310',
  '320',
  'A1001',
]);

const EMPTY_U8_DATA: U8InventoryResponse = {
  itemid: undefined,
  autoId: undefined,
  cWhCode: undefined,
  cInvCode: undefined,
  iQuantity: undefined,
  iSoType: undefined,
  isodid: undefined,
  enumname: undefined,
  csocode: undefined,
  isoseq: undefined,
  cdemandmemo: undefined,
};

const selectedRows = ref<ScjinggongInventoryDirectRow[]>([]);
const loadU8Loading = ref(false);
const importLoading = ref(false);

function normalizeCode(value?: string) {
  return String(value ?? '')
    .trim()
    .toUpperCase();
}

function handleSelectionChange({
  records,
}: {
  records: ScjinggongInventoryDirectRow[];
}) {
  selectedRows.value = records;
}

const [Grid, gridApi] = useVbenVxeGrid<ScjinggongInventoryDirectRow>({
  formOptions: {
    collapsed: true,
    schema: useGridFormSchema(),
    submitOnChange: false,
    wrapperClass: 'grid-cols-4',
  },
  gridEvents: {
    checkboxAll: handleSelectionChange,
    checkboxChange: handleSelectionChange,
    checkboxRangeEnd: handleSelectionChange,
  },
  gridOptions: {
    checkboxConfig: {
      range: true,
    },
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      pageSize: 50,
      pageSizes: [50, 100, 150, 200],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          selectedRows.value = [];
          return requestGetScjinggongInventoryDirectPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'invCode',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
    virtualYConfig: {
      enabled: true,
      gt: 50,
    },
  } as VxeTableGridOptions<ScjinggongInventoryDirectRow>,
});

function getCurrentPageRows() {
  return (gridApi.grid.getTableData().fullData ??
    []) as ScjinggongInventoryDirectRow[];
}

/** 使用当前页全部物料编码加载U8数据，并按物料编码回填对应行。 */
async function loadInventoryFromU8() {
  const rows = getCurrentPageRows();
  const inventoryCodes = rows
    .map((row) => String(row.invCode ?? '').trim())
    .filter(Boolean);
  if (inventoryCodes.length === 0) {
    return message.warning('当前页没有可加载的物料数据');
  }

  loadU8Loading.value = true;
  try {
    const inventoryList =
      await requestLoadScjinggongInventoryDirectFromU8(inventoryCodes);
    const inventoryMap = new Map(
      inventoryList.map((inventory) => [
        normalizeCode(inventory.cInvCode),
        inventory,
      ]),
    );

    let matchedCount = 0;
    rows.forEach((row) => {
      // 重新加载时先清除旧U8值，避免未匹配物料残留上一次结果。
      Object.assign(row, EMPTY_U8_DATA);
      const inventory = inventoryMap.get(normalizeCode(row.invCode));
      if (inventory) {
        Object.assign(row, inventory);
        matchedCount += 1;
      }
    });
    await gridApi.grid.updateData();

    const missingCount = rows.length - matchedCount;
    if (missingCount > 0) {
      message.warning(
        `U8库存加载完成，匹配 ${matchedCount} 条，未匹配 ${missingCount} 条`,
      );
    } else {
      message.success(`U8库存加载完成，共 ${matchedCount} 条`);
    }
  } finally {
    loadU8Loading.value = false;
  }
}

function toImportDTO(
  row: ScjinggongInventoryDirectRow,
): ScjinggongInventoryDirectImportDTO {
  // 显式选择业务字段，避免把表格内部状态提交到后端。
  return {
    invClassCode: row.invClassCode,
    invClassName: row.invClassName,
    invCode: row.invCode,
    invName: row.invName,
    invSize: row.invSize,
    invMaterialCode: row.invMaterialCode,
    invDensity: row.invDensity,
    invLong: row.invLong,
    invThick: row.invThick,
    invWide: row.invWide,
    itemid: row.itemid,
    autoId: row.autoId,
    cWhCode: row.cWhCode,
    cInvCode: row.cInvCode,
    iQuantity: row.iQuantity,
    iSoType: row.iSoType,
    isodid: row.isodid,
    enumname: row.enumname,
    csocode: row.csocode,
    isoseq: row.isoseq,
    cdemandmemo: row.cdemandmemo,
  };
}

/** 前端先拦截未加载库存或仓库不在白名单内的数据，后端会再次校验。 */
async function importToExpert() {
  if (selectedRows.value.length === 0) {
    return message.warning('请选择需要导入的钢板库存');
  }

  const missingU8Rows = selectedRows.value.filter(
    (row) =>
      !row.cWhCode || row.iQuantity === undefined || row.iQuantity === null,
  );
  if (missingU8Rows.length > 0) {
    return message.error(
      `请先从U8加载库存：${missingU8Rows
        .map((row) => row.invCode || '<空物料编码>')
        .join('、')}`,
    );
  }

  const invalidWarehouseRows = selectedRows.value.filter(
    (row) => !ALLOWED_WAREHOUSE_CODES.has(normalizeCode(row.cWhCode)),
  );
  if (invalidWarehouseRows.length > 0) {
    return message.error(
      `板材数据不在规定的仓库范围内：${invalidWarehouseRows
        .map((row) => `${row.invCode}(${row.cWhCode})`)
        .join('、')}`,
    );
  }

  importLoading.value = true;
  try {
    const result = await requestImportScjinggongInventoryDirectToExpert(
      selectedRows.value.map((row) => toImportDTO(row)),
    );
    if (result) {
      message.success('导入Expert成功');
      selectedRows.value = [];
      await gridApi.grid.clearCheckboxRow();
    } else {
      message.warning('导入Expert失败');
    }
  } finally {
    importLoading.value = false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <Space>
          <Button :loading="loadU8Loading" @click="loadInventoryFromU8">
            <template #icon>
              <CloudDownloadOutlined />
            </template>
            从U8加载库存
          </Button>
          <Button
            type="primary"
            :disabled="selectedRows.length === 0"
            :loading="importLoading"
            @click="importToExpert"
          >
            <template #icon>
              <ExportOutlined />
            </template>
            导入到Expert
          </Button>
          <span class="text-muted-foreground">
            已选 {{ selectedRows.length }} 条
          </span>
        </Space>
      </template>
    </Grid>
  </Page>
</template>
