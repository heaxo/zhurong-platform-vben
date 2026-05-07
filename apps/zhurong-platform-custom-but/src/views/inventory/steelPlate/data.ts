import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";
import {componentKeys} from "#/router/routes";
import {CompanyOptions} from "#/views/order/production/data";

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'company',
      label: $t('inventory.company'),
      componentProps:{
        options:CompanyOptions,
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
      field: 'itemCode',
      title: $t('inventory.itemCode'),
      width: 300,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
      sortable: true,
    },
    {
      field: 'company',
      title: $t('inventory.company'),
      width: 150,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
      sortable: true,
    },
    {
      field: 'itemName',
      title: $t('inventory.itemName'),
      width: 180,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'ubeasZnr',
      title: $t('inventory.ubeasZnr'),
      width: 120,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'uhd',
      title: $t('inventory.uhd'),
      width: 130,
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
      field: 'batchNum',
      title: $t('inventory.batchNum'),
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'quantity',
      title: $t('inventory.quantity'),
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
      field: 'width',
      title: $t('inventory.width'),
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
    }, {
      field: 'length',
      title: $t('inventory.length'),
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
    }, {
      field: 'whsName',
      title: $t('inventory.whsName'),
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'locName',
      title: $t('inventory.locName'),
      width: 150,
      sortable: true,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      },
    }, {
      field: 'weight',
      title: $t('inventory.weight'),
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
    }
  ];
}
