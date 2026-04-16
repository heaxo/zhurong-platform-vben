import {CORE_BASE_PREFIX, requestClient} from "#/request";
import qs from 'qs';


async function requestPageNestOverview(params:any) {
  return requestClient.get<Array<string>>(`${CORE_BASE_PREFIX}/disNestNest00000100/pageNestOverview`, {
    params,
    paramsSerializer: params => qs.stringify(params, { allowDots: true }),
  });
}

export {
  requestPageNestOverview,
}
