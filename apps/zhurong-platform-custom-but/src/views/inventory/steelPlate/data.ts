import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'itemCode',
      label: $t('inventory.itemCode'),
    },
    {
      component: 'Input',
      fieldName: 'itemName',
      label: $t('inventory.itemName'),
    },
    {
      component: 'Input',
      fieldName: 'uBeasZnr',
      label: $t('inventory.uBeasZnr'),
    },
    {
      component: 'Input',
      fieldName: 'uHd',
      label: $t('inventory.uHd'),
    },
    {
      component: 'Input',
      fieldName: 'batchNum',
      label: $t('inventory.batchNum'),
    },
    {
      component: 'Input',
      fieldName: 'quantity',
      label: $t('inventory.quantity'),
    },
    {
      component: 'InputNumber',
      fieldName: 'width',
      label: $t('inventory.width'),
    },
    {
      component: 'InputNumber',
      fieldName: 'length',
      label: $t('inventory.length'),
    },
    {
      component: 'Input',
      fieldName: 'whsName',
      label: $t('inventory.whsName'),
    },
    {
      component: 'InputNumber',
      fieldName: 'weight',
      label: $t('inventory.weight'),
    },
  ];
}

export function useColumns<T = VimOrderlVO>(
): VxeTableGridOptions['columns'] {
  return [{
    align: 'left',
    type: 'checkbox',
    width: 30,
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
      field: 'weight',
      title: $t('inventory.weight'),
      width: 100,
    }
  ];
}
