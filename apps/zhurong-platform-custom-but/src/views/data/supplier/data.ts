import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {ZhurongButSupplierinfoVO} from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'cnc',
      label: '下料程序名',
    },
    {
      component: 'Input',
      fieldName: 'whsName',
      label: '供应商编号',
    },
    {
      component: 'Input',
      fieldName: 'locName',
      label: '位置',
    },
    {
      component: 'Input',
      fieldName: 'shtRef',
      label: '钢板编码',
    },
    {
      component: 'Input',
      fieldName: 'shtName',
      label: '钢板名称',
    },
    {
      component: 'InputNumber',
      fieldName: 'quantity',
      label: '钢板张数',
    },
    {
      component: 'Input',
      fieldName: 'batchNumber',
      label: '钢板批号',
    },
    {
      component: 'Input',
      fieldName: 'businessType',
      label: '业务类型',
    },
  ];
}
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'cnc',
      label: '下料程序名',
    },
    {
      component: 'Input',
      fieldName: 'whsName',
      label: '供应商编号',
    },
    {
      component: 'Input',
      fieldName: 'locName',
      label: '位置',
    },
    {
      component: 'Select',
      fieldName: 'isRead',
      label: '更新状态',
      componentProps:{
        options:[{
          label:"全部",
          value: null,
        },{
          label:"已更新",
          value: true,
        },{
          label:"未更新",
          value: false,
        }]
      },
      defaultValue: false
    },
    {
      component: 'Input',
      fieldName: 'shtRef',
      label: '钢板编码',
    },
    {
      component: 'Input',
      fieldName: 'shtName',
      label: '钢板名称',
    },
    {
      component: 'InputNumber',
      fieldName: 'quantity',
      label: '钢板张数',
    },
    {
      component: 'Input',
      fieldName: 'batchNumber',
      label: '钢板批号',
    },
    {
      component: 'InputNumber',
      fieldName: 'weight',
      label: '钢板总重',
    },
    {
      component: 'Input',
      fieldName: 'unit',
      label: '单位',
    },
    {
      component: 'Input',
      fieldName: 'businessType',
      label: '业务类型',
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
      field: 'cnc',
      title: '下料程序名',
      width: 260,
      filters: [{data: ''}],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'whsName',
      title: '供应商编号',
      width: 150,
    },
    {
      field: 'locName',
      title: '位置',
      width: 260,
    },
    {
      field: 'shtRef',
      title: '钢板编码',
      width: 120,
    },
    {
      field: 'shtName',
      title: '钢板名称',
      width: 150,
    },
    {
      field: 'quantity',
      title: '钢板张数',
      width: 100,
    },
    {
      field: 'batchNumber',
      title: '钢板批号',
      width: 100,
    },
    {
      field: 'weight',
      title: '钢板总重',
      width: 100,
    },
    {
      field: 'unit',
      title: '单位',
      width: 80,
    },
    {
      field: 'businessType',
      title: '业务类型',
      width: 90,
    },
  ];
}
