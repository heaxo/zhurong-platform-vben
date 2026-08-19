import type { UserInfo } from '@vben/types';

import { AUTH_BASE_PRIFIX, requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo & { clientId?: string; id: string }>(
    `${AUTH_BASE_PRIFIX}/sysUser/info`,
  );
}
