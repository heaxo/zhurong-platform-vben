import type {
  ZhurongScjinggongOrderDTO,
  ZhurongScjinggongOrderPageQuery,
  ZhurongScjinggongOrderVO,
} from '#/api';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

async function requestGetZhurongScjinggongOrderPage(
  params: ZhurongScjinggongOrderPageQuery,
) {
  return requestClient.get<any>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrder/page`,
    {
      params,
    },
  );
}

async function requestZhurongScjinggongOrderGetById(id: number | string) {
  return requestClient.get<ZhurongScjinggongOrderVO>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrder/getById`,
    {
      params: { id },
    },
  );
}

async function requestCreateZhurongScjinggongOrder(
  data: ZhurongScjinggongOrderDTO,
) {
  return requestClient.post<string>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrder/save`,
    data,
  );
}

async function requestUpdateZhurongScjinggongOrder(
  id: number | string,
  data: ZhurongScjinggongOrderDTO,
) {
  return requestClient.put<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrder/update`,
    data,
    {
      params: { id },
    },
  );
}

async function requestRemoveZhurongScjinggongOrder(id: number | string) {
  return requestClient.delete<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrder/remove`,
    {
      params: { id },
    },
  );
}

async function requestBatchRemoveZhurongScjinggongOrder(data: number[]) {
  return requestClient.delete<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrder/batchRemove`,
    {
      data,
    },
  );
}

export {
  requestBatchRemoveZhurongScjinggongOrder,
  requestCreateZhurongScjinggongOrder,
  requestGetZhurongScjinggongOrderPage,
  requestRemoveZhurongScjinggongOrder,
  requestUpdateZhurongScjinggongOrder,
  requestZhurongScjinggongOrderGetById,
};
