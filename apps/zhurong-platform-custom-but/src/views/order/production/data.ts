import type {VbenFormSchema} from "#/adapter/form";
import {$t} from '#/locales';
import type {OnActionClickFn, VxeTableGridOptions} from "#/adapter/vxe-table";
import type {VimOrderlVO} from "#/api/order/typing";

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'belposId',
      label: $t('order.belposId'),
    },
    {
      component: 'Input',
      fieldName: 'itemCode',
      label: $t('order.itemCode'),
    },
    {
      component: 'Input',
      fieldName: 'coutKey',
      label: $t('order.coutKey'),
    },
    {
      component: 'Input',
      fieldName: 'cfccad',
      label: $t('order.cfccad'),
    },
    {
      component: 'Input',
      fieldName: 'cfType',
      label: $t('order.cfType'),
    },
    {
      component: 'Input',
      fieldName: 'ccad',
      label: $t('order.ccad'),
    },
    {
      component: 'Input',
      fieldName: 'itemName',
      label: $t('order.itemName'),
    },
    {
      component: 'Input',
      fieldName: 'uznr',
      label: $t('order.uznr'),
    },
    {
      component: 'Input',
      fieldName: 'udf1',
      label: $t('order.udf1'),
    },
    {
      component: 'Input',
      fieldName: 'aplatzId',
      label: $t('order.aplatzId'),
    },
    {
      component: 'Input',
      fieldName: 'mengeVerbrauch',
      label: $t('order.mengeVerbrauch'),
    },
    {
      component: 'Input',
      fieldName: 'anfzeit',
      label: $t('order.anfzeit'),
    },
    {
      component: 'Input',
      fieldName: 'lieferdatum',
      label: $t('order.lieferdatum'),
    },
    {
      component: 'Input',
      fieldName: 'vversion',
      label: $t('order.vversion'),
    },
    {
      component: 'Input',
      fieldName: 'icadproduct',
      label: $t('order.icadproduct'),
    },
  ];
}

export function useColumns<T = VimOrderlVO>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [{
    align: 'left',
    type: 'checkbox',
    width: 30,
  },
    {
      field: 'belposId',
      title: $t('order.belposId'),
      width: 100,
    },
    {
      field: 'itemCode',
      title: $t('order.itemCode'),
      width: 120,
    }, {
      field: 'coutKey',
      title: $t('order.coutKey'),
      width: 100,
    }, {
      field: 'cfccad',
      title: $t('order.cfccad'),
      width: 100,
    }, {
      field: 'cfType',
      title: $t('order.cfType'),
      width: 120,
    }, {
      field: 'ccad',
      title: $t('order.ccad'),
      width: 150,
    }, {
      field: 'itemName',
      title: $t('order.itemName'),
      width: 150,
    }, {
      field: 'uznr',
      title: $t('order.uznr'),
      width: 90,
      sortable: true,
    }, {
      field: 'udf1',
      title: $t('order.udf1'),
      width: 80,
      sortable: true,
    }, {
      field: 'aplatzId',
      title: $t('order.aplatzId'),
      width: 100,
    }, {
      field: 'mengeVerbrauch',
      title: $t('order.mengeVerbrauch'),
      width: 90,
    }, {
      field: 'anfzeit',
      title: $t('order.anfzeit'),
      width: 120,
    }, {
      field: 'lieferdatum',
      title: $t('order.lieferdatum'),
      width: 120,
    }, {
      field: 'vversion',
      title: $t('order.vversion'),
      width: 100,
    }, {
      field: 'icadproduct',
      title: $t('order.icadproduct'),
      width: 100,
    }
  ];
}
