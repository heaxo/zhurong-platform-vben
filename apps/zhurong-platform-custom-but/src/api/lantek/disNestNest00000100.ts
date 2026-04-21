import {CUSTOM_BASE_PREFIX, requestClient} from "@zhurong/api";


async function requestSyncReportedStatus(params:any) {
  return requestClient.get<Array<string>>(`${CUSTOM_BASE_PREFIX}/disNestNest00000100/sync_reported_status`, {
    params,
  });
}

export {
  requestSyncReportedStatus,
}
