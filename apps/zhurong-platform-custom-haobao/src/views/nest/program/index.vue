<script lang="ts" setup>
import {
  NestingDataTable,
  type SimpleColumnSchema,
  useFieldRegistry
} from '@zhurong/components';
import {Page,useVbenModal,useVbenForm} from '@vben/common-ui';
import {reactive, ref, useTemplateRef,nextTick, h, computed} from 'vue';
import {Button, message, Modal, Space, Tooltip} from 'ant-design-vue';
import {PrinterOutlined,FilePdfOutlined,FileExcelOutlined,BranchesOutlined} from '@ant-design/icons-vue';
import {requestLabelData,requestExportLabelExcel} from '#/api';
import {
  ProductLabelSheet,
  type LabelDataVO,
  type LabelLayout, type ProductLabelLayout,
} from './product-label';
import {downloadBlobFile, downloadFileWithAuth} from "@zhurong/api";


const queryParameters = reactive({

});

const FIELD_REGISTRY = useFieldRegistry();
const DEFAULT_SCHEMA: SimpleColumnSchema[] = Object.keys(FIELD_REGISTRY).map(key => FIELD_REGISTRY[key]);
const columnsSchema = ref([
  FIELD_REGISTRY.image,
  FIELD_REGISTRY.nstRef,
  FIELD_REGISTRY.cnc,
  FIELD_REGISTRY.wrkRef,
  FIELD_REGISTRY.matRef,
  FIELD_REGISTRY.shtRef,
  FIELD_REGISTRY.sthickness,
  FIELD_REGISTRY.sprofit,
  FIELD_REGISTRY.sprofitS,
]);

function handleSelect(jobRefs: string[]) {
  console.log(jobRefs);
  if (jobRefs && jobRefs.length) {
    queryParameters.jobRef = jobRefs[0];
  }
}

const selectedRows = ref<any[]>([]);
const selectedSubRows = ref<any[]>([]);
const selectedCount = computed(() => selectedRows.value.length + selectedSubRows.value.length);
const gridEvents = {
  checkboxChange: ({records}) => {
    selectedRows.value = records;
  },
  checkboxAll: ({records}) => {
    selectedRows.value = records;
  },
  cellClick: async (param) => {
    if (param.column.field === 'cnc') {

    }
  },
};
const subGridEvents = {
  checkboxChange: ({records}) => {
    selectedSubRows.value = records;
  },
  checkboxAll: ({records}) => {
    selectedSubRows.value = records;
  },
  cellClick: async (param) => {

  },
};
const gridRef = useTemplateRef('gridRef');
const labelDataQueryParams = reactive({
  crossBoardMerger: null,
});

