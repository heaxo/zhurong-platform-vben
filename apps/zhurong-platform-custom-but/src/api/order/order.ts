import {CUSTOM_BASE_PREFIX, requestClient} from "#/api/request";
import type {Recordable} from '@vben/types';
import type {VimOrderlVO} from "#/api/order/typing";

async function requestGetViPmOrderlList(params: Recordable<any>) {
  return requestClient.get<Array<VimOrderlVO>>(`${CUSTOM_BASE_PREFIX}/erp/vi/pm/orderl/list`, {
    params,
  });
}

async function requestImportToExpert(data: Recordable<any>) {
  return requestClient.post<boolean>(`${CUSTOM_BASE_PREFIX}/erp/vi/pm/orderl/importToExpert`, data);
}
async function requestSpecifiedToExpertJob(data: Recordable<any>) {
  return requestClient.post<boolean>(`${CUSTOM_BASE_PREFIX}/erp/vi/pm/orderl/specifiedToExpertJob`, data);
}
async function requestGetReleaseItem(params: Recordable<any>) {
  return requestClient.get<Array<any>>(`${CUSTOM_BASE_PREFIX}/erp/vi/pm/orderl/getReleaseItem`, {
    params,
  });
}


export {
  requestGetViPmOrderlList,
  requestImportToExpert,
  requestSpecifiedToExpertJob,
  requestGetReleaseItem,
}
