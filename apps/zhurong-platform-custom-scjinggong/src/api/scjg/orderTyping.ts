import type { Recordable } from '@vben/types';

export interface ZhurongScjinggongOrderVO {
        /**
        * 
        */
        id?: number;
        /**
        * 
        */
        version?: number;
        /**
        * 
        */
        createdBy?: number;
        /**
        * 
        */
        createdAt?: string;
        /**
        * 
        */
        updatedBy?: number;
        /**
        * 
        */
        updatedAt?: string;
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
        invalidState?: boolean;
        /**
        * 批次号
        */
        orderCode?: string;
        /**
        * 批次名
        */
        orderName?: string;
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
        /**
        * 
        */
        udata4?: string;
        /**
        * 
        */
        udata5?: string;
}

export interface ZhurongScjinggongOrderDTO {
        /**
        * 
        */
        invalidState?: boolean;
        /**
        * 批次号
        */
        orderCode?: string;
        /**
        * 批次名
        */
        orderName?: string;
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
        /**
        * 
        */
        udata4?: string;
        /**
        * 
        */
        udata5?: string;
}

export interface ZhurongScjinggongOrderPageQuery {
current?: number;
size?: number;

        /**
        * 
        */
        id?: number;
        /**
        * 
        */
        invalidState?: boolean;
        /**
        * 批次号
        */
        orderCode?: string;
        /**
        * 批次名
        */
        orderName?: string;
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
        /**
        * 
        */
        udata4?: string;
        /**
        * 
        */
        udata5?: string;
}