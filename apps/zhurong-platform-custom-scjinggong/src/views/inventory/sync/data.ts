import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ZhurongScjinggongSteelplateinventoryVO } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
return [
        {
        component: 'Input',
        fieldName: 'shtRef',
        label: '钢板编码',
        },
        {
        component: 'Input',
        fieldName: 'matRef',
        label: '材质',
        },
        {
        component: 'InputNumber',
        fieldName: 'thickness',
        label: '厚度',
        },
        {
        component: 'InputNumber',
        fieldName: 'length',
        label: '长度',
        },
        {
        component: 'InputNumber',
        fieldName: 'width',
        label: '宽度',
        },
        {
        component: 'InputNumber',
        fieldName: 'quantity',
        label: '数量',
        },
        {
        component: 'Input',
        fieldName: 'udata1',
        label: '用户数据1',
        },
        {
        component: 'Input',
        fieldName: 'udata2',
        label: '用户数据2',
        },
        {
        component: 'Input',
        fieldName: 'udata3',
        label: '用户数据3',
        },
        {
        component: 'Input',
        fieldName: 'udata4',
        label: '用户数据4',
        },
        {
        component: 'Input',
        fieldName: 'udata5',
        label: '用户数据5',
        },
        {
        component: 'Input',
        fieldName: 'udata6',
        label: '用户数据6',
        },
        {
        component: 'Input',
        fieldName: 'udata7',
        label: '用户数据7',
        },
        {
        component: 'Input',
        fieldName: 'udata8',
        label: '用户数据8',
        },
        {
        component: 'Input',
        fieldName: 'udata9',
        label: '用户数据9',
        },
        {
        component: 'Input',
        fieldName: 'udata10',
        label: '用户数据10',
        },
        {
        component: 'Input',
        fieldName: 'udata11',
        label: '用户数据11',
        },
        {
        component: 'Input',
        fieldName: 'udata12',
        label: '用户数据12',
        },
        {
        component: 'Input',
        fieldName: 'udata13',
        label: '用户数据13',
        },
        {
        component: 'Input',
        fieldName: 'udata14',
        label: '用户数据14',
        },
        {
        component: 'Input',
        fieldName: 'udata15',
        label: '用户数据15',
        },
        {
        component: 'Input',
        fieldName: 'udata16',
        label: '用户数据16',
        },
        {
        component: 'Input',
        fieldName: 'udata17',
        label: '用户数据17',
        },
        {
        component: 'Input',
        fieldName: 'udata18',
        label: '用户数据18',
        },
        {
        component: 'Input',
        fieldName: 'udata19',
        label: '用户数据19',
        },
        {
        component: 'Input',
        fieldName: 'udata20',
        label: '用户数据20',
        },
];
}


export function useGridFormSchema(): VbenFormSchema[] {
return [
        {
        component: 'Input',
        fieldName: 'shtRef',
        label: '钢板编码',
        },
        {
        component: 'Input',
        fieldName: 'matRef',
        label: '材质',
        },
        {
        component: 'InputNumber',
        fieldName: 'thickness',
        label: '厚度',
        },
        {
        component: 'InputNumber',
        fieldName: 'length',
        label: '长度',
        },
        {
        component: 'InputNumber',
        fieldName: 'width',
        label: '宽度',
        },
        {
        component: 'InputNumber',
        fieldName: 'quantity',
        label: '数量',
        },
        {
        component: 'Input',
        fieldName: 'udata1',
        label: '用户数据1',
        },
        {
        component: 'Input',
        fieldName: 'udata2',
        label: '用户数据2',
        },
        {
        component: 'Input',
        fieldName: 'udata3',
        label: '用户数据3',
        },
        {
        component: 'Input',
        fieldName: 'udata4',
        label: '用户数据4',
        },
        {
        component: 'Input',
        fieldName: 'udata5',
        label: '用户数据5',
        },
        {
        component: 'Input',
        fieldName: 'udata6',
        label: '用户数据6',
        },
        {
        component: 'Input',
        fieldName: 'udata7',
        label: '用户数据7',
        },
        {
        component: 'Input',
        fieldName: 'udata8',
        label: '用户数据8',
        },
        {
        component: 'Input',
        fieldName: 'udata9',
        label: '用户数据9',
        },
        {
        component: 'Input',
        fieldName: 'udata10',
        label: '用户数据10',
        },
        {
        component: 'Input',
        fieldName: 'udata11',
        label: '用户数据11',
        },
        {
        component: 'Input',
        fieldName: 'udata12',
        label: '用户数据12',
        },
        {
        component: 'Input',
        fieldName: 'udata13',
        label: '用户数据13',
        },
        {
        component: 'Input',
        fieldName: 'udata14',
        label: '用户数据14',
        },
        {
        component: 'Input',
        fieldName: 'udata15',
        label: '用户数据15',
        },
        {
        component: 'Input',
        fieldName: 'udata16',
        label: '用户数据16',
        },
        {
        component: 'Input',
        fieldName: 'udata17',
        label: '用户数据17',
        },
        {
        component: 'Input',
        fieldName: 'udata18',
        label: '用户数据18',
        },
        {
        component: 'Input',
        fieldName: 'udata19',
        label: '用户数据19',
        },
        {
        component: 'Input',
        fieldName: 'udata20',
        label: '用户数据20',
        },
];
}

export function useColumns<T = ZhurongScjinggongSteelplateinventoryVO>(): VxeTableGridOptions['columns'] {
return [
{
align: 'left',
type: 'checkbox',
width: 30,
},
        {
        field: 'shtRef',
        title: '钢板编码',
        width: 150
        },
        {
        field: 'matRef',
        title: '材质',
        width: 100
        },
        {
        field: 'thickness',
        title: '厚度',
        width: 90
        },
        {
        field: 'length',
        title: '长度',
        width: 90
        },
        {
        field: 'width',
        title: '宽度',
        width: 90
        },
        {
        field: 'quantity',
        title: '数量',
        width: 90
        },
        {
        field: 'udata1',
        title: '用户数据1',
        width: 150
        },
        {
        field: 'udata2',
        title: '用户数据2',
        width: 150
        },
        {
        field: 'udata3',
        title: '用户数据3',
        width: 150
        },
        {
        field: 'udata4',
        title: '用户数据4',
        width: 150
        },
        {
        field: 'udata5',
        title: '用户数据5',
        width: 150
        },
        {
        field: 'udata6',
        title: '用户数据6',
        width: 150
        },
        {
        field: 'udata7',
        title: '用户数据7',
        width: 150
        },
        {
        field: 'udata8',
        title: '用户数据8',
        width: 150
        },
        {
        field: 'udata9',
        title: '用户数据9',
        width: 150
        },
        {
        field: 'udata10',
        title: '用户数据10',
        width: 150
        },
        {
        field: 'udata11',
        title: '用户数据11',
        width: 150
        },
        {
        field: 'udata12',
        title: '用户数据12',
        width: 150
        },
        {
        field: 'udata13',
        title: '用户数据13',
        width: 150
        },
        {
        field: 'udata14',
        title: '用户数据14',
        width: 150
        },
        {
        field: 'udata15',
        title: '用户数据15',
        width: 150
        },
        {
        field: 'udata16',
        title: '用户数据16',
        width: 150
        },
        {
        field: 'udata17',
        title: '用户数据17',
        width: 150
        },
        {
        field: 'udata18',
        title: '用户数据18',
        width: 150
        },
        {
        field: 'udata19',
        title: '用户数据19',
        width: 150
        },
        {
        field: 'udata20',
        title: '用户数据20',
        width: 150
        },
];
}
