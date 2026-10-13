import type {
  ZhurongScjinggongSteelplateinventoryDTO,
  ZhurongScjinggongSteelplateinventoryPageQuery,
  ZhurongScjinggongSteelplateinventoryVO,
} from '#/api';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

type ZhurongScjinggongSteelplateinventoryImportToExpertDTO =
  ZhurongScjinggongSteelplateinventoryDTO & {
    ids: string[];
  };

interface U8InventoryRequest {
  invcode: string;
}

const PREFIX = `${CUSTOM_BASE_PREFIX}/zhurongScjinggongSteelplateinventory`;

async function requestGetZhurongScjinggongSteelplateinventoryPage(
  params: ZhurongScjinggongSteelplateinventoryPageQuery,
) {
  return requestClient.get<any>(`${PREFIX}/page`, {
    params,
  });
}

async function requestZhurongScjinggongSteelplateinventoryGetById(
  id: number | string,
) {
  return requestClient.get<ZhurongScjinggongSteelplateinventoryVO>(
    `${PREFIX}/getById`,
    {
      params: { id },
    },
  );
}

async function requestCreateZhurongScjinggongSteelplateinventory(
  data: ZhurongScjinggongSteelplateinventoryDTO,
) {
  return requestClient.post<string>(`${PREFIX}/save`, data);
}

async function requestUpdateZhurongScjinggongSteelplateinventory(
  id: number | string,
  data: ZhurongScjinggongSteelplateinventoryDTO,
) {
  return requestClient.put<boolean>(`${PREFIX}/update`, data, {
    params: { id },
  });
}

async function requestRemoveZhurongScjinggongSteelplateinventory(
  id: number | string,
) {
  return requestClient.delete<boolean>(`${PREFIX}/remove`, {
    params: { id },
  });
}

async function requestBatchRemoveZhurongScjinggongSteelplateinventory(
  data: number[],
) {
  return requestClient.delete<boolean>(`${PREFIX}/batchRemove`, {
    data,
  });
}

async function requestSyncZhurongScjinggongSteelplateinventory(
  data: U8InventoryRequest,
) {
  return requestClient.post<boolean>(`${PREFIX}/sync`, data);
}

async function requestImportZhurongScjinggongSteelplateinventoryToExpert(
  data: ZhurongScjinggongSteelplateinventoryImportToExpertDTO,
) {
  return requestClient.post<boolean>(`${PREFIX}/importToExpert`, data);
}

export {
  requestBatchRemoveZhurongScjinggongSteelplateinventory,
  requestCreateZhurongScjinggongSteelplateinventory,
  requestGetZhurongScjinggongSteelplateinventoryPage,
  requestImportZhurongScjinggongSteelplateinventoryToExpert,
  requestRemoveZhurongScjinggongSteelplateinventory,
  requestSyncZhurongScjinggongSteelplateinventory,
  requestUpdateZhurongScjinggongSteelplateinventory,
  requestZhurongScjinggongSteelplateinventoryGetById,
};
