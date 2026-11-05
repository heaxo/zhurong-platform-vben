import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { z } from '#/adapter/form';
import { getTreeList } from '#/api/system/dept';
import { getRoleList } from '#/api/system/role';

export function useCreateFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: { maxlength: 100 },
      fieldName: 'username',
      label: '用户名',
      rules: z.string().trim().min(1, '请输入用户名').max(100),
    },
    {
      component: 'InputPassword',
      componentProps: { maxlength: 128 },
      fieldName: 'password',
      label: '初始密码',
      rules: z.string().min(6, '密码至少6位').max(128),
    },
    {
      component: 'Input',
      componentProps: { maxlength: 100 },
      fieldName: 'realName',
      label: '姓名',
      rules: z.string().trim().min(1, '请输入姓名').max(100),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        maxlength: 128,
        placeholder: '可选，输入客户端Windows主机名',
      },
      description: '保存时后端会自动去除首尾空格并转为大写。',
      fieldName: 'clientId',
      label: '客户端ID',
      rules: z.string().max(128).optional(),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getTreeList,
        childrenField: 'children',
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
      },
      fieldName: 'deptId',
      label: '部门',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getRoleList,
        class: 'w-full',
        labelField: 'name',
        mode: 'multiple',
        params: { page: 1, pageSize: -1, status: 1 },
        resultField: 'items',
        valueField: 'id',
      },
      fieldName: 'roleIds',
      label: '角色',
      rules: 'selectRequired',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Textarea',
      componentProps: { maxlength: 500, rows: 3, showCount: true },
      fieldName: 'remark',
      label: '备注',
      rules: z.string().max(500).optional(),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: { allowClear: true, placeholder: '请输入用户名' },
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      componentProps: { allowClear: true, placeholder: '请输入姓名' },
      fieldName: 'realName',
      label: '姓名',
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入Windows主机名',
      },
      fieldName: 'clientId',
      label: '客户端ID',
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemUserApi.SystemUser>,
): VxeTableGridOptions<SystemUserApi.SystemUser>['columns'] {
  return [
    { field: 'username', fixed: 'left', title: '用户名', width: 160 },
    { field: 'realName', title: '姓名', width: 160 },
    {
      field: 'clientId',
      minWidth: 220,
      title: '客户端ID（Windows主机名）',
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    { field: 'lastLoginIp', title: '最后登录IP', width: 150 },
    { field: 'lastLoginTime', title: '最后登录时间', width: 180 },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'username',
          nameTitle: '用户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit'],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 100,
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: { disabled: true },
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      componentProps: { disabled: true },
      fieldName: 'realName',
      label: '姓名',
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        maxlength: 128,
        placeholder: '请输入客户端电脑的Windows主机名',
      },
      description:
        '客户端启动后会以本机Windows主机名注册；此处不区分大小写，保存时后端统一转为大写。',
      fieldName: 'clientId',
      label: '客户端ID',
    },
  ];
}
