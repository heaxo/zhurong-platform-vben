<script lang="ts" setup>
import {defineComponent, h, type PropType, ref, watch} from 'vue';
import {
  type VxeGridListeners,
  type VxeGridProps,
  useVbenVxeGrid,
} from '#/adapter/vxe-table';
import {Space} from 'ant-design-vue';
import {merge} from 'lodash-es';
import {
  getImageResourcesBaseURL,
  requestGetDisMmttMmtt00000100PageList,
  requestGetWwccWwcc00000100PageList,
  requestPageNestOverview,
} from "@zhurong/api";
import {AttributeCell, type QueryOptions, type SimpleColumnSchema} from "#/nesting-table/index";
import {
  type DataTableColumnSchema,
  type GroupColumnSchema,
  useFieldRegistry
} from "#/nesting-table/data";
import {$t} from "@vben/locales";
import {VxeButton} from "vxe-pc-ui";

const props = defineProps({
  //表高度
  height: {
    type: String,
    default: null,
  },
  //自动表高度，可结合import {Page} from "@vben/common-ui"; <Page auto-content-height>
  autoHeight: {
    type: Boolean,
    default: false,
  },
  //自定义列
  columnsSchema: {
    type: Array as PropType<DataTableColumnSchema[]>,
    default: () => [],
  },
  //表格模式，组和常规
  mode: {
    type: String as PropType<'group' | 'flat'>,
    default: 'flat',
  },
  //查询关联数据选项
  loadPlan: {
    type: Object as PropType<QueryOptions>,
    default: {
      includeNestFiles: true,
      includeNestParts: true,
      includePartMaster: true,
      includePlanMaster: true,
    },
  },
  //开启复选框
  enableCheckbox: {
    type: Boolean,
    default: false,
  },
  //开启服务端排序
  enableServerSideSorting: {
    type: Boolean,
    default: false,
  },
  //显示搜索表格
  showSearchForm: {
    type: Boolean,
    default: false,
  },
  //查询参数
  queryParameters: {
    type: Object,
    default: {},
  },
  gridEvents: {
    type: Object,
    default: null,
  },
  nestPartsGridEvents: {
    type: Object as PropType<Partial<VxeGridListeners>>,
    default: null,
  },

  checkboxConfig: {
    type: Object,
    default: null,
  },
  nestPartsCheckboxConfig: {
    type: Object,
    default: null,
  },
  enableNestPartsCheckbox: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits<{
  nestPartCheckboxAll: [params: NestPartSelectionEventParams];
  nestPartCheckboxChange: [params: NestPartSelectionEventParams];
}>();
const {
  height,
  columnsSchema, mode, loadPlan, queryParameters, gridEvents,
  enableCheckbox, enableServerSideSorting, showSearchForm, checkboxConfig,
} = props;
type NestPartSelectionEventParams = {
  allRecIDs: any[];
  allRecIds: any[];
  allRecords: any[];
  params: any;
  recIDs: any[];
  recIds: any[];
  records: any[];
  row: any;
};

const NEST_PART_EXPAND_SLOT = 'nestPartsExpand';
const nestPartSelectedRecordMap = ref(new Map<any, any[]>());

const groupSortOrderRecord: Record<string, string> = {}
const NestPartsSubTable = defineComponent({
  name: 'NestPartsSubTable',
  props: {
    gridOptions: {
      type: Object as PropType<VxeGridProps>,
      required: true,
    },
  },
  emits: ['checkboxAll', 'checkboxChange'],
  setup(subProps, {emit}) {
    const [SubGrid, subGridApi] = useVbenVxeGrid({
      gridEvents: {
        checkboxAll: (params: any) => emit('checkboxAll', params),
        checkboxChange: (params: any) => emit('checkboxChange', params),
      },
      gridOptions: subProps.gridOptions,
    });

    watch(
      () => subProps.gridOptions,
      (gridOptions) => {
        subGridApi.setGridOptions(gridOptions ?? {});
      },
      {
        deep: true,
      },
    );

    return () => h(SubGrid);
  },
});
const fieldRegisterParams = {
  sortEvent: (field: string, order: string | null, e) => {
    const $table = gridApi.grid
    if ($table) {
      const sortConfs = {
        field,
        order: order === 'desc' ? 'asc' : (order === 'asc' ? null : 'desc')
      }
      console.log("排序",field,sortConfs.order)
      groupSortOrderRecord[field] = sortConfs.order;
      // 触发事件用 setSortByEvent
      $table.setSortByEvent(e, sortConfs, true)
    }
  },
}

function getNestParts(row: any) {
  return Array.isArray(row?.nestParts) ? row.nestParts : [];
}

function hasNestParts(row: any) {
  return getNestParts(row).length > 0;
}

function getNestPartRecID(row: any) {
  return row?.recID ?? row?.recId;
}

function getParentRowKey(row: any) {
  return row?.recID ?? row?.recId ?? row?.nstRef;
}

function getRecIDs(records: any[]) {
  return records.map(getNestPartRecID).filter((recID) => recID !== undefined && recID !== null);
}

function getAllNestPartSelectedRecords() {
  return [...nestPartSelectedRecordMap.value.values()].flat();
}

function getNestPartCheckboxConfig(row: any) {
  const selectedRecords = nestPartSelectedRecordMap.value.get(getParentRowKey(row)) ?? [];
  return {
    ...props.nestPartsCheckboxConfig,
    checkRowKeys: getRecIDs(selectedRecords),
  };
}

function getNestPartGridOptions(row: any): VxeGridProps {
  return {
    border: true,
    checkboxConfig: props.enableNestPartsCheckbox ? getNestPartCheckboxConfig(row) : undefined,
    columns: buildNestPartColumns(),
    data: getNestParts(row),
    maxHeight: 320,
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      keyField: 'recID',
    },
    showOverflow: 'ellipsis',
    size: 'mini',
    toolbarConfig: {
      enabled: false,
    },
  } as VxeGridProps;
}

function buildNestPartColumns() {
  const checkboxColumn = props.enableNestPartsCheckbox
    ? [{
      align: 'left',
      type: 'checkbox',
      width: 40,
    }]
    : [];

  return [
    ...checkboxColumn,
    {
      field: 'prdRefDst',
      title: '零件编码',
      minWidth: 140,
    },
    {
      field: 'mnORef',
      title: '工单编码',
      minWidth: 160,
    },
    {
      field: 'quantity',
      title: '套料数量',
      minWidth: 100,
    },
    {
      field: 'workOrder.rq',
      title: '计划数量',
      minWidth: 100,
    },
    {
      field: 'nstRef',
      title: '套料编码',
      minWidth: 180,
    },
  ] as any[];
}

function buildNestPartSelectionParams(row: any, params: any): NestPartSelectionEventParams {
  const records = params?.records ?? [];
  const allRecords = getAllNestPartSelectedRecords();
  const recIDs = getRecIDs(records);
  const allRecIDs = getRecIDs(allRecords);

  return {
    allRecIDs,
    allRecIds: allRecIDs,
    allRecords,
    params,
    recIDs,
    recIds: recIDs,
    records,
    row,
  };
}

function triggerNestPartCheckboxEvent(
  eventName: 'checkboxAll' | 'checkboxChange',
  row: any,
  params: any,
) {
  const parentKey = getParentRowKey(row);
  const records = params?.records ?? [];
  const nextMap = new Map(nestPartSelectedRecordMap.value);

  if (records.length) {
    nextMap.set(parentKey, records);
  } else {
    nextMap.delete(parentKey);
  }
  nestPartSelectedRecordMap.value = nextMap;

  const eventParams = buildNestPartSelectionParams(row, params);
  (props.nestPartsGridEvents?.[eventName] as any)?.(eventParams);

  if (eventName === 'checkboxAll') {
    emit('nestPartCheckboxAll', eventParams);
  } else {
    emit('nestPartCheckboxChange', eventParams);
  }
}

function onNestPartCheckboxChange(row: any, params: any) {
  triggerNestPartCheckboxEvent('checkboxChange', row, params);
}

function onNestPartCheckboxAll(row: any, params: any) {
  triggerNestPartCheckboxEvent('checkboxAll', row, params);
}

function clearNestPartSelection() {
  nestPartSelectedRecordMap.value = new Map();
}

function columnSort({column}, events) {
  return h(VxeButton, {
    mode: 'text',
    title: '点击排序',
    status: column.order ? 'primary' : '',
    icon:
      column.order === 'desc'
        ? 'vxe-icon-sort-alpha-desc'
        : 'vxe-icon-sort-alpha-asc',
    ...(events ?? {}),
  })
}

function sort(params) {
  const {column} = params;
  return columnSort(params, {
    onClick: (e) => {
      fieldRegisterParams.sortEvent && fieldRegisterParams.sortEvent(column.field, column.order, e)
    }
  })
}

const FIELD_REGISTRY = useFieldRegistry();
const DEFAULT_SCHEMA: SimpleColumnSchema[] = Object.keys(FIELD_REGISTRY).map(key => FIELD_REGISTRY[key]);
const DEFAULT_GROUP_SCHEMA: DataTableColumnSchema[] = [
  // 图片列
  FIELD_REGISTRY.image,
  // 套料信息
  {
    type: 'group',
    title: '套料信息',
    width: 220,
    schemas: [FIELD_REGISTRY.nstRef, FIELD_REGISTRY.crtDate, FIELD_REGISTRY.crtUser],
    override: {
      field: 'nstRef',
      sortable: true,
    }
  },

  // 机床信息
  {
    type: 'group',
    title: '机床信息',
    width: 190,
    schemas: [FIELD_REGISTRY.wrkRef, FIELD_REGISTRY.oprRef, FIELD_REGISTRY.cnc],
  },

  // 材料信息
  {
    type: 'group',
    title: '材料信息',
    width: 220,
    schemas: [FIELD_REGISTRY.matRef, FIELD_REGISTRY.shtRef, FIELD_REGISTRY.shtRefOrg],
  },

  // 尺寸信息
  {
    type: 'group',
    title: '尺寸信息',
    width: 120,
    schemas: [FIELD_REGISTRY.sLength, FIELD_REGISTRY.sWidth, FIELD_REGISTRY.sThickness],
  },

  // 面积信息
  {
    type: 'group',
    title: '面积信息',
    width: 220,
    schemas: [FIELD_REGISTRY.sArea, FIELD_REGISTRY.suArea, FIELD_REGISTRY.partArea],
  },

  // 重量信息
  {
    type: 'group',
    title: '重量信息',
    width: 220,
    schemas: [FIELD_REGISTRY.sWeight, FIELD_REGISTRY.suWeight, FIELD_REGISTRY.partWeight],
    override: {
      field: 'wrkRef',
      sortable: true,
    }
  },

  // 利用率
  {
    type: 'group',
    title: '利用率',
    width: 220,
    schemas: [FIELD_REGISTRY.sProfit, FIELD_REGISTRY.sProfitS]
  },
];

function resolveColumn(meta: any, override?: any) {
  return {
    field: meta.field,
    title: meta.title,

    ...override,
  };
}

function buildColumns(schema: DataTableColumnSchema[], mode: 'group' | 'flat') {

   //赋予排序能力
  for (let i = 0; i < schema.length; i++) {
    const scm = schema[i];
    if (scm.schemas && scm.schemas.length){
      for (let i = 0; i < scm.schemas.length; i++) {
        const scm2 = scm.schemas[i];
        scm2.override = {
          ...merge(scm2.override, {
            slots: {
              sort,
            }
          })
        }
      }
    }
  }

  const columns = schema.flatMap((col) => {

    // -----------------------
    // 单字段
    // -----------------------
    if (col.type === 'field') {
      const meta = FIELD_REGISTRY[col.field];

      return resolveColumn(meta, col.override);
    }

    // -----------------------
    // group
    // -----------------------
    const g = col as GroupColumnSchema;
    const metas = g.schemas;

    // flat模式
    if (mode === 'flat') {
      return metas.map(meta => resolveColumn(meta));
    }

    function groupSort(schemas) {
      return (params) => {
        const children = schemas.filter(schema => !!schema?.override?.slots?.sort)
          .map(schema => schema.override.slots.sort({
            column: {
              field: schema.field,
              order: groupSortOrderRecord[schema.field],
            }
          }));
        return h(Space, children);
      }
    }

    const override = merge({
      slots: {
        sort: g.override?.sortable ? groupSort(metas) : null,
        default: ({row}: any) => {
          return h(AttributeCell, buildAttributeProps(metas, row));
        },
      }
    }, g.override)
    // group模式
    const groupColumn: any = {
      title: g.title,
      width: g.width,
      showOverflow: false,
      ...override,
    };

    const resultColumns = [{
      ...groupColumn,
    }, ...metas.filter(schema => schema.field !== groupColumn.field).flatMap(schema => ({
      ...resolveColumn(schema),
      sortable: true,
      //隐藏这列，只为排序用
      visible: false,
    }))];
    console.log(resultColumns);
    return resultColumns;
  });
  const result = enableCheckbox ? [{
    align: 'left',
    type: 'checkbox',
    width: 30,
  }, ...columns] : columns;

  return [{
    slots: {
      content: NEST_PART_EXPAND_SLOT,
    },
    type: 'expand',
    width: 40,
  }, ...result];
}

function buildAttributeProps(metas, row) {
  const props: Record<string, any> = {};

  metas.forEach((meta, i) => {
    const index = i + 1;
    props[`label${index}`] = meta.title;
    props[`attribute${index}`] = row[meta.field];
  });

  return props;
}


const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    wrapperClass: 'grid-cols-4',
    schema: [
      {
        component: 'Input',
        fieldName: 'nstRef',
        label: '套料编码',
      },
      {
        component: 'Input',
        fieldName: 'cnc',
        label: 'CNC',
      },
      {
        component: 'Input',
        fieldName: 'jobRef',
        label: '作业编码',
      },
      {
        component: 'ApiSelect',
        componentProps: {
          api: requestGetWwccWwcc00000100PageList,
          allowClear: true,
          labelField: 'wrkRef',
          valueField: 'wrkRef',
          resultField: 'items',
          showSearch: true,
          style: {
            width: '100%',
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
            width: '100%',
          }
        },
        fieldName: 'matRef',
        label: $t('lantek.matRef'),
      },
      {
        component: 'InputNumber',
        fieldName: 'sThickness',
        label: '厚度',
      },
    ],
    showDefaultActions: true,
    collapsed: true,
  },
  showSearchForm: showSearchForm,
  gridEvents: gridEvents,
  gridOptions: {
    id: "nestingDataGridTable",
    customConfig: {
      storage: true,
    },
    cellConfig:{
      height: 100
    },
    checkboxConfig,
    expandConfig: {
      visibleMethod: ({row}: any) => hasNestParts(row),
    },
    showOverflow: 'ellipsis',
    sortConfig: {
      remote: enableServerSideSorting,
      multiple: true,
    },
    columns: buildColumns(
      columnsSchema?.length ? columnsSchema : mode === 'group' ? DEFAULT_GROUP_SCHEMA : DEFAULT_SCHEMA,
      mode
    ),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      sort: true,
      ajax: {
        query: async ({page, sorts}, formValues) => {
          const data = await requestPageNestOverview({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            ...queryParameters,
            sortRules: sorts.map(sort => ({property: sort.field, direction: sort.order})),
            loadPlan,
          });
          console.log(data);
          data.items?.forEach((it: any, index: number) => {
            if (it.nestingDocument) {
              it.image = getImageResourcesBaseURL(it.nestingDocument.imgb);
              console.log(it.nestingDocument, it.image);
              data.items[index].image = it.image;
            }
          });
          return data;
        },
      },
    },
    exportConfig: {},
    rowConfig: {
      keyField: 'recID',
    },
    toolbarConfig: {
      custom: true,
      export: true,
      search: true,
      zoom: true,
    },
  },
});
watch(() => columnsSchema, (columnsSchema) => {
  console.log(columnsSchema);
  gridApi.setGridOptions({
    columns: buildColumns(
      columnsSchema?.length ? columnsSchema : mode === 'group' ? DEFAULT_GROUP_SCHEMA : DEFAULT_SCHEMA,
      mode
    )
  })
})
watch(() => enableServerSideSorting, (enableServerSideSorting) => {
  console.log(enableServerSideSorting);
  gridApi.setGridOptions({
    sortConfig: {
      remote: enableServerSideSorting,
    }
  })
})

watch(() => props.queryParameters, (queryParameters) => {
  console.log(queryParameters);
  gridApi.query();
}, {
  deep: true
})

defineExpose({
  clearNestPartSelection,
  getNestPartSelectedRecords: getAllNestPartSelectedRecords,
  _gridApi: gridApi,
});
</script>

<template>
  <Grid>
    <template #nestPartsExpand="{ row }">
      <div class="nest-parts-sub-table">
        <NestPartsSubTable
          v-if="hasNestParts(row)"
          :grid-options="getNestPartGridOptions(row)"
          @checkbox-all="onNestPartCheckboxAll(row, $event)"
          @checkbox-change="onNestPartCheckboxChange(row, $event)"
        />
      </div>
    </template>
    <template #toolbar-actions>
      <slot name="toolbar-actions"></slot>
    </template>
  </Grid>
</template>

<style scoped>
.nest-parts-sub-table {
  padding: 8px 12px 12px 48px;
}

:deep(.dark .vxe-cell--checkbox) {
  color: white !important;
}
</style>
