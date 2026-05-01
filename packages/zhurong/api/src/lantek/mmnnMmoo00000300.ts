import {CORE_BASE_PREFIX, requestClient} from "#/request";


async function requestGetMmnnMmoo00000300PageList(params:any) {
  return requestClient.get<Array<string>>(`${CORE_BASE_PREFIX}/mmnnMmoo00000300/page`, {
    params,
  });
}

export {
  requestGetMmnnMmoo00000300PageList,
}
