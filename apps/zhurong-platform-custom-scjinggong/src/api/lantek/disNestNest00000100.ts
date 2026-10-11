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
async function requestFeedback(data: { recIds:number[] }) {
  return requestClient.post<boolean>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/feedback`, data);
}
async function requestWithdraw(data: { recIds:number[] }) {
  return requestClient.post<boolean>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/withdraw`, data);
}

export {
  requestSyncReportedStatus,
  requestBatchLocking,
  requestFeedback,
  requestWithdraw,
}
