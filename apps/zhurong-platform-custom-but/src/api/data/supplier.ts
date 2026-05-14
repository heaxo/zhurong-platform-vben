import { CUSTOM_BASE_PREFIX, requestClient } from '#/api/request';
import type { ZhurongButSupplierinfoVO, ZhurongButSupplierinfoDTO, ZhurongButSupplierinfoPageQuery } from '#/api';

async function requestGetZhurongButSupplierinfoPage(params: ZhurongButSupplierinfoPageQuery) {
  return requestClient.get<any>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/page`, {
    params,
  });
}

async function requestZhurongButSupplierinfoGetById(id: number | string) {
  return requestClient.get<ZhurongButSupplierinfoVO>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/getById`, {
    params: { id },
  });
}

async function requestCreateZhurongButSupplierinfo(data: ZhurongButSupplierinfoDTO) {
  return requestClient.post<string>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/save`, data);
}

async function requestUpdateZhurongButSupplierinfo(id: number | string, data: ZhurongButSupplierinfoDTO) {
  return requestClient.put<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/update`, data, {
    params: { id },
  });
}

async function requestRemoveZhurongButSupplierinfo(id: number | string) {
  return requestClient.delete<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/remove`, {
    params: { id },
  });
}

async function requestBatchRemoveZhurongButSupplierinfo(data: number[]) {
  return requestClient.delete<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/batchRemove`, {
    data,
  });
}

async function requestSyncSupplierinfo(data: ZhurongButSupplierinfoDTO) {
  return requestClient.post<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/sync`, data);
}
async function requestUpdateUdata(data: ZhurongButSupplierinfoDTO) {
  return requestClient.post<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButSupplierinfo/updateUdata`, data);
}

export {
  requestGetZhurongButSupplierinfoPage,
  requestZhurongButSupplierinfoGetById,
  requestCreateZhurongButSupplierinfo,
  requestUpdateZhurongButSupplierinfo,
  requestRemoveZhurongButSupplierinfo,
  requestBatchRemoveZhurongButSupplierinfo,

  requestSyncSupplierinfo,
  requestUpdateUdata,
};
