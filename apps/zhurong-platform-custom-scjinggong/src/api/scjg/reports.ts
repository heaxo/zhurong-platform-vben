import { downloadFileFromBlob } from '@vben/utils';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

const prefix = `${CUSTOM_BASE_PREFIX}/scjinggongReports`;

export interface ReportQuery {
  page?: number;
  pageSize?: number;
  jobRef?: string;
  cnc?: string;
  matRef?: string;
  prdRef?: string;
  customerPartNo?: string;
  ordRef?: string;
  process?: string;
}

export interface ReportPage<T> {
  items: T[];
  total: number;
  current: number;
  size: number;
}

export interface CuttingProgramRow {
  cnc?: string;
  plateSize?: string;
  material?: string;
  quantity?: number;
  totalWeight?: number;
  utilization?: string;
  utilizationWithoutRemnant?: string;
}

export interface PartReportRow {
  partSequence?: number;
  productCode?: string;
  imageDataUri?: string;
  quantity?: number;
  customerPartNo?: string;
  batchNo?: string;
  material?: string;
  thickness?: number;
  process?: string;
}

/** 新增报表时，在此追加一对分页/导出函数；列和查询表单写在报表 Vue 组件内。 */
export function getCuttingProgramReport(params: ReportQuery) {
  return requestClient.get<ReportPage<CuttingProgramRow>>(
    `${prefix}/cutting-programs/page`,
    { params },
  );
}

export function getPartReport(params: ReportQuery) {
  return requestClient.get<ReportPage<PartReportRow>>(`${prefix}/parts/page`, {
    params,
  });
}

async function exportReport(path: string, fileName: string, params: ReportQuery) {
  // responseReturn=body 让 Vben 的认证拦截器继续生效，并直接取得二进制内容。
  const blob = await requestClient.get<Blob>(`${prefix}/${path}/export`, {
    params,
    responseReturn: 'body',
    responseType: 'blob',
  });
  if (blob.type.includes('json')) {
    const payload = JSON.parse(await blob.text());
    throw new Error(payload.message || '导出失败');
  }
  downloadFileFromBlob({ fileName, source: blob });
}

export function exportCuttingProgramReport(params: ReportQuery) {
  return exportReport('cutting-programs', '切割程序清单.xlsx', params);
}

export function exportPartReport(params: ReportQuery) {
  return exportReport('parts', '零件清单.xlsx', params);
}
