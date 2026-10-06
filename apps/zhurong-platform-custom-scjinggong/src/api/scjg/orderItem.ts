import type {
  ZhurongScjinggongOrderitemDTO,
  ZhurongScjinggongOrderitemPageQuery,
  ZhurongScjinggongOrderitemVO,
} from '#/api';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

async function requestGetZhurongScjinggongOrderitemPage(
  params: ZhurongScjinggongOrderitemPageQuery,
) {
  return requestClient.get<any>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/page`,
    {
      params,
    },
  );
}

async function requestZhurongScjinggongOrderitemGetById(id: number | string) {
  return requestClient.get<ZhurongScjinggongOrderitemVO>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/getById`,
    {
      params: { id },
    },
  );
}

async function requestCreateZhurongScjinggongOrderitem(
  data: ZhurongScjinggongOrderitemDTO,
) {
  return requestClient.post<string>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/save`,
    data,
  );
}

async function requestUpdateZhurongScjinggongOrderitem(
  id: number | string,
  data: ZhurongScjinggongOrderitemDTO,
) {
  return requestClient.put<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/update`,
    data,
    {
      params: { id },
    },
  );
}

async function requestRemoveZhurongScjinggongOrderitem(id: number | string) {
  return requestClient.delete<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/remove`,
    {
      params: { id },
    },
  );
}

async function requestBatchRemoveZhurongScjinggongOrderitem(data: number[]) {
  return requestClient.delete<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/batchRemove`,
    {
      data,
    },
  );
}

export {
  requestBatchRemoveZhurongScjinggongOrderitem,
  requestCreateZhurongScjinggongOrderitem,
  requestGetZhurongScjinggongOrderitemPage,
  requestRemoveZhurongScjinggongOrderitem,
  requestUpdateZhurongScjinggongOrderitem,
  requestZhurongScjinggongOrderitemGetById,
};
