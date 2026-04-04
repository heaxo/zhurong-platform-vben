import {CUSTOM_BASE_PREFIX, requestClient} from "#/api/request";
import type {Recordable} from '@vben/types';
import type {VimOrderlVO} from "#/api/order/typing";

async function requestGetViPmOrderlList(params: Recordable<any>) {
  return requestClient.get<Array<VimOrderlVO>>(`${CUSTOM_BASE_PREFIX}/erp/vi/pm/orderl/list`, {
    params,
  });
}

export {
  requestGetViPmOrderlList,
}
