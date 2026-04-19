import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {ZhurongButSupplierinfoVO} from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nstRef',
      label: '套料编码',
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商编码',
    },
    {
      component: 'Input',
      fieldName: 'whsName',
      label: '仓库编码',
    },
    {
      component: 'Input',
      fieldName: 'udata1',
      label: '自定义数据1',
    },
    {
      component: 'Input',
      fieldName: 'udata2',
      label: '自定义数据2',
    },
    {
      component: 'Input',
      fieldName: 'udata3',
      label: '自定义数据3',
    },
  ];
}
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nstRef',
      label: '套料编码',
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商编码',
    },
    {
      component: 'Input',
      fieldName: 'whsName',
      label: '仓库编码',
    },
    {
      component: 'Input',
      fieldName: 'udata1',
      label: '自定义数据1',
    },
    {
      component: 'Input',
      fieldName: 'udata2',
      label: '自定义数据2',
    },
    {
      component: 'Input',
      fieldName: 'udata3',
      label: '自定义数据3',
    },
  ];
}

export function useColumns<T = ZhurongButSupplierinfoVO>(): VxeTableGridOptions['columns'] {
  return [
    {
      align: 'left',
      type: 'checkbox',
      width: 30,
    },
    {
      field: 'nstRef',
      title: '套料编码',
      width: 200,
      filters: [{data: ''}],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'supplierName',
      title: '供应商编码',
      width: 200
    },
    {
      field: 'whsName',
      title: '仓库编码',
      width: 200
    },
    {
      field: 'udata1',
      title: '自定义数据1',
      width: 150
    },
    {
      field: 'udata2',
      title: '自定义数据2',
      width: 150
    },
    {
      field: 'udata3',
      title: '自定义数据3',
      width: 150
    },
  ];
}
