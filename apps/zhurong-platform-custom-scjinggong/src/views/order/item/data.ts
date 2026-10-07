import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {ZhurongScjinggongOrderitemVO} from '#/api';
import {
  getJobBrowserTree,
  pageMachineTools,
} from '@zhurong/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'prdRef',
      label: '零级编码',
    },
    {
      component: 'Input',
      fieldName: 'wrkRef',
      label: '机床',
    },
    {
      component: 'Input',
      fieldName: 'cusRef',
      label: 'MES工单号',
    },
    {
      component: 'Input',
      fieldName: 'ordRef',
      label: '生产批次号',
    },
    {
      component: 'InputNumber',
      fieldName: 'quantity',
      label: '工单数量',
    },
    {
      component: 'DatePicker',
      fieldName: 'rdate',
      label: '订单交货日期',
    },
    {
      component: 'Input',
      fieldName: 'udata1',
      label: '加工中心编码',
    },
    {
      component: 'Input',
      fieldName: 'udata2',
      label: 'U8生产订单号',
    },
    {
      component: 'Input',
      fieldName: 'udata3',
      label: '收料仓库编码',
    },
    {
      component: 'Input',
      fieldName: 'udata4',
      label: '收料仓库名称',
    },
    {
      component: 'Input',
      fieldName: 'udata5',
      label: '工序行号',
    },
    {
      component: 'Input',
      fieldName: 'udata6',
      label: '工序编码',
    },
    {
      component: 'Input',
      fieldName: 'udata7',
      label: '工序名称',
    },
    {
      component: 'Input',
      fieldName: 'udata8',
      label: '工序名称',
    },
    {
      component: 'Input',
      fieldName: 'udata9',
      label: '班组编码',
    },
    {
      component: 'Input',
      fieldName: 'udata10',
      label: '计划完工时间',
    },
    {
      component: 'Input',
      fieldName: 'udata11',
      label: '订单变更后交期',
    },
    {
      component: 'Input',
      fieldName: 'udata12',
      label: '工单状态',
    },
  ];
}


export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'prdRef',
      label: '零级编码',
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
      component: 'Select',
      fieldName: 'isRead',
      label: '导入状态',
      defaultValue: false,
      componentProps: {
        options: [
          {
            label: '全部',
            value: null,
          },
          {
            label: '未导入',
            value: false,
          },
          {
            label: '已导入',
            value: true,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'cusRef',
      label: 'MES工单号',
    },
    {
      component: 'Input',
      fieldName: 'ordRef',
      label: '生产批次号',
    },
    {
      component: 'InputNumber',
      fieldName: 'quantity',
      label: '工单数量',
    },
    {
      component: 'Input',
      fieldName: 'rdate',
      label: '订单交货日期',
    },
    {
      component: 'Input',
      fieldName: 'udata1',
      label: '加工中心编码',
    },
    {
      component: 'Input',
      fieldName: 'udata2',
      label: 'U8生产订单号',
    },
    {
      component: 'Input',
      fieldName: 'udata3',
      label: '收料仓库编码',
    },
    {
      component: 'Input',
      fieldName: 'udata4',
      label: '收料仓库名称',
    },
    {
      component: 'Input',
      fieldName: 'udata5',
      label: '工序行号',
    },
    {
      component: 'Input',
      fieldName: 'udata6',
      label: '工序编码',
    },
    {
      component: 'Input',
      fieldName: 'udata7',
      label: '工序名称',
    },
    {
      component: 'Input',
      fieldName: 'udata8',
      label: '工序名称',
    },
    {
      component: 'Input',
      fieldName: 'udata9',
      label: '班组编码',
    },
    {
      component: 'Input',
      fieldName: 'udata10',
      label: '计划完工时间',
    },
    {
      component: 'Input',
      fieldName: 'udata11',
      label: '订单变更后交期',
    },
    {
      component: 'Input',
      fieldName: 'udata12',
      label: '工单状态',
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
      field: 'prdRef',
      title: '零级编码',
      width: 150
    },

    {
      field: 'wrkRef',
      title: '机床',
      width: 150
    },
    {
      field: 'cusRef',
      title: 'MES工单号',
      width: 150
    },
    {
      field: 'ordRef',
      title: '生产批次号',
      width: 150
    },
    {
      field: 'quantity',
      title: '工单数量',
      width: 100
    },
    {
      field: 'rdate',
      title: '订单交货日期',
      width: 150
    },
    {
      field: 'udata1',
      title: '加工中心编码',
      width: 150
    },
    {
      field: 'udata2',
      title: 'U8生产订单号',
      width: 150
    },
    {
      field: 'udata3',
      title: '收料仓库编码',
      width: 150
    },
    {
      field: 'udata4',
      title: '收料仓库名称',
      width: 150
    },
    {
      field: 'udata5',
      title: '工序行号',
      width: 150
    },
    {
      field: 'udata6',
      title: '工序编码',
      width: 150
    },
    {
      field: 'udata7',
      title: '工序名称',
      width: 150
    },
    {
      field: 'udata8',
      title: '工序名称',
      width: 150
    },
    {
      field: 'udata9',
      title: '班组编码',
      width: 150
    },
    {
      field: 'udata10',
      title: '计划完工时间',
      width: 150
    },
    {
      field: 'udata11',
      title: '订单变更后交期',
      width: 150
    },
    {
      field: 'udata12',
      title: '工单状态',
      width: 150
    },
    {
      field: 'partIssued',
      title: '零件基础数据',
      width: 100,
      slots: { default: 'partIssued' },
      fixed: 'right',
    },
  ];
}
