import type { Recordable } from '@vben/types';

import { downloadFileFromBlob } from '@vben/utils';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

const PREFIX = `${CUSTOM_BASE_PREFIX}/xybaoyuan`;

export type EntityId = string;

async function download(
  url: string,
  params: Recordable<any>,
  fileName: string,
) {
  const response = await requestClient.get<any>(url, {
    params,
    responseReturn: 'raw',
    responseType: 'blob',
  });
  downloadFileFromBlob({ fileName, source: response.data });
}

export interface PageResult<T> {
  current: number | string;
  items: T[];
  size: number | string;
  total: number | string;
}
export interface ImportTask {
  attempts: number;
  businessType: string;
  id: EntityId;
  message?: string;
  status: string;
}
export interface BasePart {
  drawingCode: string;
  id: EntityId;
  invalidState: boolean;
  matRef: string;
  partMaintenance: boolean;
  prdName: string;
  prdRef: string;
  thickness: number;
  udata1?: string;
  udata2?: string;
  udata3?: string;
}
export interface SteelPlate {
  id: EntityId;
  invalidState: boolean;
  lastTaskId?: EntityId;
  length: number;
  matRef: string;
  prdName: string;
  prdRef: string;
  quantity: number;
  sendState: boolean;
  specification?: string;
  stockName: string;
  stockNumber: string;
  task?: ImportTask;
  thickness: number;
  tons: number;
  width: number;
}
export interface ManufacturingOrder {
  cusRef: string;
  drawingCode?: string;
  id: EntityId;
  jobName?: string;
  jobRef?: string;
  lastTaskId?: EntityId;
  matRef: string;
  partMaintenance: boolean;
  prdName: string;
  prdRef: string;
  productionOrderErpInternalCode: string;
  productionOrderNumber: string;
  productionWorkshopName?: string;
  quantity: number;
  sendState: boolean;
  task?: ImportTask;
  thickness: number;
  workCenter?: string;
  wrkRef?: string;
}

export const pageBaseParts = (params: Recordable<any>) =>
  requestClient.get<PageResult<BasePart>>(`${PREFIX}/base-parts`, { params });
export const createBasePart = (data: Partial<BasePart>) =>
  requestClient.post<BasePart>(`${PREFIX}/base-parts`, data);
export const deleteBaseParts = (ids: EntityId[]) =>
  requestClient.delete(`${PREFIX}/base-parts`, { data: { ids } });
export const exportBaseParts = (params: Recordable<any>) =>
  download(`${PREFIX}/base-parts/export`, params, '象屿宝元-基础零件.csv');

export const pageSteelPlates = (params: Recordable<any>) =>
  requestClient.get<PageResult<SteelPlate>>(`${PREFIX}/steel-plates`, {
    params,
  });
export const syncErpSteelPlates = (data: Recordable<any>) =>
  requestClient.post<number>(`${PREFIX}/steel-plates/sync-erp`, data);
export const deleteSteelPlates = (ids: EntityId[]) =>
  requestClient.delete(`${PREFIX}/steel-plates`, { data: { ids } });
export const importSteelPlates = (ids: EntityId[]) =>
  requestClient.post<ImportTask>(`${PREFIX}/steel-plates/import`, { ids });
export const exportSteelPlates = (params: Recordable<any>) =>
  download(`${PREFIX}/steel-plates/export`, params, '象屿宝元-钢板.csv');

export const pageOrders = (params: Recordable<any>) =>
  requestClient.get<PageResult<ManufacturingOrder>>(
    `${PREFIX}/manufacturing-orders`,
    { params },
  );
export const updateOrders = (data: Recordable<any>[]) =>
  requestClient.put(`${PREFIX}/manufacturing-orders/batch`, data);
export const createJob = (jobName: string, jobPath: string) =>
  requestClient.post<string>(`${PREFIX}/manufacturing-orders/jobs`, {
    jobName,
    jobPath,
  });
export const importOrders = (ids: EntityId[]) =>
  requestClient.post<ImportTask>(`${PREFIX}/manufacturing-orders/import`, {
    ids,
  });
export const exportOrders = (params: Recordable<any>) =>
  download(
    `${PREFIX}/manufacturing-orders/export`,
    params,
    '象屿宝元-生产订单.csv',
  );

export const pageNests = (data: Recordable<any>) =>
  requestClient.post<PageResult<Recordable<any>>>(`${PREFIX}/nests/page`, data);
export const sendNestFeedback = (
  ids: EntityId[],
  productionWorkshopCode: string,
  materialReceived: boolean,
) =>
  requestClient.post(`${PREFIX}/nests/feedback`, {
    ids,
    materialReceived,
    productionWorkshopCode,
  });
export const withdrawNestFeedback = (ids: EntityId[]) =>
  requestClient.post(`${PREFIX}/nests/feedback/withdraw`, { ids });
