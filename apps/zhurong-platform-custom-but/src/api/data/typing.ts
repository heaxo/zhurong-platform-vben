export interface ZhurongButSupplierinfoVO {
  /**
   *
   */
  id?: number;
  /**
   *
   */
  createdAt?: string;
  /**
   *
   */
  updatedAt?: string;
  /**
   *
   */
  createdBy?: number;
  /**
   *
   */
  updatedBy?: number;
  /**
   *
   */
  version?: number;
  /**
   *
   */
  isRead?: boolean;
  /**
   *
   */
  isReviewed?: boolean;
  /**
   *
   */
  nstRef?: string;
  /**
   *
   */
  supplierName?: string;
  /**
   *
   */
  whsName?: string;
  /**
   *
   */
  udata1?: string;
  /**
   *
   */
  udata2?: string;
  /**
   *
   */
  udata3?: string;
}

export interface ZhurongButSupplierinfoDTO {
  ids?:string[];
  /**
   *
   */
  nstRef?: string;
  /**
   *
   */
  supplierName?: string;
  /**
   *
   */
  whsName?: string;
  /**
   *
   */
  udata1?: string;
  /**
   *
   */
  udata2?: string;
  /**
   *
   */
  udata3?: string;
}

export interface ZhurongButSupplierinfoPageQuery {
  current?: number;
  size?: number;

  /**
   *
   */
  id?: number;
  /**
   *
   */
  nstRef?: string;
  /**
   *
   */
  supplierName?: string;
  /**
   *
   */
  whsName?: string;
  /**
   *
   */
  udata1?: string;
  /**
   *
   */
  udata2?: string;
  /**
   *
   */
  udata3?: string;
}
