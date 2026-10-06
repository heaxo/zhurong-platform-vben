import type {
  ZhurongScjinggongBasepartDTO,
  ZhurongScjinggongBasepartPageQuery,
  ZhurongScjinggongBasepartVO,
} from '#/api';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

async function requestGetZhurongScjinggongBasepartPage(
  params: ZhurongScjinggongBasepartPageQuery,
) {
  return requestClient.get<any>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongBasepart/page`,
    {
      params,
    },
  );
}

async function requestZhurongScjinggongBasepartGetById(id: number | string) {
  return requestClient.get<ZhurongScjinggongBasepartVO>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongBasepart/getById`,
    {
      params: { id },
    },
  );
}

async function requestCreateZhurongScjinggongBasepart(
  data: ZhurongScjinggongBasepartDTO,
) {
  return requestClient.post<string>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongBasepart/save`,
    data,
  );
}

async function requestUpdateZhurongScjinggongBasepart(
  id: number | string,
  data: ZhurongScjinggongBasepartDTO,
) {
  return requestClient.put<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongBasepart/update`,
    data,
    {
      params: { id },
    },
  );
}

async function requestRemoveZhurongScjinggongBasepart(id: number | string) {
  return requestClient.delete<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongBasepart/remove`,
    {
      params: { id },
    },
  );
}

async function requestBatchRemoveZhurongScjinggongBasepart(data: number[]) {
  return requestClient.delete<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongBasepart/batchRemove`,
    {
      data,
    },
  );
}

export {
  requestBatchRemoveZhurongScjinggongBasepart,
  requestCreateZhurongScjinggongBasepart,
  requestGetZhurongScjinggongBasepartPage,
  requestRemoveZhurongScjinggongBasepart,
  requestUpdateZhurongScjinggongBasepart,
  requestZhurongScjinggongBasepartGetById,
};
