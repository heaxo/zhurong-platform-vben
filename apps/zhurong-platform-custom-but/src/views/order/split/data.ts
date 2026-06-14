import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {OnActionClickFn, VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";
import {
  requestGetDisMmttMmtt00000100PageList,
  requestGetWwccWwcc00000100PageList
} from "@zhurong/api";
import type {ZhurongButNestingPartsSplitRecordsVO} from "#/api";
import {h} from "vue";
import {Tag} from "ant-design-vue";

export const CompanyOptions = [{
  label:"SBUT_ZN",
  value:"SBUT_ZN",
},{
  label:"BUT",
  value:"BUT",
}];
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'Descrip',
      label: $t('order.company'),
      componentProps:{
        options: CompanyOptions,
        allowClear: true,
        class: 'w-full',
        filterOption(input: string, option: { value: string }) {
          return option.value.toLowerCase().includes(input.toLowerCase());
        },
      }
    },
    {
      component: 'Input',
      fieldName: 'mnORef',
      label: $t('order.belposId'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: requestGetWwccWwcc00000100PageList,
        params:{
          pageSize:-1,
        },
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
        params:{
          pageSize:-1,
        },
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
    {
      component: 'Select',
      defaultValue: null,
      componentProps: {
        options: [{
          label:"已拆分",
          value: true
        },{
          label:"未拆分",
          value:false,
        }],
        allowClear: true,
        style: {
          width: '200px',
        }
      },
      fieldName: 'splitted',
      label: "拆分状态",
    },
  ];
}

export function useColumns<T = VimOrderlVO>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {

  const operationOptions:any[] = [];
  operationOptions.push({
    code: 'show',
    text: '拆单详情',
  });
  operationOptions.push({
    code: 'split',
    text: '一键拆单',
  });

  return [{
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
    {
      width: 70,
      type: 'seq',
    },
    {
      field: 'descrip',
      title: $t('order.company'),
      width: 100,
      sortable: true,
    },
    {
      field: 'mnORef',
      title: $t('order.belposId'),
      width: 240,
      sortable: true,
    },
    {
      field: 'cusName',
      title: $t('order.itemCode'),
      width: 220,
      sortable: true,
    }, {
      field: 'prdRef',
      title: $t('order.ccad'),
      width: 200,
      sortable: true,
    }, {
      field: 'rq',
      title: $t('order.mengeVerbrauch'),
      width: 90,
      sortable: true,
    },  {
      field: 'minQuan',
      title: $t('order.originQuantity'),
      width: 90,
      sortable: true,
    },{
      field: 'dis_MatRef',
      title: $t('order.uznr'),
      width: 120,
      sortable: true,
    }, {
      field: 'dis_Thickness',
      title: $t('order.udf1'),
      width: 90,
      sortable: true,
    }, {
      field: 'wrkRef',
      title: $t('order.aplatzId'),
      width: 150,
      sortable: true,
    },{
      field: 'ordRef',
      title: $t('order.icadproduct'),
      width: 180,
      sortable: true,
    },{
      field: 'lq',
      title: "拆分状态",
      width: 120,
      fixed: 'right',
      slots:{
        default({ row }){
          console.log(row);
          const stateMap = {
            true: { text: '已拆分', color: 'success' },
            false: { text: '未拆分', color: 'geekblue' }
          }
          const state = stateMap[row.lq > 0]

          return h(
            Tag,
            { color: state.color,bordered:false },
            () => state.text
          )
        }
      },
    },
    {
      align: 'center',
      field: 'operation',
      cellRender: {
        options: operationOptions,
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      fixed: 'right',
      title: $t('common.operation'),
      width: "auto",
    },
  ];
}

export function useNestingPartsSplitRecordColumns<T = ZhurongButNestingPartsSplitRecordsVO>({
                                                                                              onActionClick
                                                                                            }): VxeTableGridOptions['columns'] {
  const operationOptions:any[] = [];
  operationOptions.push('delete');
  return [{
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
    {
      width: 70,
      type: 'seq',
    },
    {
      field: 'nstRef',
      title: '套料编码',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'cnc',
      title: 'CNC',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'mnoRef',
      title: '订单号',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'orgMnoRef',
      title: '原始订单号',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'prdRef',
      title: '零件编码',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'TableTextFilterInput',
      }
    },
    {
      field: 'quantity',
      title: '数量',
      width: 150
    },
    {
      field: 'remark',
      title: '备注',
    },
    {
      align: 'center',
      field: 'operation',
      cellRender: {
        options: operationOptions,
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      fixed: 'right',
      title: $t('common.operation'),
      width: "auto",
    },
  ];
}
