import {CORE_BASE_PREFIX, requestClient} from "#/request";


async function requestGetDisMmttMmtt00000100PageList(params:any) {
  return requestClient.get<Array<string>>(`${CORE_BASE_PREFIX}/disMmttMmtt00000100/page`, {
    params,
  });
}

export {
  requestGetDisMmttMmtt00000100PageList,
}
