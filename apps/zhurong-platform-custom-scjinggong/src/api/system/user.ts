import type { Recordable } from '@vben/types';

import { AUTH_BASE_PRIFIX, requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface CreateUser {
    clientId?: string;
    deptId?: string;
    password: string;
    realName: string;
    remark?: string;
    roleIds: string[];
    status: 0 | 1;
    username: string;
  }

  export interface SystemUser {
    clientId?: string;
    createTime?: string;
    id: string;
    lastLoginIp?: string;
    lastLoginTime?: string;
    realName?: string;
    remark?: string;
    status: 0 | 1;
    username: string;
  }
}

export async function createUser(data: SystemUserApi.CreateUser) {
  return requestClient.post<boolean>(
    `${AUTH_BASE_PRIFIX}/sysUser/create`,
    data,
  );
}

export async function getUserList(params: Recordable<any>) {
  return requestClient.get<Array<SystemUserApi.SystemUser>>(
    `${AUTH_BASE_PRIFIX}/sysUser/page`,
    { params },
  );
}

export async function updateUserClientId(id: string, clientId?: string) {
  return requestClient.put(`${AUTH_BASE_PRIFIX}/sysUser/${id}/client-binding`, {
    clientId: clientId?.trim() || null,
  });
}
