import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient,AUTH_BASE_PRIFIX } from '#/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>(`${AUTH_BASE_PRIFIX}/sysMenu/all`);
}
