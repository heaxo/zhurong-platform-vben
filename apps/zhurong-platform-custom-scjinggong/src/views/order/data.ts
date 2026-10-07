import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'orderCode',
      label: '批次号',
    },
    {
      component: 'Input',
      fieldName: 'orderName',
      label: '批次名',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'orderCode',
      label: '批次号',
    },
    {
      component: 'Input',
      fieldName: 'orderName',
      label: '批次名',
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      align: 'left',
      type: 'checkbox',
      width: 30,
    },

    {
      field: 'orderCode',
      title: '批次号',
      slots: { default: 'orderCode' },
    },
    {
      field: 'orderName',
      title: '批次名',
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 220,
    },
  ];
}
