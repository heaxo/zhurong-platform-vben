import {CUSTOM_BASE_PREFIX, requestClient} from "@zhurong/api";


async function requestSyncReportedStatus(params:any) {
  return requestClient.get<Array<string>>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/sync_reported_status`, {
    params,
  });
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
