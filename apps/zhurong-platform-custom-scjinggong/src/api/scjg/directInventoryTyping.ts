export interface ScjinggongInventoryDirectVO {
  invClassCode?: string;
  invClassName?: string;
  invCode?: string;
  invName?: string;
  invSize?: string;
  invMaterialCode?: string;
  invDensity?: number;
  invLong?: number;
  invThick?: number;
  invWide?: number;
}

/** U8库存接口当前支持的完整响应字段。 */
export interface U8InventoryResponse {
  itemid?: number;
  autoId?: number;
  cWhCode?: string;
  cInvCode?: string;
  iQuantity?: number;
  iSoType?: number;
  isodid?: string;
  enumname?: string;
  csocode?: string;
  isoseq?: number;
  cdemandmemo?: string;
}

export type ScjinggongInventoryDirectRow = Partial<U8InventoryResponse> &
  ScjinggongInventoryDirectVO;

export interface ScjinggongInventoryDirectPageQuery {
  page?: number;
  pageSize?: number;
  invCode?: string;
  invName?: string;
  invSize?: string;
  invMaterialCode?: string;
  invLongMin?: number;
  invLongMax?: number;
  invWideMin?: number;
  invWideMax?: number;
  invThickMin?: number;
  invThickMax?: number;
}

export type ScjinggongInventoryDirectImportDTO = ScjinggongInventoryDirectRow;

export interface PageResult<T> {
  items: T[];
  total: number;
  current: number;
  size: number;
}
