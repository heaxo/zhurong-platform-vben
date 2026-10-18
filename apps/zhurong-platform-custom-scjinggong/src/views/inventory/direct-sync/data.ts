import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ScjinggongInventoryDirectRow } from '#/api';

const inputProps = {
  allowClear: true,
  class: 'w-full',
};

const numberProps = {
  allowClear: true,
  class: 'w-full',
};

/** 新库存页查询条件：文本字段模糊匹配，长宽厚分别使用闭区间。 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: { ...inputProps, placeholder: '请输入物料编码' },
      fieldName: 'invCode',
      label: '物料编码',
    },
    {
      component: 'Input',
      componentProps: { ...inputProps, placeholder: '请输入物料名称' },
      fieldName: 'invName',
      label: '物料名称',
    },
    {
      component: 'Input',
      componentProps: { ...inputProps, placeholder: '请输入规格尺寸' },
      fieldName: 'invSize',
      label: '规格尺寸',
    },
    {
      component: 'Input',
      componentProps: { ...inputProps, placeholder: '请输入材质' },
      fieldName: 'invMaterialCode',
      label: '材质',
    },
    {
      component: 'InputNumber',
      componentProps: numberProps,
      fieldName: 'invLongMin',
      label: '长度最小值',
    },
    {
      component: 'InputNumber',
      componentProps: numberProps,
      fieldName: 'invLongMax',
      label: '长度最大值',
    },
    {
      component: 'InputNumber',
      componentProps: numberProps,
      fieldName: 'invWideMin',
      label: '宽度最小值',
    },
    {
      component: 'InputNumber',
      componentProps: numberProps,
      fieldName: 'invWideMax',
      label: '宽度最大值',
    },
    {
      component: 'InputNumber',
      componentProps: numberProps,
      fieldName: 'invThickMin',
      label: '厚度最小值',
    },
    {
      component: 'InputNumber',
      componentProps: numberProps,
      fieldName: 'invThickMax',
      label: '厚度最大值',
    },
  ];
}

/** 列顺序与V_BD_Inventory视图清单一致，末尾追加U8库存字段。 */
export function useColumns(): VxeTableGridOptions<ScjinggongInventoryDirectRow>['columns'] {
  return [
    { align: 'left', type: 'checkbox', width: 42 },
    { field: 'invClassCode', minWidth: 130, title: '存货分类编码' },
    { field: 'invClassName', minWidth: 140, title: '存货分类名称' },
    { field: 'invCode', minWidth: 150, title: '物料编码' },
    { field: 'invName', minWidth: 180, title: '物料名称' },
    { field: 'invSize', minWidth: 140, title: '规格尺寸' },
    { field: 'invMaterialCode', minWidth: 120, title: '存货材质' },
    { field: 'invDensity', minWidth: 130, title: '物料密度(g/cm³)' },
    { field: 'invLong', minWidth: 120, title: '长 展开长(mm)' },
    { field: 'invThick', minWidth: 120, title: '厚 展开厚(mm)' },
    { field: 'invWide', minWidth: 120, title: '宽 展开宽(mm)' },
    { field: 'iQuantity', minWidth: 110, title: '库存数量' },
    { field: 'cWhCode', minWidth: 110, title: '仓库编码' },
  ];
}
