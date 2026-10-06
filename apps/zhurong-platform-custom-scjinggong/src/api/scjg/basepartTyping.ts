import type { Recordable } from '@vben/types';

export interface ZhurongScjinggongBasepartVO {
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
        * 物料编码
        */
        prdRef?: string;
        /**
        * 物料名称
        */
        prdName?: string;
        /**
        * 机床
        */
        wrkRef?: string;
        /**
        * 材质
        */
        matRef?: string;
        /**
        * 厚度
        */
        thickness?: number;
        /**
        * 数量
        */
        quantity?: number;
        /**
        * 层级
        */
        udata1?: string;
        /**
        * 客户件号
        */
        udata2?: string;
        /**
        * 物料参数
        */
        udata3?: string;
        /**
        * 工艺路线集合
        */
        udata4?: string;
        /**
        * 子件物料编码
        */
        udata5?: string;
        /**
        * 子件物料名称
        */
        udata6?: string;
        /**
        * 子件物料规格
        */
        udata7?: string;
        /**
        * 子件物料材质
        */
        udata8?: string;
        /**
        * 图纸路径
        */
        drawingPath?: string;
        /**
        * 原始图纸路径
        */
        rawDrawingPath?: string;
}

export interface ZhurongScjinggongBasepartDTO {
        /**
        * 
        */
        invalidState?: boolean;
        /**
        * 物料编码
        */
        prdRef?: string;
        /**
        * 物料名称
        */
        prdName?: string;
        /**
        * 机床
        */
        wrkRef?: string;
        /**
        * 材质
        */
        matRef?: string;
        /**
        * 厚度
        */
        thickness?: number;
        /**
        * 数量
        */
        quantity?: number;
        /**
        * 层级
        */
        udata1?: string;
        /**
        * 客户件号
        */
        udata2?: string;
        /**
        * 物料参数
        */
        udata3?: string;
        /**
        * 工艺路线集合
        */
        udata4?: string;
        /**
        * 子件物料编码
        */
        udata5?: string;
        /**
        * 子件物料名称
        */
        udata6?: string;
        /**
        * 子件物料规格
        */
        udata7?: string;
        /**
        * 子件物料材质
        */
        udata8?: string;
        /**
        * 图纸路径
        */
        drawingPath?: string;
        /**
        * 原始图纸路径
        */
        rawDrawingPath?: string;
}

export interface ZhurongScjinggongBasepartPageQuery {
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
        * 物料编码
        */
        prdRef?: string;
        /**
        * 物料名称
        */
        prdName?: string;
        /**
        * 机床
        */
        wrkRef?: string;
        /**
        * 材质
        */
        matRef?: string;
        /**
        * 厚度
        */
        thickness?: number;
        /**
        * 数量
        */
        quantity?: number;
        /**
        * 层级
        */
        udata1?: string;
        /**
        * 客户件号
        */
        udata2?: string;
        /**
        * 物料参数
        */
        udata3?: string;
        /**
        * 工艺路线集合
        */
        udata4?: string;
        /**
        * 子件物料编码
        */
        udata5?: string;
        /**
        * 子件物料名称
        */
        udata6?: string;
        /**
        * 子件物料规格
        */
        udata7?: string;
        /**
        * 子件物料材质
        */
        udata8?: string;
        /**
        * 图纸路径
        */
        drawingPath?: string;
        /**
        * 原始图纸路径
        */
        rawDrawingPath?: string;
}