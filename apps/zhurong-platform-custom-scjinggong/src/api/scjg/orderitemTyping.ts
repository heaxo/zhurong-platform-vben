import type { Recordable } from '@vben/types';

export interface ZhurongScjinggongOrderitemVO {
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
        * 
        */
        prdRef?: string;
        /**
        * 
        */
        wrkRef?: string;
        /**
        * 
        */
        cusRef?: string;
        /**
        * 
        */
        ordRef?: string;
        /**
        * 
        */
        quantity?: number;
        /**
        * 订单交货日期
        */
        rdate?: string;
        /**
        * 加工中心编码
        */
        udata1?: string;
        /**
        * U8生产订单号
        */
        udata2?: string;
        /**
        * 收料仓库编码
        */
        udata3?: string;
        /**
        * 收料仓库名称
        */
        udata4?: string;
        /**
        * 工序行号
        */
        udata5?: string;
        /**
        * 工序编码
        */
        udata6?: string;
        /**
        * 工序名称
        */
        udata7?: string;
        /**
        * 班组编码
        */
        udata8?: string;
        /**
        * 班组名称
        */
        udata9?: string;
        /**
        * 计划完工时间
        */
        udata10?: string;
        /**
        * 订单变更后交期
        */
        udata11?: string;
        /**
        * 工单状态
        */
        udata12?: string;
        /**
        * 
        */
        orderId?: number;
}

export interface ZhurongScjinggongOrderitemDTO {
        /**
        * 
        */
        invalidState?: boolean;
        /**
        * 
        */
        prdRef?: string;
        /**
        * 
        */
        wrkRef?: string;
        /**
        * 
        */
        cusRef?: string;
        /**
        * 
        */
        ordRef?: string;
        /**
        * 
        */
        quantity?: number;
        /**
        * 订单交货日期
        */
        rdate?: string;
        /**
        * 加工中心编码
        */
        udata1?: string;
        /**
        * U8生产订单号
        */
        udata2?: string;
        /**
        * 收料仓库编码
        */
        udata3?: string;
        /**
        * 收料仓库名称
        */
        udata4?: string;
        /**
        * 工序行号
        */
        udata5?: string;
        /**
        * 工序编码
        */
        udata6?: string;
        /**
        * 工序名称
        */
        udata7?: string;
        /**
        * 班组编码
        */
        udata8?: string;
        /**
        * 班组名称
        */
        udata9?: string;
        /**
        * 计划完工时间
        */
        udata10?: string;
        /**
        * 订单变更后交期
        */
        udata11?: string;
        /**
        * 工单状态
        */
        udata12?: string;
        /**
        * 
        */
        orderId?: number;
}

export interface ZhurongScjinggongOrderitemPageQuery {
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
        * 
        */
        prdRef?: string;
        /**
        * 
        */
        wrkRef?: string;
        /**
        * 
        */
        cusRef?: string;
        /**
        * 
        */
        ordRef?: string;
        /**
        * 
        */
        quantity?: number;
        /**
        * 订单交货日期
        */
        rdate?: string;
        /**
        * 加工中心编码
        */
        udata1?: string;
        /**
        * U8生产订单号
        */
        udata2?: string;
        /**
        * 收料仓库编码
        */
        udata3?: string;
        /**
        * 收料仓库名称
        */
        udata4?: string;
        /**
        * 工序行号
        */
        udata5?: string;
        /**
        * 工序编码
        */
        udata6?: string;
        /**
        * 工序名称
        */
        udata7?: string;
        /**
        * 班组编码
        */
        udata8?: string;
        /**
        * 班组名称
        */
        udata9?: string;
        /**
        * 计划完工时间
        */
        udata10?: string;
        /**
        * 订单变更后交期
        */
        udata11?: string;
        /**
        * 工单状态
        */
        udata12?: string;
        /**
        * 
        */
        orderId?: number;
}