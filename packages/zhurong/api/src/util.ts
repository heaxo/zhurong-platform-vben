import {baseRequestClient, CUSTOM_BASE_PREFIX} from "./request";
import {downloadFileFromBlob} from "@vben/utils";
import {message} from "ant-design-vue";

export function getImageResourcesBaseURL(image: string): string {
  const { protocol, hostname, port } = window.location;
  const apiPort = port;
  const baseURL = `${protocol}//${hostname}${apiPort ? `:${apiPort}` : ''}/api${CUSTOM_BASE_PREFIX}`;
  console.debug("Basic URL of image resourcess:",baseURL);
  return `${baseURL}/staticResources?source=${encodeURIComponent(image)}`;
}

function getFileNameFromContentDisposition(contentDisposition?: string) {
  if (!contentDisposition) {
    return '';
  }

  // filename*=UTF-8''%E4%B8%AD%E6%96%87.pdf
  const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8FileNameMatch?.[1]) {
    return decodeURIComponent(utf8FileNameMatch[1]);
  }

  // filename="113.pdf" 或 filename=113.pdf
  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (fileNameMatch?.[1]) {
    return decodeURIComponent(fileNameMatch[1]);
  }

  return '';
}

export async function downloadFileWithAuth(url: string, fileName?: string) {
  try {
    const response = await baseRequestClient.instance.get(url, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];

    const resolvedFileName =
      fileName ||
      getFileNameFromContentDisposition(contentDisposition) ||
      'downloaded_file';

    downloadFileFromBlob({
      fileName: resolvedFileName,
      source: response.data,
    });
  } catch (error) {
    const errorMessage = await getBlobErrorMessage(error);

    message.error(errorMessage || '下载失败');
    console.error('下载失败:', error);
    return errorMessage;
  }
}
export async function getBlobErrorMessage(error: any) {
  const data = error?.response?.data;

  if (data instanceof Blob) {
    const text = await data.text();

    if (!text) {
      return '';
    }

    try {
      const json = JSON.parse(text);
      return json?.message || json?.error || text;
    } catch {
      return text;
    }
  }

  return error?.response?.data?.message || error?.message || '';
}
/**
 * 直接下载 Blob。
 *
 * @param blob 二进制文件内容
 * @param fileName 下载文件名
 */
export async function downloadBlobFile(
  blob: Blob,
  fileName = 'downloaded_file',
): Promise<boolean> {
  try {
    if (!(blob instanceof Blob)) {
      throw new TypeError('下载内容不是有效的 Blob');
    }

    if (blob.size === 0) {
      throw new Error('下载文件内容为空');
    }

    /*
     * 防止后端发生异常时，把 JSON 错误信息作为 Blob 返回。
     */
    if (
      blob.type.includes('application/json') ||
      blob.type.includes('text/json')
    ) {
      const text = await blob.text();

      let errorMessage = text || '下载失败';

      try {
        const json = JSON.parse(text);

        errorMessage =
          json?.message ||
          json?.msg ||
          json?.error ||
          errorMessage;
      } catch {
        // 不是 JSON 时直接使用原始文本
      }

      throw new Error(errorMessage);
    }

    downloadFileFromBlob({
      fileName,
      source: blob,
    });

    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : '下载失败';

    message.error(errorMessage);
    console.error('Blob 文件下载失败：', error);

    return false;
  }
}
