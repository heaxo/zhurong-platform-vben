import type { Recordable } from '@vben/types';

import { CORE_BASE_PREFIX, requestClient } from '#/api/request';

export interface JobBrowserTreeNode {
  children?: JobBrowserTreeNode[];
  id: string;
  isFolder?: boolean;
  label: string;
  parentId?: string;
}

export interface MachineToolOption {
  descrip?: string;
  recID?: string;
  wrkRef: string;
}

export function getJobBrowserTree() {
  return requestClient.get<JobBrowserTreeNode[]>(
    `${CORE_BASE_PREFIX}/disMmnnBwsr00000100/getJobBrowserTree`,
  );
}

export function pageMachineTools(params: Recordable<any>) {
  return requestClient.get(`${CORE_BASE_PREFIX}/wwccWwcc00000100/page`, {
    params,
  });
}
