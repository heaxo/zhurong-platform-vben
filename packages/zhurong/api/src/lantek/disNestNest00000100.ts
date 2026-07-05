import {CORE_BASE_PREFIX, requestClient} from "#/request";
import qs from 'qs';


async function requestPageNestOverview(data:any) {
  return requestClient.post<Array<string>>(`${CORE_BASE_PREFIX}/disNestNest00000100/pageNestOverview`, data);
}

export {
  requestPageNestOverview,
}
