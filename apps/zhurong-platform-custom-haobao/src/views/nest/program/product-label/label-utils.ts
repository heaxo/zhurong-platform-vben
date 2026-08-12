import QRCode from 'qrcode';

export interface QrCell {
  x: number;
  y: number;
}

export interface QrModel {
  size: number;
  cells: QrCell[];
}

const qrCache = new Map<string, QrModel>();

/**
 * 将二维码转换成 SVG 可直接渲染的矩阵数据。
 *
 * 不生成 Canvas 和 PNG，二维码仍然保持矢量。
 */
export function createQrModel(
  content?: string,
): QrModel | null {
  const value = content?.trim();

  if (!value) {
    return null;
  }

  const cached = qrCache.get(value);

  if (cached) {
    return cached;
  }

  const qrCode = QRCode.create(value, {
    errorCorrectionLevel: 'M',
  });

  const size = qrCode.modules.size;
  const cells: QrCell[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = y * size + x;

      if (qrCode.modules.data[index]) {
        cells.push({
          x,
          y,
        });
      }
    }
  }

  const result: QrModel = {
    size,
    cells,
  };

  qrCache.set(value, result);

  return result;
}

/**
 * 数量标准化。
 */
export function normalizeQuantity(
  quantity?: number,
): number {
  const result = Number(quantity ?? 0);

  if (!Number.isFinite(result)) {
    return 0;
  }

  return Math.max(0, Math.floor(result));
}

/**
 * 将后端日期格式化为 yyyy/M/d。
 *
 * 优先从字符串中直接截取日期，避免时区转换导致日期偏移。
 */
export function formatLabelDate(
  value?: string | Date | null,
): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    const match = value.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})/,
    );

    if (match) {
      return [
        match[1],
        Number(match[2]),
        Number(match[3]),
      ].join('/');
    }
  }

  const date =
    value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ].join('/');
}

/**
 * 粗略计算文本占用宽度。
 *
 * 主要用于长品号自动缩小字号。
 */
export function estimateTextWidthMm(
  text: string,
  fontSizeMm: number,
): number {
  let units = 0;

  for (const char of text) {
    if (/[\u2e80-\u9fff]/.test(char)) {
      units += 1;
    } else {
      units += 0.56;
    }
  }

  return units * fontSizeMm * 1.06;
}

/**
 * 根据单元格宽度自动计算字号。
 */
export function calculateFittedFontSizeMm(
  text: string,
  maxWidthMm: number,
  defaultFontSizeMm: number,
  minFontSizeMm: number,
): number {
  if (!text) {
    return defaultFontSizeMm;
  }

  const estimatedWidth = estimateTextWidthMm(
    text,
    defaultFontSizeMm,
  );

  if (estimatedWidth <= maxWidthMm) {
    return defaultFontSizeMm;
  }

  const result =
    defaultFontSizeMm *
    (maxWidthMm / estimatedWidth);

  return Math.max(minFontSizeMm, result);
}

const imageDataUrlCache = new Map<
  string,
  Promise<string>
>();

/**
 * 将图片地址转换成 Data URL。
 *
 * 浏览器打印窗口和 PDF 导出时，不再依赖原图片地址。
 */
export async function imageSourceToDataUrl(
  src: string,
  requestInit?: RequestInit,
): Promise<string> {
  if (!src) {
    return '';
  }

  if (src.startsWith('data:')) {
    return src;
  }

  const cached = imageDataUrlCache.get(src);

  if (cached) {
    return cached;
  }

  const promise = fetch(src, {
    credentials: 'include',
    ...requestInit,
  })
    .then(async response => {
      if (!response.ok) {
        throw new Error(
          `图片加载失败：${response.status} ${src}`,
        );
      }

      const blob = await response.blob();

      return blobToDataUrl(blob);
    })
    .catch(error => {
      imageDataUrlCache.delete(src);
      throw error;
    });

  imageDataUrlCache.set(src, promise);

  return promise;
}

export function blobToDataUrl(
  blob: Blob,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(
        reader.error ??
        new Error('图片转换 Data URL 失败'),
      );
    };

    reader.readAsDataURL(blob);
  });
}

/**
 * 克隆 SVG，并将其中的外部图片全部转为 Data URL。
 */
export async function cloneSvgWithEmbeddedImages(
  source: SVGSVGElement,
  requestInit?: RequestInit,
): Promise<SVGSVGElement> {
  const cloned = source.cloneNode(
    true,
  ) as SVGSVGElement;

  const images = Array.from(
    cloned.querySelectorAll<SVGImageElement>('image'),
  );

  await Promise.all(
    images.map(async image => {
      const href =
        image.getAttribute('href') ||
        image.getAttributeNS(
          'http://www.w3.org/1999/xlink',
          'href',
        );

      if (!href) {
        return;
      }

      const dataUrl = await imageSourceToDataUrl(
        href,
        requestInit,
      );

      image.setAttribute('href', dataUrl);
      image.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        dataUrl,
      );
    }),
  );

  return cloned;
}

/**
 * ArrayBuffer 转 Base64。
 *
 * 用于注册 PDF 字体。
 */
export function arrayBufferToBase64(
  buffer: ArrayBuffer,
): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;

  let binary = '';

  for (
    let offset = 0;
    offset < bytes.length;
    offset += chunkSize
  ) {
    binary += String.fromCharCode(
      ...bytes.subarray(
        offset,
        offset + chunkSize,
      ),
    );
  }

  return window.btoa(binary);
}

/**
 * 下载 Blob。
 */
export function downloadBlob(
  blob: Blob,
  fileName: string,
): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
