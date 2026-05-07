import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {OnActionClickFn, VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";

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
      fieldName: 'company',
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
    },
    {
      field: 'company',
      title: $t('order.company'),
      width: 100,
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
    },{
      field: 'vversion',
      title: $t('order.vversion'),
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    },
    {
      field: 'belposId',
      title: $t('order.belposId'),
      width: 200,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    },
    {
      field: 'itemCode',
      title: $t('order.itemCode'),
      width: 120,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    }, {
      field: 'coutKey',
      title: $t('order.coutKey'),
      width: 150,
      sortable: true,
    }, {
      field: 'cfccad',
      title: $t('order.cfccad'),
      width: 130,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    }, {
      field: 'cfType',
      title: $t('order.cfType'),
      width: 120,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    }, {
      field: 'ccad',
      title: $t('order.ccad'),
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    }, {
      field: 'itemName',
      title: $t('order.itemName'),
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    }, {
      field: 'uznr',
      title: $t('order.uznr'),
      width: 90,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
    }, {
      field: 'udf1',
      title: $t('order.udf1'),
      width: 80,
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
    }, {
      field: 'aplatzId',
      title: $t('order.aplatzId'),
      width: 100,
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
      field: 'mengeVerbrauch',
      title: $t('order.mengeVerbrauch'),
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
    }, {
      field: 'anfzeit',
      title: $t('order.anfzeit'),
      width: 120,
      sortable: true,
    }, {
      field: 'lieferdatum',
      title: $t('order.lieferdatum'),
      width: 120,
      sortable: true,
    },  {
      field: 'icadproduct',
      title: $t('order.icadproduct'),
      width: 130,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }
  ];
}
