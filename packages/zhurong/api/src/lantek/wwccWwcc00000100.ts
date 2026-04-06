import {CORE_BASE_PREFIX, requestClient} from "#/request";


async function requestGetWwccWwcc00000100PageList(params:any) {
  return requestClient.get<Array<string>>(`${CORE_BASE_PREFIX}/wwccWwcc00000100/page`, {
    params,
  });
}

export {
  requestGetWwccWwcc00000100PageList,
}
