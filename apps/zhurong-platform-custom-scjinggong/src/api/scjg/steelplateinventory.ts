import type {
  ZhurongScjinggongSteelplateinventoryDTO,
  ZhurongScjinggongSteelplateinventoryPageQuery,
  ZhurongScjinggongSteelplateinventoryVO,
} from '#/api';

import {CLIENT_PROXY_BASE_PREFIX, CUSTOM_BASE_PREFIX, requestClient} from '#/api/request';

type ZhurongScjinggongSteelplateinventoryImportToExpertDTO =
  ZhurongScjinggongSteelplateinventoryDTO & {
    ids: string[];
  };

interface U8InventoryRequest {
  invcode: string;
}

const PREFIX = `${CLIENT_PROXY_BASE_PREFIX}/zhurongScjinggongSteelplateinventory`;
const PREFIX_CUSTOM = `${CUSTOM_BASE_PREFIX}/zhurongScjinggongSteelplateinventory`;

async function requestGetZhurongScjinggongSteelplateinventoryPage(
  params: ZhurongScjinggongSteelplateinventoryPageQuery,
) {
  return requestClient.get<any>(`${PREFIX_CUSTOM}/page`, {
    params,
  });
}

async function requestZhurongScjinggongSteelplateinventoryGetById(
  id: number | string,
) {
  return requestClient.get<ZhurongScjinggongSteelplateinventoryVO>(
    `${PREFIX_CUSTOM}/getById`,
    {
      params: { id },
    },
  );
}

async function requestCreateZhurongScjinggongSteelplateinventory(
  data: ZhurongScjinggongSteelplateinventoryDTO,
) {
  return requestClient.post<string>(`${PREFIX_CUSTOM}/save`, data);
}

async function requestUpdateZhurongScjinggongSteelplateinventory(
  id: number | string,
  data: ZhurongScjinggongSteelplateinventoryDTO,
) {
  return requestClient.put<boolean>(`${PREFIX_CUSTOM}/update`, data, {
    params: { id },
  });
}

async function requestRemoveZhurongScjinggongSteelplateinventory(
  id: number | string,
) {
  return requestClient.delete<boolean>(`${PREFIX_CUSTOM}/remove`, {
    params: { id },
  });
}

async function requestBatchRemoveZhurongScjinggongSteelplateinventory(
  data: number[],
) {
  return requestClient.delete<boolean>(`${PREFIX_CUSTOM}/batchRemove`, {
    data,
  });
}

async function requestSyncZhurongScjinggongSteelplateinventory(
  data: U8InventoryRequest,
) {
  return requestClient.post<boolean>(`${PREFIX_CUSTOM}/sync`, data);
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
