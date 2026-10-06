import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ZhurongScjinggongOrderitemVO } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
return [
        {
        component: 'Input',
        fieldName: 'invalidState',
        label: 'invalidState',
        },
        {
        component: 'Input',
        fieldName: 'prdRef',
        label: 'prdRef',
        },
        {
        component: 'Input',
        fieldName: 'wrkRef',
        label: 'wrkRef',
        },
        {
        component: 'Input',
        fieldName: 'cusRef',
        label: 'cusRef',
        },
        {
        component: 'Input',
        fieldName: 'ordRef',
        label: 'ordRef',
        },
        {
        component: 'InputNumber',
        fieldName: 'quantity',
        label: 'quantity',
        },
        {
        component: 'DatePicker',
        fieldName: 'rdate',
        label: 'rdate',
        },
        {
        component: 'Input',
        fieldName: 'udata1',
        label: 'udata1',
        },
        {
        component: 'Input',
        fieldName: 'udata2',
        label: 'udata2',
        },
        {
        component: 'Input',
        fieldName: 'udata3',
        label: 'udata3',
        },
        {
        component: 'Input',
        fieldName: 'udata4',
        label: 'udata4',
        },
        {
        component: 'Input',
        fieldName: 'udata5',
        label: 'udata5',
        },
        {
        component: 'Input',
        fieldName: 'udata6',
        label: 'udata6',
        },
        {
        component: 'Input',
        fieldName: 'udata7',
        label: 'udata7',
        },
        {
        component: 'Input',
        fieldName: 'udata8',
        label: 'udata8',
        },
        {
        component: 'Input',
        fieldName: 'udata9',
        label: 'udata9',
        },
        {
        component: 'Input',
        fieldName: 'udata10',
        label: 'udata10',
        },
        {
        component: 'Input',
        fieldName: 'udata11',
        label: 'udata11',
        },
        {
        component: 'Input',
        fieldName: 'udata12',
        label: 'udata12',
        },
        {
        component: 'InputNumber',
        fieldName: 'orderId',
        label: 'orderId',
        },
];
}


export function useGridFormSchema(): VbenFormSchema[] {
return [
        {
        component: 'Input',
        fieldName: 'invalidState',
        label: 'invalidState',
        },
        {
        component: 'Input',
        fieldName: 'prdRef',
        label: 'prdRef',
        },
        {
        component: 'Input',
        fieldName: 'wrkRef',
        label: 'wrkRef',
        },
        {
        component: 'Input',
        fieldName: 'cusRef',
        label: 'cusRef',
        },
        {
        component: 'Input',
        fieldName: 'ordRef',
        label: 'ordRef',
        },
        {
        component: 'InputNumber',
        fieldName: 'quantity',
        label: 'quantity',
        },
        {
        component: 'Input',
        fieldName: 'rdate',
        label: 'rdate',
        },
        {
        component: 'Input',
        fieldName: 'udata1',
        label: 'udata1',
        },
        {
        component: 'Input',
        fieldName: 'udata2',
        label: 'udata2',
        },
        {
        component: 'Input',
        fieldName: 'udata3',
        label: 'udata3',
        },
        {
        component: 'Input',
        fieldName: 'udata4',
        label: 'udata4',
        },
        {
        component: 'Input',
        fieldName: 'udata5',
        label: 'udata5',
        },
        {
        component: 'Input',
        fieldName: 'udata6',
        label: 'udata6',
        },
        {
        component: 'Input',
        fieldName: 'udata7',
        label: 'udata7',
        },
        {
        component: 'Input',
        fieldName: 'udata8',
        label: 'udata8',
        },
        {
        component: 'Input',
        fieldName: 'udata9',
        label: 'udata9',
        },
        {
        component: 'Input',
        fieldName: 'udata10',
        label: 'udata10',
        },
        {
        component: 'Input',
        fieldName: 'udata11',
        label: 'udata11',
        },
        {
        component: 'Input',
        fieldName: 'udata12',
        label: 'udata12',
        },
        {
        component: 'InputNumber',
        fieldName: 'orderId',
        label: 'orderId',
        },
];
}

export function useColumns<T = ZhurongScjinggongOrderitemVO>(): VxeTableGridOptions['columns'] {
return [
{
align: 'left',
type: 'checkbox',
width: 30,
},
        {
        field: 'invalidState',
        title: 'invalidState',
        width: 150,
        filters: [{ data: '' }],
        filterRender: {
        name: 'TableTextFilterInput',
        }
        },
        {
        field: 'prdRef',
        title: 'prdRef',
        width: 150
        },
        {
        field: 'wrkRef',
        title: 'wrkRef',
        width: 150
        },
        {
        field: 'cusRef',
        title: 'cusRef',
        width: 150
        },
        {
        field: 'ordRef',
        title: 'ordRef',
        width: 150
        },
        {
        field: 'quantity',
        title: 'quantity',
        width: 150
        },
        {
        field: 'rdate',
        title: 'rdate',
        width: 150
        },
        {
        field: 'udata1',
        title: 'udata1',
        width: 150
        },
        {
        field: 'udata2',
        title: 'udata2',
        width: 150
        },
        {
        field: 'udata3',
        title: 'udata3',
        width: 150
        },
        {
        field: 'udata4',
        title: 'udata4',
        width: 150
        },
        {
        field: 'udata5',
        title: 'udata5',
        width: 150
        },
        {
        field: 'udata6',
        title: 'udata6',
        width: 150
        },
        {
        field: 'udata7',
        title: 'udata7',
        width: 150
        },
        {
        field: 'udata8',
        title: 'udata8',
        width: 150
        },
        {
        field: 'udata9',
        title: 'udata9',
        width: 150
        },
        {
        field: 'udata10',
        title: 'udata10',
        width: 150
        },
        {
        field: 'udata11',
        title: 'udata11',
        width: 150
        },
        {
        field: 'udata12',
        title: 'udata12',
        width: 150
        },
        {
        field: 'orderId',
        title: 'orderId',
        width: 150
        },
];
}