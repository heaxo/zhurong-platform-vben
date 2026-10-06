import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ZhurongScjinggongBasepartVO } from '#/api';

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
        fieldName: 'prdName',
        label: 'prdName',
        },
        {
        component: 'Input',
        fieldName: 'wrkRef',
        label: 'wrkRef',
        },
        {
        component: 'Input',
        fieldName: 'matRef',
        label: 'matRef',
        },
        {
        component: 'InputNumber',
        fieldName: 'thickness',
        label: 'thickness',
        },
        {
        component: 'InputNumber',
        fieldName: 'quantity',
        label: 'quantity',
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
        fieldName: 'drawingPath',
        label: 'drawingPath',
        },
        {
        component: 'Input',
        fieldName: 'rawDrawingPath',
        label: 'rawDrawingPath',
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
        fieldName: 'prdName',
        label: 'prdName',
        },
        {
        component: 'Input',
        fieldName: 'wrkRef',
        label: 'wrkRef',
        },
        {
        component: 'Input',
        fieldName: 'matRef',
        label: 'matRef',
        },
        {
        component: 'InputNumber',
        fieldName: 'thickness',
        label: 'thickness',
        },
        {
        component: 'InputNumber',
        fieldName: 'quantity',
        label: 'quantity',
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
        fieldName: 'drawingPath',
        label: 'drawingPath',
        },
        {
        component: 'Input',
        fieldName: 'rawDrawingPath',
        label: 'rawDrawingPath',
        },
];
}

export function useColumns<T = ZhurongScjinggongBasepartVO>(): VxeTableGridOptions['columns'] {
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
        field: 'prdName',
        title: 'prdName',
        width: 150
        },
        {
        field: 'wrkRef',
        title: 'wrkRef',
        width: 150
        },
        {
        field: 'matRef',
        title: 'matRef',
        width: 150
        },
        {
        field: 'thickness',
        title: 'thickness',
        width: 150
        },
        {
        field: 'quantity',
        title: 'quantity',
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
        field: 'drawingPath',
        title: 'drawingPath',
        width: 150
        },
        {
        field: 'rawDrawingPath',
        title: 'rawDrawingPath',
        width: 150
        },
];
}