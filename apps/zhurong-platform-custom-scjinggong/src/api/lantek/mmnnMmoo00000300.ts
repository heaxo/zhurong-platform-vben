import {CUSTOM_BASE_PREFIX, requestClient} from "@zhurong/api";


async function requestGetMmnnMmoo00000300Page(params:any) {
  return requestClient.get<Array<string>>(`${CUSTOM_BASE_PREFIX}/mmnnMmoo00000300`, {
    params
  });
}


export {
  requestGetMmnnMmoo00000300Page,
}
