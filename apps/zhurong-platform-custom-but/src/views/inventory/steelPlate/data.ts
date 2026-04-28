import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'company',
      label: $t('inventory.company'),
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
      field: 'itemCode',
      title: $t('inventory.itemCode'),
      width: 300,
      filters: [
        { data: '' }
      ],
      filterRender: {
        name: 'TableTextFilterInput'
      }
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
      }
    },
    {
      field: 'itemName',
      title: $t('inventory.itemName'),
      width: 180,
    }, {
      field: 'ubeasZnr',
      title: $t('inventory.ubeasZnr'),
      width: 120,
    }, {
      field: 'uhd',
      title: $t('inventory.uhd'),
      width: 100,
    }, {
      field: 'batchNum',
      title: $t('inventory.batchNum'),
      width: 150,
    }, {
      field: 'quantity',
      title: $t('inventory.quantity'),
      width: 90,
    }, {
      field: 'width',
      title: $t('inventory.width'),
      width: 100,
    }, {
      field: 'length',
      title: $t('inventory.length'),
      width: 100,
    }, {
      field: 'whsName',
      title: $t('inventory.whsName'),
      width: 150,
    }, {
      field: 'locName',
      title: $t('inventory.locName'),
      width: 150,
    }, {
      field: 'weight',
      title: $t('inventory.weight'),
      width: 100,
    }
  ];
}
