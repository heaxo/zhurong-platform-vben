import {CUSTOM_BASE_PREFIX, downloadFileWithAuth, requestClient} from "@zhurong/api";
import type {LabelDataVO} from "#/views/nest/program/product-label";
import type {RequestResponse} from "@vben/request";


async function requestSyncReportedStatus(data:any) {
  return requestClient.post<Array<string>>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/sync_reported_status`, data);
}

/**
 * @param data
 */
async function requestLabelData(data: LabelDataQueryDTO) {
  return requestClient.post<LabelDataVO[]>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/labelData`, data);
}
export interface LabelDataQueryDTO {
  crossBoardMerger?: boolean | null;
  nestRecIds?: number[];
  nestPartRecIds?: number[];
}
/**
 * 导出标签 Excel。
 *
 * 后端：
 * POST /exportLabelExcel
 */
function requestExportLabelExcel(
  data: LabelDataQueryDTO,
): Promise<RequestResponse<Blob>> {
  return requestClient.post<RequestResponse<Blob>>(
    `${CUSTOM_BASE_PREFIX}/disNestNest00000100/exportLabelExcel`,
    data,
    {
      responseType: 'blob',
      responseReturn: 'raw',
      // 标签较多时生成 Excel 可能超过默认 10 秒
      timeout: 120_000,
    },
  );
}

export {
  requestSyncReportedStatus,
  requestLabelData,
  requestExportLabelExcel,
}
