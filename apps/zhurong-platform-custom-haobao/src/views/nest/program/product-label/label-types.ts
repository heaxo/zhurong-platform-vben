export interface LabelDataVO {
  /** 订单号 */
  ordRef?: string;

  /** 品号 */
  prdRef?: string;

  /** 订单行号 */
  iorder?: number | string;

  /** 品名 */
  prdName?: string;

  /** 颜色 */
  color?: string;

  /** 材料 */
  matRef?: string;

  /** 厚度 */
  thickness?: number | string;

  /** 数量 */
  quantity?: number;

  /** 后端 LocalDateTime 通常序列化为 ISO 字符串 */
  date?: string | Date | null;

  /** 二维码内容 */
  qrCodeContent?: string;
}

export interface LabelLayout {
  /** 标签总宽度，单位 mm */
  widthMm: number;

  /** 标签总高度，单位 mm */
  heightMm: number;

  /** 最外层边框距离标签边缘 */
  outerInsetMm: number;

  /** 表格距离标签边缘 */
  tableInsetMm: number;

  /**
   * 六行的高度比例。
   * 会自动按比例填满表格高度。
   * 例如 [1, 1, 1, 1, 1, 1] 表示六行等高。
   */
  rowHeights: [number, number, number, number, number, number];

  /** 左侧字段名称列宽度 */
  titleColumnWidthMm: number;

  /** 右下角二维码列宽度 */
  qrColumnWidthMm: number;

  /** 单元格左右留白 */
  cellPaddingMm: number;

  /** 二维码内部留白 */
  qrPaddingMm: number;

  /** 左侧标题字体大小 */
  titleFontSizeMm: number;

  /** 字段值字体大小 */
  valueFontSizeMm: number;

  /** 字体 */
  fontFamily: string;

  /** 外边框粗细 */
  outerBorderWidthMm: number;

  /** 表格线粗细 */
  tableBorderWidthMm: number;
}

export const DEFAULT_LABEL_LAYOUT: LabelLayout = {
  widthMm: 70,
  heightMm: 50,

  outerInsetMm: 0.6,
  tableInsetMm: 2,

  rowHeights: [1, 1, 1, 1, 1, 1],

  titleColumnWidthMm: 12.5,
  qrColumnWidthMm: 17,

  cellPaddingMm: 1,
  qrPaddingMm: 0.8,

  titleFontSizeMm: 3.4,
  valueFontSizeMm: 3.1,

  fontFamily:
    '"Microsoft YaHei", "Noto Sans SC", "PingFang SC", SimSun, sans-serif',

  outerBorderWidthMm: 0.35,
  tableBorderWidthMm: 0.22,
};

/**
 * 后端 LabelDataVO 对应的前端类型。
 *
 * LocalDateTime 通常会被序列化成字符串，
 * 所以 date 使用 string | Date。
 */
export interface LabelDataVO {
  /** 订单号 */
  ordRef?: string;

  /** 品号 */
  prdRef?: string;

  /** 订单行号 */
  iorder?: number | string;

  /** 品名 */
  prdName?: string;

  /** 颜色 */
  color?: string;

  /** 材料 */
  matRef?: string;

  /** 厚度 */
  thickness?: number | string;

  /** 数量 */
  quantity?: number;

  /** 日期 */
  date?: string | Date | null;

  /** 二维码内容 */
  qrCodeContent?: string;

  /**
   * 可选的图片元素。
   *
   * 后端目前没有该字段时，不传即可。
   * 后续需要产品图、Logo 时，可以由前端补充，
   * 或在后端 DTO 中增加。
   */
  images?: LabelImageElement[];
}

export type LabelImageFit = 'contain' | 'cover' | 'stretch';

export interface LabelImageElement {
  /** 图片唯一标识，可选 */
  key?: string;

  /**
   * 图片来源：
   * - 普通 URL
   * - 相对地址
   * - Base64 Data URL
   * - Blob URL
   */
  src: string;

  /** 图片位置和尺寸，单位 mm */
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;

  /**
   * contain：完整显示，可能留白
   * cover：填充区域，可能裁剪
   * stretch：拉伸填充
   */
  fit?: LabelImageFit;

  /** 透明度，0~1 */
  opacity?: number;
}

/**
 * 标签整体布局。
 *
 * 所有尺寸单位均为毫米。
 */
export interface ProductLabelLayout {
  /** 标签总宽度 */
  widthMm: number;

  /** 标签总高度 */
  heightMm: number;

  /** 外边框距离标签边缘 */
  outerInsetMm: number;

  /** 内部表格距离标签边缘 */
  tableInsetMm: number;
  /**
   * 文字基线相对于字号的向下偏移比例。
   *
   * SVG 的 y 是文字基线，不是文字中心。
   * 中文字体通常使用 0.32～0.38。
   */
  textBaselineOffsetRatio: number;
  /**
   * 六行高度比例。
   *
   * 例如：
   * [1, 1, 1, 1, 1, 1] 表示六行等高。
   *
   * [1, 1.2, 1, 1, 1, 1] 表示第二行更高。
   */
  rowHeightWeights: [number, number, number, number, number, number];

  /** 左侧字段名称列宽 */
  titleColumnWidthMm: number;

  /** 右下角二维码列宽 */
  qrColumnWidthMm: number;

  /** 单元格左右内边距 */
  cellPaddingMm: number;

  /** 二维码区域内边距 */
  qrPaddingMm: number;
  /** 二维码静区模块数 */
  qrQuietZoneModules: number;
  /** 左侧字段名称字号 */
  titleFontSizeMm: number;

  /** 字段值默认字号 */
  valueFontSizeMm: number;

  /** 字段值允许缩小到的最小字号 */
  minValueFontSizeMm: number;

  /** 字体 */
  fontFamily: string;

  /** 外边框宽度 */
  outerBorderWidthMm: number;

  /** 内部表格线宽度 */
  tableBorderWidthMm: number;
}

export type ExpandedQuantityDisplay = 'source' | 'one';

export interface PrintLabelOptions {
  /**
   * 加载远程图片时使用的 fetch 参数。
   *
   * 图片接口依赖 Cookie 时可以传：
   * { credentials: 'include' }
   */
  imageRequestInit?: RequestInit;
}

export interface ExportLabelPdfOptions {
  /** 导出的文件名 */
  fileName?: string;

  /**
   * 中文字体 TTF 地址。
   *
   * PDF 包含中文时建议设置。
   * 例如：/fonts/LabelFont.ttf
   */
  fontUrl?: string;

  /**
   * 注册到 jsPDF 中的字体名称。
   *
   * SVG 中的 text 会在导出前统一替换为该字体。
   */
  fontFamily?: string;

  /** 加载图片和字体使用的 fetch 参数 */
  requestInit?: RequestInit;
}

export const DEFAULT_PRODUCT_LABEL_LAYOUT: ProductLabelLayout = {
  widthMm: 70,
  heightMm: 50,

  outerInsetMm: 0.6,
  tableInsetMm: 2,

  rowHeightWeights: [1, 1, 1, 1, 1, 1],

  titleColumnWidthMm: 12,
  qrColumnWidthMm: 17,

  cellPaddingMm: 1,
  qrPaddingMm: 0.8,
  qrQuietZoneModules: 2,

  titleFontSizeMm: 3.3,
  valueFontSizeMm: 3.1,
  minValueFontSizeMm: 1.8,

  fontFamily:
    '"Microsoft YaHei", "Noto Sans SC", "PingFang SC", SimSun, sans-serif',
  textBaselineOffsetRatio: 0.38,
  outerBorderWidthMm: 0.35,
  tableBorderWidthMm: 0.22,
};
