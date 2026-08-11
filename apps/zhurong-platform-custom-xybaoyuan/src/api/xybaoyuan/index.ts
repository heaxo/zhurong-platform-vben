import type { Recordable } from '@vben/types';

import { downloadFileFromBlob } from '@vben/utils';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

const PREFIX = `${CUSTOM_BASE_PREFIX}/xybaoyuan`;

async function download(url: string, params: Recordable<any>, fileName: string) {
  const response = await requestClient.get<any>(url, { params, responseReturn: 'raw', responseType: 'blob' });
  downloadFileFromBlob({ fileName, source: response.data });
}

export interface PageResult<T> { current: number; items: T[]; size: number; total: number }
export interface ImportTask { attempts: number; businessType: string; id: number; message?: string; status: string }
export interface BasePart {
  drawingCode: string; id: number; invalidState: boolean; matRef: string; partMaintenance: boolean;
  prdName: string; prdRef: string; thickness: number; udata1?: string; udata2?: string; udata3?: string;
}
export interface SteelPlate {
  id: number; invalidState: boolean; lastTaskId?: number; length: number; matRef: string; prdName: string;
  prdRef: string; quantity: number; sendState: boolean; specification?: string; stockName: string;
  stockNumber: string; task?: ImportTask; thickness: number; tons: number; width: number;
}
export interface ManufacturingOrder {
  cusRef: string; drawingCode?: string; id: number; jobName?: string; jobRef?: string; lastTaskId?: number;
  matRef: string; partMaintenance: boolean; prdName: string; prdRef: string; productionOrderErpInternalCode: string;
  productionOrderNumber: string; productionWorkshopName?: string; quantity: number; sendState: boolean;
  task?: ImportTask; thickness: number; workCenter?: string; wrkRef?: string;
}

export const pageBaseParts = (params: Recordable<any>) => requestClient.get<PageResult<BasePart>>(`${PREFIX}/base-parts`, { params });
export const createBasePart = (data: Partial<BasePart>) => requestClient.post<BasePart>(`${PREFIX}/base-parts`, data);
export const deleteBaseParts = (ids: number[]) => requestClient.delete(`${PREFIX}/base-parts`, { data: { ids } });
export const exportBaseParts = (params: Recordable<any>) => download(`${PREFIX}/base-parts/export`, params, '象屿宝元-基础零件.csv');

export const pageSteelPlates = (params: Recordable<any>) => requestClient.get<PageResult<SteelPlate>>(`${PREFIX}/steel-plates`, { params });
export const syncErpSteelPlates = (data: Recordable<any>) => requestClient.post<number>(`${PREFIX}/steel-plates/sync-erp`, data);
export const deleteSteelPlates = (ids: number[]) => requestClient.delete(`${PREFIX}/steel-plates`, { data: { ids } });
export const importSteelPlates = (ids: number[], syncTask = false) => requestClient.post<ImportTask>(`${PREFIX}/steel-plates/import-tasks`, { ids, syncTask });
export const exportSteelPlates = (params: Recordable<any>) => download(`${PREFIX}/steel-plates/export`, params, '象屿宝元-钢板.csv');

export const pageOrders = (params: Recordable<any>) => requestClient.get<PageResult<ManufacturingOrder>>(`${PREFIX}/manufacturing-orders`, { params });
export const updateOrders = (data: Recordable<any>[]) => requestClient.put(`${PREFIX}/manufacturing-orders/batch`, data);
export const jobExists = (jobName: string) => requestClient.get<boolean>(`${PREFIX}/manufacturing-orders/job-exists`, { params: { jobName } });
export const resolveJob = (jobName: string, useOldJob: boolean) => requestClient.post<string>(`${PREFIX}/manufacturing-orders/jobs`, { jobName, useOldJob });
export const importOrders = (ids: number[], syncTask = false) => requestClient.post<ImportTask>(`${PREFIX}/manufacturing-orders/import-tasks`, { ids, syncTask });
export const restartImportTask = (taskId: number) => requestClient.post<ImportTask>(`${PREFIX}/manufacturing-orders/import-tasks/${taskId}/restart`);
export const exportOrders = (params: Recordable<any>) => download(`${PREFIX}/manufacturing-orders/export`, params, '象屿宝元-生产订单.csv');

export const pageNests = (data: Recordable<any>) => requestClient.post<PageResult<Recordable<any>>>(`${PREFIX}/nests/page`, data);
export const sendNestFeedback = (ids: number[], productionWorkshopCode: string, materialReceived: boolean) =>
  requestClient.post(`${PREFIX}/nests/feedback`, { ids, materialReceived, productionWorkshopCode });
export const withdrawNestFeedback = (ids: number[]) => requestClient.post(`${PREFIX}/nests/feedback/withdraw`, { ids });
