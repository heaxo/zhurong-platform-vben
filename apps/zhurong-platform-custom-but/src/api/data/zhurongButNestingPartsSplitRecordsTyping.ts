import type { Recordable } from '@vben/types';

export interface ZhurongButNestingPartsSplitRecordsVO {
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
        mnoRef?: string;
        /**
        * 
        */
        oprId?: number;
        /**
        * 
        */
        quantity?: number;
        /**
        * 
        */
        remark?: string;
        /**
        * 
        */
        ordRef?: string;
        /**
        * 
        */
        recId?: number;
}

export interface ZhurongButNestingPartsSplitRecordsDTO {
        /**
        * 
        */
        nstRef?: string;
        /**
        * 
        */
        mnoRef?: string;
        /**
        * 
        */
        oprId?: number;
        /**
        * 
        */
        quantity?: number;
        /**
        * 
        */
        remark?: string;
        /**
        * 
        */
        ordRef?: string;
        /**
        * 
        */
        recId?: number;
}

export interface ZhurongButNestingPartsSplitRecordsPageQuery {
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
        mnoRef?: string;
        /**
        * 
        */
        oprId?: number;
        /**
        * 
        */
        quantity?: number;
        /**
        * 
        */
        remark?: string;
        /**
        * 
        */
        ordRef?: string;
        /**
        * 
        */
        recId?: number;
}