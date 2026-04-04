import type { UserInfo } from '@vben/types';

import { requestClient,AUTH_BASE_PRIFIX } from '#/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>(`${AUTH_BASE_PRIFIX}/sysUser/info`);
}
