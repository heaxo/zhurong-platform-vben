<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  arrayBufferToBase64,
  calculateFittedFontSizeMm,
  cloneSvgWithEmbeddedImages,
  createQrModel,
  downloadBlob,
  formatLabelDate,
  normalizeQuantity,
  type QrModel,
} from './label-utils';

import {
  DEFAULT_PRODUCT_LABEL_LAYOUT,
  type ExpandedQuantityDisplay,
  type ExportLabelPdfOptions,
  type LabelDataVO,
  type LabelImageElement,
  type PrintLabelOptions,
  type ProductLabelLayout,
} from './label-types';

interface Props {
  /** 标签数据 */
  data?: LabelDataVO[];

  /** 标签布局 */
  layout?: Partial<ProductLabelLayout>;

  /**
   * 是否按数量展开。
   *
   * false：
   * 一条数据生成一张标签。
   *
   * true：
   * quantity=10 时生成十张标签。
   */
  expandByQuantity?: boolean;

  /**
   * 按数量展开后，标签数量字段如何显示。
   *
   * source：
   * 每张仍然显示原始数量。
   *
   * one：
   * 每张标签显示 1。
   */
  expandedQuantityDisplay?: ExpandedQuantityDisplay;

  /** 预览区域一行显示多少张标签 */
  previewColumns?: number;

  /** 预览标签之间的间距，单位 mm */
  gapMm?: number;
}

interface LabelCell {
  value: string;
  widthRatio?: number;
}

interface LabelRow {
  title: string;
  cells: LabelCell[];
}

interface LabelCellLayout {
  centerX: number;
  width: number;
}

interface RenderedLabel {
  key: string;
  rows: LabelRow[];
  qr: QrModel | null;
  qrPath: string | null;
  images: LabelImageElement[];
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  layout: () => ({}),
  expandByQuantity: false,
  expandedQuantityDisplay: 'source',
  previewColumns: 3,
  gapMm: 3,
});

const rootRef = ref<HTMLDivElement>();

const resolvedLayout = computed<ProductLabelLayout>(() => ({
  ...DEFAULT_PRODUCT_LABEL_LAYOUT,
  ...props.layout,

  rowHeightWeights:
    props.layout?.rowHeightWeights ??
    DEFAULT_PRODUCT_LABEL_LAYOUT.rowHeightWeights,
}));

const previewStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${Math.max(
    1,
    props.previewColumns,
  )}, max-content)`,
  gap: `${Math.max(0, props.gapMm)}mm`,
}));

/**
 * 根据标签配置计算所有表格坐标。
 */
const geometry = computed(() => {
  const layout = resolvedLayout.value;

  const tableX = layout.tableInsetMm;
  const tableY = layout.tableInsetMm;

  const tableWidth = Math.max(1, layout.widthMm - layout.tableInsetMm * 2);

  const tableHeight = Math.max(1, layout.heightMm - layout.tableInsetMm * 2);

  const tableRight = tableX + tableWidth;
  const tableBottom = tableY + tableHeight;

  const weights = layout.rowHeightWeights.map((value) => Math.max(0.01, value));

  const totalWeight = weights.reduce((sum, value) => sum + value, 0);

  const rowHeights = weights.map(
    (value) => (tableHeight * value) / totalWeight,
  );

  const rowTops: number[] = [];
  const rowBottoms: number[] = [];
  const rowCenters: number[] = [];

  let currentY = tableY;

  for (const rowHeight of rowHeights) {
    rowTops.push(currentY);
    rowCenters.push(currentY + rowHeight / 2);

    currentY += rowHeight;
    rowBottoms.push(currentY);
  }

  const titleColumnWidth = Math.min(
    Math.max(5, layout.titleColumnWidthMm),
    tableWidth - 10,
  );

  const qrColumnWidth = Math.min(
    Math.max(8, layout.qrColumnWidthMm),
    tableWidth - titleColumnWidth - 3,
  );

  const titleDividerX = tableX + titleColumnWidth;

  const qrDividerX = tableRight - qrColumnWidth;

  /**
   * 前四行占满右侧。
   * 最后两行给二维码留出右侧区域。
   */
  const valueRightXs = [
    tableRight,
    tableRight,
    tableRight,
    tableRight,
    qrDividerX,
    qrDividerX,
  ];

  /**
   * 前四条横线贯穿整个表格。
   * 数量与日期之间的横线只画到二维码左侧。
   */
  const horizontalLines = rowBottoms.slice(0, 5).map((y, index) => ({
    y,
    x1: tableX,
    x2: index === 4 ? qrDividerX : tableRight,
  }));

  const qrAreaTop = rowTops[4] ?? tableY;

  const qrAreaHeight = (rowHeights[4] ?? 0) + (rowHeights[5] ?? 0);

  const qrSize = Math.max(
    1,
    Math.min(qrColumnWidth, qrAreaHeight) - layout.qrPaddingMm * 2,
  );

  const qrX = qrDividerX + (qrColumnWidth - qrSize) / 2;

  const qrY = qrAreaTop + (qrAreaHeight - qrSize) / 2;

  return {
    tableX,
    tableY,
    tableWidth,
    tableHeight,
    tableRight,
    tableBottom,

    rowTops,
    rowBottoms,
    rowCenters,
    rowHeights,

    titleDividerX,
    titleCenterX: (tableX + titleDividerX) / 2,

    qrDividerX,
    qrAreaTop,

    valueRightXs,

    horizontalLines,

    qrX,
    qrY,
    qrSize,
  };
});

function getDisplayedQuantity(data: LabelDataVO): string {
  if (props.expandByQuantity && props.expandedQuantityDisplay === 'one') {
    return '1';
  }

  return String(data.quantity ?? '');
}

function toLabelText(value: null | number | string | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function createRows(data: LabelDataVO): LabelRow[] {
  return [
    {
      title: '订单',
      cells: [
        {
          value: toLabelText(data.ordRef),
        },
      ],
    },
    {
      title: '品号',
      cells: [
        {
          value: toLabelText(data.prdRef),
          widthRatio: 70,
        },
        {
          value: toLabelText(data.iorder),
          widthRatio: 30,
        },
      ],
    },
    {
      title: '品名',
      cells: [
        {
          value: toLabelText(data.prdName),
        },
      ],
    },
    {
      title: '颜色',
      cells: [
        {
          value: toLabelText(data.color),
          widthRatio: 45,
        },
        {
          value: toLabelText(data.matRef),
          widthRatio: 35,
        },
        {
          value: toLabelText(data.thickness),
          widthRatio: 20,
        },
      ],
    },
    {
      title: '数量',
      cells: [
        {
          value: getDisplayedQuantity(data),
        },
      ],
    },
    {
      title: '日期',
      cells: [
        {
          value: formatLabelDate(data.date),
        },
      ],
    },
  ];
}

const renderedLabels = computed<RenderedLabel[]>(() => {
  const result: RenderedLabel[] = [];

  props.data.forEach((item, dataIndex) => {
    const quantity = normalizeQuantity(item.quantity);

    const labelCount = props.expandByQuantity ? quantity : 1;

    for (let copyIndex = 0; copyIndex < labelCount; copyIndex++) {
      const qr = createQrModel(item.qrCodeContent);
      result.push({
        key: `${dataIndex}-${copyIndex}`,
        rows: createRows(item),
        qr: qr,
        qrPath: qr ? createQrPath(qr) : '',
        images: item.images ?? [],
      });
    }
  });

  return result;
});

function getValueCellLayout(
  row: LabelRow,
  rowIndex: number,
  cellIndex: number,
): LabelCellLayout {
  const cells =
    row.cells.length > 0
      ? row.cells
      : [
          {
            value: '',
          },
        ];

  const ratios = cells.map((cell) => Math.max(0.01, cell.widthRatio ?? 1));

  const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);

  const valueLeftX = geometry.value.titleDividerX;

  const valueRightX =
    geometry.value.valueRightXs[rowIndex] ?? geometry.value.tableRight;

  const valueWidth = Math.max(1, valueRightX - valueLeftX);

  const leftRatio = ratios
    .slice(0, cellIndex)
    .reduce((sum, ratio) => sum + ratio, 0);

  const rightRatio = leftRatio + (ratios[cellIndex] ?? 1);

  const cellLeftX = valueLeftX + (valueWidth * leftRatio) / totalRatio;

  const cellRightX =
    cellIndex === cells.length - 1
      ? valueRightX
      : valueLeftX + (valueWidth * rightRatio) / totalRatio;

  return {
    centerX: (cellLeftX + cellRightX) / 2,
    width: Math.max(
      1,
      cellRightX - cellLeftX - resolvedLayout.value.cellPaddingMm * 2,
    ),
  };
}

function getValueCellDividers(row: LabelRow, rowIndex: number): number[] {
  if (row.cells.length <= 1) {
    return [];
  }

  const ratios = row.cells.map((cell) => Math.max(0.01, cell.widthRatio ?? 1));

  const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);

  const valueLeftX = geometry.value.titleDividerX;

  const valueRightX =
    geometry.value.valueRightXs[rowIndex] ?? geometry.value.tableRight;

  const valueWidth = Math.max(1, valueRightX - valueLeftX);

  let accumulatedRatio = 0;

  return ratios.slice(0, -1).map((ratio) => {
    accumulatedRatio += ratio;

    return valueLeftX + (valueWidth * accumulatedRatio) / totalRatio;
  });
}

function getValueCellFontSize(
  value: string,
  row: LabelRow,
  rowIndex: number,
  cellIndex: number,
): number {
  const layout = resolvedLayout.value;
  const cellLayout = getValueCellLayout(row, rowIndex, cellIndex);

  return calculateFittedFontSizeMm(
    value,
    cellLayout.width,
    layout.valueFontSizeMm,
    layout.minValueFontSizeMm,
  );
}

function getImagePreserveAspectRatio(image: LabelImageElement): string {
  switch (image.fit) {
    case 'cover':
      return 'xMidYMid slice';

    case 'stretch':
      return 'none';

    case 'contain':
    default:
      return 'xMidYMid meet';
  }
}

function getSvgElements(): SVGSVGElement[] {
  if (!rootRef.value) {
    return [];
  }

  return Array.from(
    rootRef.value.querySelectorAll<SVGSVGElement>('svg.product-label'),
  );
}

/**
 * 获取已将远程图片内嵌后的 SVG 副本。
 */
async function getEmbeddedSvgCopies(
  requestInit?: RequestInit,
): Promise<SVGSVGElement[]> {
  const elements = getSvgElements();

  return Promise.all(
    elements.map((element) => cloneSvgWithEmbeddedImages(element, requestInit)),
  );
}

/**
 * 浏览器打印。
 *
 * 每张标签占据一个独立页面。
 */
async function print(options: PrintLabelOptions = {}): Promise<void> {
  const svgElements = await getEmbeddedSvgCopies(options.imageRequestInit);

  if (svgElements.length === 0) {
    throw new Error('没有可打印的标签数据');
  }

  console.log('本次打印标签数量：', svgElements.length);

  const layout = resolvedLayout.value;

  const printWindow = window.open('', '_blank', 'width=1000,height=800');

  if (!printWindow) {
    throw new Error('浏览器拦截了打印窗口，请允许当前网站打开弹窗');
  }

  /*
   * 每一个 SVG 都必须放进独立的 label-page。
   * 不要再包一层 grid、flex 或固定高度容器。
   */
  const pagesHtml = svgElements
    .map(
      (svg, index) => `
        <section
          class="label-page"
          data-page-index="${index + 1}"
        >
          ${svg.outerHTML}
        </section>
      `,
    )
    .join('');

  printWindow.document.open();

  printWindow.document.write(`
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />

        <title>标签打印</title>

        <style>
          @page {
            size: ${layout.widthMm}mm ${layout.heightMm}mm;
            margin: 0;
          }

          html {
            margin: 0 !important;
            padding: 0 !important;

            /*
             * 不能固定为一张标签的高度。
             * 否则后续页面虽然存在，但会被裁剪。
             */
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;

            width: auto !important;
            height: auto !important;
            min-width: 0 !important;
            min-height: 0 !important;

            display: block !important;
            overflow: visible !important;

            background: #ffffff;
          }

          * {
            box-sizing: border-box;

            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .label-page {
            position: relative;

            display: block !important;
            flex: none !important;

            width: ${layout.widthMm}mm !important;
            height: ${layout.heightMm}mm !important;

            margin: 0 !important;
            padding: 0 !important;

            overflow: hidden;

            /*
             * 新旧分页属性同时设置。
             */
            break-inside: avoid;
            page-break-inside: avoid;

            break-after: page;
            page-break-after: always;
          }

          /*
           * 从第二张标签开始，强制在新页面开始。
           *
           * 对 Chromium 自定义纸张分页通常比单独使用
           * break-after 更稳定。
           */
          .label-page + .label-page {
            break-before: page;
            page-break-before: always;
          }

          .label-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }

          .product-label {
            display: block !important;

            width: ${layout.widthMm}mm !important;
            height: ${layout.heightMm}mm !important;

            margin: 0 !important;
            padding: 0 !important;
          }

          @media screen {
            body {
              background: #666666;
            }

            .label-page {
              margin-bottom: 10px !important;
              background: #ffffff;
            }
          }

          @media print {
            html,
            body {
              background: #ffffff !important;
            }

            .label-page {
              margin: 0 !important;
            }
          }
        </style>
      </head>

      <body>
        ${pagesHtml}
      </body>
    </html>
  `);

  printWindow.document.close();

  try {
    await printWindow.document.fonts.ready;
  } catch {
    // 部分浏览器可能不支持 document.fonts
  }

  /*
   * 检查打印窗口中实际页数。
   */
  const pageCount = printWindow.document.querySelectorAll('.label-page').length;

  console.log('打印窗口分页节点数：', pageCount);

  if (pageCount !== svgElements.length) {
    printWindow.close();

    throw new Error(
      `标签分页异常：应生成 ${svgElements.length} 页，实际生成 ${pageCount} 页`,
    );
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 300);
  });

  printWindow.focus();

  printWindow.onafterprint = () => {
    printWindow.close();
  };

  printWindow.print();
}
function getTextBaselineY(rowIndex: number, fontSizeMm: number): number {
  return (
    (geometry.value.rowCenters[rowIndex] ?? geometry.value.tableY) +
    fontSizeMm * resolvedLayout.value.textBaselineOffsetRatio
  );
}

function getTitleTextY(rowIndex: number): number {
  return getTextBaselineY(rowIndex, resolvedLayout.value.titleFontSizeMm);
}

function getValueCellTextY(
  value: string,
  row: LabelRow,
  rowIndex: number,
  cellIndex: number,
): number {
  const fontSize = getValueCellFontSize(value, row, rowIndex, cellIndex);

  return getTextBaselineY(rowIndex, fontSize);
}
/**
 * 注册中文字体。
 */
async function registerPdfFont(
  pdf: import('jspdf').jsPDF,
  fontUrl: string,
  fontFamily: string,
  requestInit?: RequestInit,
): Promise<void> {
  const response = await fetch(fontUrl, {
    credentials: 'include',
    ...requestInit,
  });

  if (!response.ok) {
    throw new Error(`PDF 中文字体加载失败：${response.status}`);
  }

  const fontBuffer = await response.arrayBuffer();

  const fontBase64 = arrayBufferToBase64(fontBuffer);

  const fontFileName = 'label-font.ttf';

  pdf.addFileToVFS(fontFileName, fontBase64);

  pdf.addFont(fontFileName, fontFamily, 'normal');

  pdf.setFont(fontFamily, 'normal');
}

/**
 * 生成 PDF Blob。
 *
 * 一张标签对应 PDF 一页。
 */
async function exportPdfBlob(
  options: ExportLabelPdfOptions = {},
): Promise<Blob> {
  const svgElements = await getEmbeddedSvgCopies(options.requestInit);

  if (svgElements.length === 0) {
    throw new Error('没有可导出的标签数据');
  }

  /**
   * 点击导出时才加载 PDF 依赖，
   * 避免增加页面首屏包体和初始化内存。
   */
  const { jsPDF } = await import('jspdf');

  await import('svg2pdf.js');

  const layout = resolvedLayout.value;

  const orientation =
    layout.widthMm >= layout.heightMm ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [layout.widthMm, layout.heightMm],
    compress: true,
    putOnlyUsedFonts: true,
  });

  const pdfFontFamily = options.fontFamily ?? 'LabelPdfFont';

  if (options.fontUrl) {
    await registerPdfFont(
      pdf,
      options.fontUrl,
      pdfFontFamily,
      options.requestInit,
    );

    /**
     * 将 SVG 中的字体替换为已注册的 PDF 字体。
     */
    for (const svg of svgElements) {
      const texts = svg.querySelectorAll<SVGTextElement>('text');

      texts.forEach((text) => {
        text.setAttribute('font-family', pdfFontFamily);
      });
    }
  }

  type SvgCapablePdf = {
    svg: (
      element: SVGElement,
      options: {
        x: number;
        y: number;
        width: number;
        height: number;
      },
    ) => Promise<unknown>;
  };

  const svgPdf = pdf as unknown as SvgCapablePdf;

  for (let index = 0; index < svgElements.length; index++) {
    if (index > 0) {
      pdf.addPage([layout.widthMm, layout.heightMm], orientation);
    }

    const svgElement = svgElements[index];

    if (svgElement) {
      await svgPdf.svg(svgElement, {
        x: 0,
        y: 0,
        width: layout.widthMm,
        height: layout.heightMm,
      });
    }
  }

  return pdf.output('blob');
}

/**
 * 直接下载 PDF。
 */
async function downloadPdf(options: ExportLabelPdfOptions = {}): Promise<void> {
  const blob = await exportPdfBlob(options);

  downloadBlob(blob, options.fileName ?? '产品标签.pdf');
}

function getLabelCount(): number {
  return renderedLabels.value.length;
}

function createQrPath(qr: QrModel): string {
  return qr.cells
    .map((cell) => {
      return `M${cell.x} ${cell.y}h1v1h-1z`;
    })
    .join('');
}

defineExpose({
  print,
  downloadPdf,
  exportPdfBlob,
  getSvgElements,
  getLabelCount,
});
</script>

<template>
  <div ref="rootRef" class="product-label-sheet" :style="previewStyle">
    <svg
      v-for="label in renderedLabels"
      :key="label.key"
      class="product-label"
      xmlns="http://www.w3.org/2000/svg"
      :width="`${resolvedLayout.widthMm}mm`"
      :height="`${resolvedLayout.heightMm}mm`"
      :viewBox="`0 0 ${resolvedLayout.widthMm} ${resolvedLayout.heightMm}`"
      shape-rendering="geometricPrecision"
    >
      <!-- 标签白色背景和外边框 -->
      <!--      <rect
        fill="#ffffff"
        stroke="#000000"
        :stroke-width="
          resolvedLayout.outerBorderWidthMm
        "
        :x="resolvedLayout.outerInsetMm"
        :y="resolvedLayout.outerInsetMm"
        :width="
          resolvedLayout.widthMm -
          resolvedLayout.outerInsetMm * 2
        "
        :height="
          resolvedLayout.heightMm -
          resolvedLayout.outerInsetMm * 2
        "
      />-->

      <!--
        自定义图片区域。

        图片先绘制，后续表格边框和文字绘制在图片上方。
      -->
      <template
        v-for="(image, imageIndex) in label.images"
        :key="image.key ?? `${label.key}-image-${imageIndex}`"
      >
        <defs v-if="image.fit === 'cover'">
          <clipPath :id="`image-clip-${label.key}-${imageIndex}`">
            <rect
              :x="image.xMm"
              :y="image.yMm"
              :width="image.widthMm"
              :height="image.heightMm"
            />
          </clipPath>
        </defs>

        <image
          :href="image.src"
          :x="image.xMm"
          :y="image.yMm"
          :width="image.widthMm"
          :height="image.heightMm"
          :opacity="image.opacity ?? 1"
          :preserveAspectRatio="getImagePreserveAspectRatio(image)"
          :clip-path="
            image.fit === 'cover'
              ? `url(#image-clip-${label.key}-${imageIndex})`
              : undefined
          "
        />
      </template>

      <!-- 内部表格边框 -->
      <rect
        fill="none"
        stroke="#000000"
        :stroke-width="resolvedLayout.tableBorderWidthMm"
        :x="geometry.tableX"
        :y="geometry.tableY"
        :width="geometry.tableWidth"
        :height="geometry.tableHeight"
      />

      <!-- 横线 -->
      <line
        v-for="(line, index) in geometry.horizontalLines"
        :key="`horizontal-${index}`"
        stroke="#000000"
        :stroke-width="resolvedLayout.tableBorderWidthMm"
        :x1="line.x1"
        :x2="line.x2"
        :y1="line.y"
        :y2="line.y"
      />

      <!-- 标题列分隔线 -->
      <line
        stroke="#000000"
        :stroke-width="resolvedLayout.tableBorderWidthMm"
        :x1="geometry.titleDividerX"
        :x2="geometry.titleDividerX"
        :y1="geometry.tableY"
        :y2="geometry.tableBottom"
      />

      <!-- 二维码列分隔线 -->
      <line
        stroke="#000000"
        :stroke-width="resolvedLayout.tableBorderWidthMm"
        :x1="geometry.qrDividerX"
        :x2="geometry.qrDividerX"
        :y1="geometry.qrAreaTop"
        :y2="geometry.tableBottom"
      />

      <!-- 六行文本 -->
      <g
        v-for="(row, rowIndex) in label.rows"
        :key="`${label.key}-${rowIndex}-${row.title}`"
      >
        <line
          v-for="(dividerX, dividerIndex) in getValueCellDividers(
            row,
            rowIndex,
          )"
          :key="`${label.key}-${rowIndex}-divider-${dividerIndex}`"
          stroke="#000000"
          :stroke-width="resolvedLayout.tableBorderWidthMm"
          :x1="dividerX"
          :x2="dividerX"
          :y1="geometry.rowTops[rowIndex]"
          :y2="geometry.rowBottoms[rowIndex]"
        />

        <!-- 左侧字段名称 -->
        <text
          fill="#000000"
          text-anchor="middle"
          :font-family="resolvedLayout.fontFamily"
          :font-size="resolvedLayout.titleFontSizeMm"
          :x="geometry.titleCenterX"
          :y="getTitleTextY(rowIndex)"
        >
          {{ row.title }}
        </text>

        <!-- 字段值 -->
        <text
          v-for="(cell, cellIndex) in row.cells"
          :key="`${label.key}-${rowIndex}-cell-${cellIndex}`"
          fill="#000000"
          text-anchor="middle"
          :font-family="resolvedLayout.fontFamily"
          :font-size="
            getValueCellFontSize(cell.value, row, rowIndex, cellIndex)
          "
          :x="getValueCellLayout(row, rowIndex, cellIndex).centerX"
          :y="getValueCellTextY(cell.value, row, rowIndex, cellIndex)"
        >
          {{ cell.value }}
        </text>
      </g>

      <!-- 二维码 -->
      <svg
        v-if="label.qr"
        :x="geometry.qrX"
        :y="geometry.qrY"
        :width="geometry.qrSize"
        :height="geometry.qrSize"
        :viewBox="`${-resolvedLayout.qrQuietZoneModules}
     ${-resolvedLayout.qrQuietZoneModules}
     ${label.qr.size + resolvedLayout.qrQuietZoneModules * 2}
     ${label.qr.size + resolvedLayout.qrQuietZoneModules * 2}`"
        preserveAspectRatio="xMidYMid meet"
        shape-rendering="crispEdges"
      >
        <rect
          :x="-resolvedLayout.qrQuietZoneModules"
          :y="-resolvedLayout.qrQuietZoneModules"
          :width="label.qr.size + resolvedLayout.qrQuietZoneModules * 2"
          :height="label.qr.size + resolvedLayout.qrQuietZoneModules * 2"
          fill="#ffffff"
        />

        <path :d="label.qrPath ?? undefined" fill="#000000" />
      </svg>
    </svg>
  </div>
</template>

<style scoped>
.product-label-sheet {
  align-items: start;
  justify-content: start;
}

.product-label {
  display: block;
  flex: none;
  overflow: hidden;
  background: #ffffff;
}
</style>
