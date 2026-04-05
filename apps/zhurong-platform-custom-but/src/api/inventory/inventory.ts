import {CUSTOM_BASE_PREFIX, requestClient} from "#/api/request";
import type {Recordable} from '@vben/types';
import type {VimOrderlVO} from "#/api/order/typing";

async function requestGetAvailableInventoryQtyList(params: Recordable<any>) {
  return requestClient.get<Array<VimOrderlVO>>(`${CUSTOM_BASE_PREFIX}/sap/ava/inventoyrQty/list`, {
    params,
  });
}
async function requestImportInventory(data: Recordable<any>) {
  return requestClient.post<Array<VimOrderlVO>>(`${CUSTOM_BASE_PREFIX}/sap/ava/inventoyrQty/importInventory`, data);
}

export {
  requestGetAvailableInventoryQtyList,
  requestImportInventory,
}
