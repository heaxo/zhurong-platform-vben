import {CUSTOM_BASE_PREFIX, requestClient} from "@zhurong/api";


async function requestSyncReportedStatus(data:any) {
  return requestClient.post<Array<string>>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/sync_reported_status`, data);
}

/**
 * 批量锁定
 * @param data
 */
async function requestBatchLocking(data: { recIds:number[] }) {
  return requestClient.put<boolean>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/batch_locking`, data);
}

export {
  requestSyncReportedStatus,
  requestBatchLocking,
}