async function onPrint(): Promise<void> {
  if (
    selectedRows.value.length === 0 &&
    selectedSubRows.value.length === 0
  ) {
    message.warn('请选择要打印的标签数据');
    return;
  }

  Modal.confirm({
    title: '标签打印',
    content: '确定打印当前选中数据集吗？',

    onOk: async () => {
      /*
       * 必须在用户点击确认时立即打开窗口。
       * 如果等接口和 PDF 都生成完再 window.open，
       * 浏览器可能将其识别为非用户操作并拦截。
       */
      const printPreviewWindow = window.open(
        '',
        '_blank',
      );

      if (!printPreviewWindow) {
        message.error(
          '浏览器拦截了打印预览窗口，请允许当前网站打开弹窗',
        );

        throw new Error('打印预览窗口打开失败');
      }

      printPreviewWindow.document.write(`
        <!doctype html>
        <html lang="zh-CN">
          <head>
            <meta charset="UTF-8" />
            <title>正在生成标签</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                font-family: "Microsoft YaHei", sans-serif;
                text-align: center;
              }
            </style>
          </head>

          <body>
            正在生成标签打印文件，请稍候……
          </body>
        </html>
      `);

      printPreviewWindow.document.close();

      try {
        await getLabelData();
        const labelCount =
          labelSheetRef.value?.getLabelCount() ?? 0;

        const svgCount =
          labelSheetRef.value
            ?.getSvgElements()
            .length ?? 0;

        console.log('生成标签数量：', labelCount);
        console.log('生成 SVG 数量：', svgCount);

        if (labelCount === 0 || svgCount === 0) {
          throw new Error('没有生成可打印的标签');
        }

        /*
         * 在内存中生成多页 PDF。
         * 不会自动下载文件。
         */
        const pdfBlob =
          await labelSheetRef.value!.exportPdfBlob({
            fontUrl:
              '/fonts/NotoSansSC-Regular.ttf',

            fontFamily: 'LabelPdfFont',

            requestInit: {
              credentials: 'include',
            },
          });

        const pdfUrl =
          URL.createObjectURL(pdfBlob);

        /*
         * 使用浏览器自带 PDF 查看器打开。
         * 此时每个标签已经是明确的一页。
         */
        printPreviewWindow.location.replace(pdfUrl);

        /*
         * 给 PDF 查看器足够时间读取 Blob，
         * 然后再释放 URL。
         */
        window.setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 5 * 60 * 1000);
      } catch (error) {
        printPreviewWindow.close();

        console.error('标签打印失败：', error);

        message.error(
          error instanceof Error
            ? error.message
            : '标签打印失败',
        );

        throw error;
      }
    },
  });
}
async function getLabelData(){
  const nestRecIds = selectedRows.value.map(
    item => item.recID,
  );

  const nestPartRecIds =
    selectedSubRows.value.map(
      item => item.recID,
    );
  const result = await requestLabelData({
    ...labelDataQueryParams,
    nestRecIds,
    nestPartRecIds,
  });

  const rows: LabelDataVO[] =
    Array.isArray(result)
      ? result
      : (result?.data ?? []);

  if (rows.length === 0) {
    throw new Error('未查询到标签数据');
  }
  console.log('接口数据条数：', rows.length);
  labelData.value = [...rows];

  await nextTick();
}
async function handleExportExcel(){
  try{
    exporting.value = true;
    const nestRecIds = selectedRows.value.map(
      item => item.recID,
    );

    const nestPartRecIds =
      selectedSubRows.value.map(
        item => item.recID,
      );
    const result = await requestExportLabelExcel({
      ...labelDataQueryParams,
      nestRecIds,
      nestPartRecIds,
    });
    downloadBlobFile(result.data,"产品标签");
  }finally {
    exporting.value = false;
  }

}
async function clearTableState() {
  // 清除选中（checkbox）
  await gridRef.value._gridApi.grid.clearCheckboxRow();
  // 清除单选
  await gridRef.value._gridApi.grid.clearRadioRow();
  // 清除当前行
  await gridRef.value._gridApi.grid.clearCurrentRow();
  // 清除排序
  await gridRef.value._gridApi.grid.clearSort();
  // 清除过滤
  await gridRef.value._gridApi.grid.clearFilter();
  // 清除所有状态（最保险）
  await gridRef.value._gridApi.grid.clearAll();
}

const checkboxConfig = {
  checkMethod({row}) {
    return row.mstate !== 40 && row.mstate !== 90;
  },
};

const [LabelModeSelectModal, labelModeSelectModalApi] = useVbenModal({
  title: '标签模式',
  fullscreenButton:false,
  draggable: true,
  onOpened(){
    labelModeSelectFormApi.setValues(labelDataQueryParams);
  },
  onConfirm: async () => {
    const formValues = await labelModeSelectFormApi.getValues();
    console.log(formValues);
    Object.assign(labelDataQueryParams,formValues);
    labelModeSelectModalApi.close();
  },
});
const [LabelModeSelectForm, labelModeSelectFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Select',
      fieldName: 'crossBoardMerger',
      label: '模式',
      defaultValue: null,
      help: h('div', { style: 'line-height: 1.6;' }, [
        h('div', '不合并：排版上的每个零件生成一条标签数据。'),
        h('div', '同套料合并：只在同一个套料程序内，按“订单编码 + 零件编码”合并标签数量。'),
        h('div', '跨板合并：跨套料程序，按“订单编码 + 零件编码”合并标签数量。'),
      ]),
      componentProps: {
        defaultValue: null,
        style: {
          width: '100%',
        },
        options: [
          {
            label: '不合并',
            value: null,
          },
          {
            label: '同套料合并',
            value: false,
          },
          {
            label: '跨板合并',
            value: true,
          },
        ],
      },
    },
  ],
});
function selectMode() {
  labelModeSelectModalApi.open();
}
const labelSheetRef =
  ref<InstanceType<typeof ProductLabelSheet>>();

