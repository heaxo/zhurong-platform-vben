import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {OnActionClickFn, VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";
import {
  requestGetDisMmttMmtt00000100PageList,
  requestGetWwccWwcc00000100PageList
} from "@zhurong/api";
import {CompanyOptions} from "#/views/order/production/data";

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'company',
      label: $t('order.company'),
      componentProps:{
        options:CompanyOptions,
        allowClear: true,
        class: 'w-full',
        filterOption(input: string, option: { value: string }) {
          return option.value.toLowerCase().includes(input.toLowerCase());
        },
      }
    },
    {
      component: 'Input',
      fieldName: 'prdRef',
      label: "零件编号",
    },
    {
      component: 'Input',
      fieldName: 'mnORef',
      label: "订单编号",
    }, {
      component: 'ApiSelect',
      componentProps: {
        api: requestGetWwccWwcc00000100PageList,
        allowClear: true,
        labelField: 'wrkRef',
        valueField: 'wrkRef',
        resultField: 'items',
        showSearch: true,
        style: {
          width: '200px',
        }
      },
      fieldName: 'wrkRef',
      label: $t('lantek.wrkRef'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: requestGetDisMmttMmtt00000100PageList,
        allowClear: true,
        labelField: 'matRef',
        valueField: 'matRef',
        resultField: 'items',
        showSearch: true,
        style: {
          width: '200px',
        }
      },
      fieldName: 'DIS_MatRef',
      label: $t('lantek.matRef'),
    },
  ];
}

export function useColumns<T = VimOrderlVO>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [{
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
    {
      width: 70,
      type: 'seq',
    },{
      field: 'mnORef',
      title: "订单编号",
      width: 220,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    },{
      field: 'cusName',
      title: "物料编号",
      width: 220,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    },{
      field: 'a',
      title: "SAP分厂",
      width: 100,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
      formatter(){
        return '0'
      },
    },{
      field: 'b',
      title: "总成图号",
      width: 130,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
      formatter(){
        return '0'
      },
    },{
      field: 'c',
      title: "总长型号",
      width: 130,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
      formatter(){
        return '0'
      },
    },
    {
      field: 'prdRef',
      title: "零件编号",
      width: 200,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    },
    {
      field: 'prdNameDst',
      title: "零件名称",
      width: 200,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    },
    {
      field: 'dis_MatRef',
      title: "材质",
      width: 120,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'dis_Thickness',
      title: "厚度",
      width: 90,
      sortable: true,
      filters: [
        {
          data: {
            min: null,
            max: null,
          },
        },
      ],
      filterRender: {
        name: 'TableNumberRangeFilter',
      },
    },
    {
      field: 'wrkRef',
      title: "机床",
      width: 150,
      sortable: true,
      filters: [
        {
          data: null,
        },
      ],
      filterRender: {
        name: 'TableSelectFilter',
        source: 'column',
      },
    }, {
      field: 'aq',
      title: "数量",
      width: 100,
      sortable: true,
      filters: [
        {
          data: {
            min: null,
            max: null,
          },
        },
      ],
      filterRender: {
        name: 'TableNumberRangeFilter',
      },
    },   {
      field: 'rdate',
      title: "交货期",
      width: 160,
      sortable: true,
    }, {
      field: 'cusRef',
      title: "生产计划批注",
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'ordRef',
      title: "总成内码",
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'descrip',
      title: "公司",
      width: 150,
      sortable: true,
      filters: [
        {
          data: null,
        },
      ],
      filterRender: {
        name: 'TableSelectFilter',
        source: 'column',
      },
    },
  ]
}
