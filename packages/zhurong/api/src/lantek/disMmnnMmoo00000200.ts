import {CORE_BASE_PREFIX, requestClient} from "#/request";


async function requestGetJobRefs(params:any) {
  return requestClient.get<Array<string>>(`${CORE_BASE_PREFIX}/disMmnnMmoo00000200/getJobRefs`, {
    params,
  });
}

export {
  requestGetJobRefs,
}