const layout = reactive<Partial<ProductLabelLayout>>({
  widthMm: 64.03,
  heightMm: 50.8,

  titleColumnWidthMm: 10,
  qrColumnWidthMm: 16,

  rowHeightWeights: [1, 1, 1, 1, 1, 1],

  titleFontSizeMm: 3.3,
  valueFontSizeMm: 3.1,

  qrColumnWidthMm: 18,
  qrPaddingMm: 0.2,
  qrQuietZoneModules: 1,
});

const labelData = ref<LabelDataVO[]>([]);

async function handlePrint(): Promise<void>  {
  // 等待 labelData 变化传递到子组件并完成 SVG 渲染
  await nextTick();

  const labelCount =
    labelSheetRef.value?.getLabelCount() ?? 0;

  if (labelCount === 0) {
    throw new Error('没有生成可打印的标签');
  }

  await labelSheetRef.value?.print();
}

const expandByQuantity = computed(() => labelDataQueryParams.crossBoardMerger === null ||
  labelDataQueryParams.crossBoardMerger === undefined)


const exporting = ref(false);
async function handleExportPdf(): Promise<void> {
  try {
    exporting.value = true;
    await getLabelData();

    await labelSheetRef.value?.downloadPdf({
      fileName: '产品标签.pdf',

      /**
       * PDF 需要显示中文时必须提供 TTF 字体。
       *
       * 字体文件由项目自行准备，不建议使用完整超大字体，
       * 最好使用业务字符子集字体。
       */
      fontUrl: '/fonts/NotoSansSC-Regular.ttf',
      fontFamily: 'LabelPdfFont',

      requestInit: {
        credentials: 'include',
      },
    });

    message.success('PDF 导出成功');
  } catch (error) {
    console.error(error);

    message.error(
      error instanceof Error
        ? error.message
        : 'PDF 导出失败',
    );
  } finally {
    exporting.value = false;
  }
}

</script>

<template>
  <Page auto-content-height contentClass="p-2">
    <LabelModeSelectModal>
      <LabelModeSelectForm/>
    </LabelModeSelectModal>
    <NestingDataTable
      ref="gridRef"
      :checkboxConfig="checkboxConfig"
      :gridEvents="gridEvents"
      :nestPartsGridEvents="subGridEvents"
      :queryParameters="queryParameters"
      :columnsSchema="columnsSchema"
      enableCheckbox
      enableServerSideSorting
    >
      <template #toolbar-actions>
        <Space class="toolbar-actions">
          <span class="selection-summary">已选 {{ selectedCount }} 条</span>
          <Tooltip title="标签模式">
            <Button
              @click="selectMode"
            >
              <template #icon>
                <BranchesOutlined />
              </template>
              标签模式
            </Button>
          </Tooltip>
          <Tooltip title="标签打印">
            <Button
              :disabled="(!selectedRows || !selectedRows.length) &&
              (!selectedSubRows || !selectedSubRows.length)"
              @click="onPrint"
            >
              <template #icon>
                <PrinterOutlined/>
              </template>
              标签打印
            </Button>
          </Tooltip>
          <Tooltip title="导出 PDF">
            <Button
              :disabled="(!selectedRows || !selectedRows.length) &&
              (!selectedSubRows || !selectedSubRows.length)"
              :loading="exporting"
              @click="handleExportPdf"
            >
              <template #icon>
                <FilePdfOutlined/>
              </template>
              导出 PDF
            </Button>
          </Tooltip>
          <Tooltip title="导出 Excel">
            <Button
              :loading="exporting"
              @click="handleExportExcel"
              v-show="false"
            >
              <template #icon>
                <FileExcelOutlined/>
              </template>
              导出 Excel
            </Button>
          </Tooltip>
        </Space>
      </template>
    </NestingDataTable>

    <div class="label-render-host">
      <ProductLabelSheet
        ref="labelSheetRef"
        :data="labelData"
        :layout="layout"
        :expand-by-quantity="expandByQuantity"
        expanded-quantity-display="one"
        :preview-columns="3"
        :gap-mm="3"
      />
    </div>
  </Page>
</template>

<style scoped>
:deep(.dark .vxe-cell--checkbox) {
  color: white !important;
}

.toolbar-actions {
  flex-wrap: nowrap;
}

.selection-summary {
  display: inline-flex;
  height: 32px;
  align-items: center;
  color: hsl(var(--muted-foreground));
  line-height: 32px;
  white-space: nowrap;
}

.label-render-host {
  position: fixed;
  top: 0;
  left: -100000px;
  z-index: -1;
  pointer-events: none;
}
</style>
