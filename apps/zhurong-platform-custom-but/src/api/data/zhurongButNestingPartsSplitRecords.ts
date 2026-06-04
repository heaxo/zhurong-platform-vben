import {CUSTOM_BASE_PREFIX, requestClient} from '#/api/request';
import type {
  ZhurongButNestingPartsSplitRecordsDTO,
  ZhurongButNestingPartsSplitRecordsPageQuery, ZhurongButNestingPartsSplitRecordsVO,
} from '#/api';

async function requestGetZhurongButNestingPartsSplitRecordsPage(params: ZhurongButNestingPartsSplitRecordsPageQuery) {
  return requestClient.get<Array<ZhurongButNestingPartsSplitRecordsVO>>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/page`, {
    params,
  });
}

async function requestSplitRecordsOverwrite(data: {records: ZhurongButNestingPartsSplitRecordsDTO[]}) {
  return requestClient.post<string>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/splitRecordsOverwrite`, data);
}
async function requestOrderSplitting(data: {orgMnoRefs: string[]}) {
  return requestClient.post<string>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/orderSplitting`, data);
}


async function requestRemoveZhurongButNestingPartsSplitRecords(id: number | string) {
  return requestClient.delete<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/remove`, {
    params: { id },
  });
}

async function requestBatchRemoveZhurongButNestingPartsSplitRecords(data: string[]) {
  return requestClient.delete<boolean>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/batchRemove`, {
    data,
  });
}
export {
  requestGetZhurongButNestingPartsSplitRecordsPage,
  requestSplitRecordsOverwrite,
  requestOrderSplitting,

  requestRemoveZhurongButNestingPartsSplitRecords,
  requestBatchRemoveZhurongButNestingPartsSplitRecords
};
