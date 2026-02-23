import type { RouteRecordStringComponent } from '@vben/types';

import { AUTH_BASE_PRIFIX } from '#/api';
import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>(`${AUTH_BASE_PRIFIX}/sysMenu/all`);
}
