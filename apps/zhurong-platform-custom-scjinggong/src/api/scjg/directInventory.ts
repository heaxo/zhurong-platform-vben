import type {
  PageResult,
  ScjinggongInventoryDirectImportDTO,
  ScjinggongInventoryDirectPageQuery,
  ScjinggongInventoryDirectVO,
  U8InventoryResponse,
} from './directInventoryTyping';

import {
  CLIENT_PROXY_BASE_PREFIX,
  CUSTOM_BASE_PREFIX,
  requestClient,
} from '#/api/request';

const CUSTOM_PREFIX = `${CUSTOM_BASE_PREFIX}/scjinggongInventoryDirect`;
const CLIENT_PREFIX = `${CLIENT_PROXY_BASE_PREFIX}/scjinggongInventoryDirect`;

/** 直接分页读取MES物料主数据视图。 */
function requestGetScjinggongInventoryDirectPage(
  params: ScjinggongInventoryDirectPageQuery,
) {
  return requestClient.get<PageResult<ScjinggongInventoryDirectVO>>(
    `${CUSTOM_PREFIX}/page`,
    { params },
  );
}

/** 使用当前页全部物料编码批量加载U8库存。 */
function requestLoadScjinggongInventoryDirectFromU8(inventoryCodes: string[]) {
  return requestClient.post<U8InventoryResponse[]>(
    `${CUSTOM_PREFIX}/loadFromU8`,
    {
      inventoryCodes,
    },
  );
}

/** 通过客户端代理直接导入Expert，不写入旧库存中间表。 */
function requestImportScjinggongInventoryDirectToExpert(
  data: ScjinggongInventoryDirectImportDTO[],
) {
  return requestClient.post<boolean>(`${CLIENT_PREFIX}/importToExpert`, data);
}

export {
  requestGetScjinggongInventoryDirectPage,
  requestImportScjinggongInventoryDirectToExpert,
  requestLoadScjinggongInventoryDirectFromU8,
};
