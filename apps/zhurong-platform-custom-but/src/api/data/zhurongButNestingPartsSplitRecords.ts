import {CUSTOM_BASE_PREFIX, requestClient} from '#/api/request';
import type {
  ZhurongButNestingPartsSplitRecordsDTO,
  ZhurongButNestingPartsSplitRecordsPageQuery,
} from '#/api';

async function requestGetZhurongButNestingPartsSplitRecordsPage(params: ZhurongButNestingPartsSplitRecordsPageQuery) {
  return requestClient.get<any>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/page`, {
    params,
  });
}

async function requestSplitRecordsOverwrite(data: {records: ZhurongButNestingPartsSplitRecordsDTO[]}) {
  return requestClient.post<string>(`${CUSTOM_BASE_PREFIX}/zhurongButNestingPartsSplitRecords/splitRecordsOverwrite`, data);
}

export {
  requestGetZhurongButNestingPartsSplitRecordsPage,
  requestSplitRecordsOverwrite,
};
