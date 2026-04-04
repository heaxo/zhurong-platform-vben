import {requestClient,CORE_BASE_PREFIX} from "#/request";

export interface JobBrowserTreeVO {
  id: string;
  parentId?: string;
  label: string;
  isFolder?: boolean;
  children?: JobBrowserTreeVO[];
}


async function requestGetJobBrowserTree() {
  return requestClient.get<Array<JobBrowserTreeVO>>(`${CORE_BASE_PREFIX}/disMmnnBwsr00000100/getJobBrowserTree`, {
  });
}

export {
  requestGetJobBrowserTree,
}
