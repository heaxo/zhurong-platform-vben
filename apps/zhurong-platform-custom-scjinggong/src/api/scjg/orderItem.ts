import type {
  ZhurongScjinggongOrderitemDTO,
  ZhurongScjinggongOrderitemPageQuery,
  ZhurongScjinggongOrderitemVO,
} from '#/api';

import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';

type ZhurongScjinggongOrderitemImportToExpertDTO =
  ZhurongScjinggongOrderitemDTO & {
    ids: string[];
    jobName?: string;
    jobPath?: string;
    jobRef?: string;
  };

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

async function requestImportZhurongScjinggongOrderitemToExpert(
  data: ZhurongScjinggongOrderitemImportToExpertDTO,
) {
  return requestClient.post<boolean>(
    `${CUSTOM_BASE_PREFIX}/zhurongScjinggongOrderitem/importToExpert`,
    data,
  );
}

export {
  requestBatchRemoveZhurongScjinggongOrderitem,
  requestCreateZhurongScjinggongOrderitem,
  requestGetZhurongScjinggongOrderitemPage,
  requestImportZhurongScjinggongOrderitemToExpert,
  requestRemoveZhurongScjinggongOrderitem,
  requestUpdateZhurongScjinggongOrderitem,
  requestZhurongScjinggongOrderitemGetById,
};
