import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {ZhurongScjinggongBasepartVO} from '#/api';
import {
  getJobBrowserTree,
  pageMachineTools,
} from '@zhurong/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: '零件编码',
      label: '零件编码',
    },
    {
      component: 'Input',
      fieldName: '零件名称',
      label: '零件名称',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: pageMachineTools,
        class: 'w-full',
        filterOption(input: string, option: any) {
          return String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase());
        },
        labelField: 'wrkRef',
        params: { page: 1, pageSize: -1 },
        resultField: 'items',
        showSearch: true,
        valueField: 'wrkRef',
      },
      fieldName: 'wrkRef',
      label: '机床',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: '材质',
      label: '材质',
    },
    {
      component: 'InputNumber',
      fieldName: '厚度',
      label: '厚度',
    },
    {
      component: 'InputNumber',
      fieldName: '数量',
      label: '数量',
    },
    {
      component: 'Input',
      fieldName: 'udata1',
      label: '层级',
    },
    {
      component: 'Input',
      fieldName: 'udata2',
      label: '客户件号',
    },
    {
      component: 'Input',
      fieldName: 'udata3',
      label: '物料参数',
    },
    {
      component: 'Input',
      fieldName: 'udata4',
      label: '工艺路线集合',
    },
    {
      component: 'Input',
      fieldName: 'udata5',
      label: '子件物料编码',
    },
    {
      component: 'Input',
      fieldName: 'udata6',
      label: '子件物料名称',
    },
    {
      component: 'Input',
      fieldName: 'udata7',
      label: '子件物料规格',
    },
    {
      component: 'Input',
      fieldName: 'udata8',
      label: '子件物料材质',
    },
    {
      component: 'Input',
      fieldName: 'drawingPath',
      label: '图纸路径',
    },
    {
      component: 'Input',
      fieldName: 'rawDrawingPath',
      label: '原始图纸路径',
    },
  ];
}


export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: '零件编码',
      label: '零件编码',
    },
    {
      component: 'Input',
      fieldName: '零件名称',
      label: '零件名称',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: pageMachineTools,
        class: 'w-full',
        filterOption(input: string, option: any) {
          return String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase());
        },
        labelField: 'wrkRef',
        params: { page: 1, pageSize: -1 },
        resultField: 'items',
        showSearch: true,
        valueField: 'wrkRef',
      },
      fieldName: 'wrkRef',
      label: '机床',
    },
    {
      component: 'Input',
      fieldName: '材质',
      label: '材质',
    },
    {
      component: 'InputNumber',
      fieldName: '厚度',
      label: '厚度',
    },
    {
      component: 'InputNumber',
      fieldName: '数量',
      label: '数量',
    },
    {
      component: 'Input',
      fieldName: 'udata1',
      label: '层级',
    },
    {
      component: 'Input',
      fieldName: 'udata2',
      label: '客户件号',
    },
    {
      component: 'Input',
      fieldName: 'udata3',
      label: '物料参数',
    },
    {
      component: 'Input',
      fieldName: 'udata4',
      label: '工艺路线集合',
    },
    {
      component: 'Input',
      fieldName: 'udata5',
      label: '子件物料编码',
    },
    {
      component: 'Input',
      fieldName: 'udata6',
      label: '子件物料名称',
    },
    {
      component: 'Input',
      fieldName: 'udata7',
      label: '子件物料规格',
    },
    {
      component: 'Input',
      fieldName: 'udata8',
      label: '子件物料材质',
    },
    {
      component: 'Input',
      fieldName: 'drawingPath',
      label: '图纸路径',
    },
    {
      component: 'Input',
      fieldName: 'rawDrawingPath',
      label: '原始图纸路径',
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
      field: '零件编码',
      title: '零件编码',
      width: 150
    },
    {
      field: '零件名称',
      title: '零件名称',
      width: 150
    },
    {
      field: '机床',
      title: '机床',
      width: 120
    },
    {
      field: '材质',
      title: '材质',
      width: 120
    },
    {
      field: '厚度',
      title: '厚度',
      width: 100
    },
    {
      field: '数量',
      title: '数量',
      width: 100
    },
    {
      field: 'udata1',
      title: '层级',
      width: 150
    },
    {
      field: 'udata2',
      title: '客户件号',
      width: 150
    },
    {
      field: 'udata3',
      title: '物料参数',
      width: 150
    },
    {
      field: 'udata4',
      title: '工艺路线集合',
      width: 150
    },
    {
      field: 'udata5',
      title: '子件物料编码',
      width: 150
    },
    {
      field: 'udata6',
      title: '子件物料名称',
      width: 150
    },
    {
      field: 'udata7',
      title: '子件物料规格',
      width: 150
    },
    {
      field: 'udata8',
      title: '子件物料材质',
      width: 150
    },
    {
      field: 'drawingPath',
      title: '图纸路径',
      width: 150
    },
    {
      field: 'rawDrawingPath',
      title: '原始图纸路径',
      width: 150
    },
  ];
}
