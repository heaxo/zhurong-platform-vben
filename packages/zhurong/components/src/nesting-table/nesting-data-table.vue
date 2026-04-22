<script lang="ts" setup>
import {h, type PropType, watch} from 'vue';
import {useVbenVxeGrid,} from '#/adapter/vxe-table';
import {
  Space
} from 'ant-design-vue';
import {
  merge
} from 'lodash-es';
import {
  getImageResourcesBaseURL,
  requestGetDisMmttMmtt00000100PageList, requestGetWwccWwcc00000100PageList,
  requestPageNestOverview,
} from "@zhurong/api";
import {AttributeCell, type QueryOptions, type SimpleColumnSchema} from "#/nesting-table/index";
import {
  type DataTableColumnSchema,
  useFieldRegistry,
  type GroupColumnSchema
} from "#/nesting-table/data";
import {$t} from "@vben/locales";

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
  enableCheckbox:{
    type: Boolean,
    default: false,
  },
  //开启服务端排序
  enableServerSideSorting:{
    type: Boolean,
    default: false,
  },
  //显示搜索表格
  showSearchForm:{
    type: Boolean,
    default: false,
  },
  //查询参数
  queryParameters:{
    type: Object,
    default: {},
  },
  gridEvents:{
    type: Object,
    default: null,
  },

  checkboxConfig:{
    type: Object,
    default: null,
  },
})
const {
  height,
  columnsSchema, mode, loadPlan,queryParameters,gridEvents,
  enableCheckbox,enableServerSideSorting,showSearchForm,checkboxConfig,
} = props;
const groupSortOrderRecord:Record<string, string> = {

}
const fieldRegisterParams = {
  sortEvent:(field: string, order: string | null,e) => {
    const $table = gridApi.grid
    if ($table) {
      const sortConfs = {
        field,
          order: order === 'desc' ? 'asc' : (order === 'asc' ? null : 'desc')
      }
      groupSortOrderRecord[field] = sortConfs.order;
        // 触发事件用 setSortByEvent
      $table.setSortByEvent(e, sortConfs, true)
    }
  },
}
const FIELD_REGISTRY = useFieldRegistry(fieldRegisterParams);
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
    override:{
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
    override:{
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
        return h(Space,children);
      }
    }
    const override = merge({
      slots: {
        sort: g.override?.sortable ? groupSort(metas) : null,
        default: ({row}: any) => {
          return h(AttributeCell, buildAttributeProps(metas, row));
        },
      }
    },g.override)
    // group模式
    const groupColumn: any = {
      title: g.title,
      width: g.width,
      showOverflow: false,
      ...override,
    };

    const resultColumns = [{
      ...groupColumn,
    },...metas.filter(schema => schema.field !== groupColumn.field).flatMap(schema => ({
      ...resolveColumn(schema),
      sortable:true,
      //隐藏这列，只为排序用
      visible:false,
    }))];
    console.log(resultColumns);
    return resultColumns;
  });
  return enableCheckbox ?[{
    align: 'left',
    type: 'checkbox',
    width: 30,
  },...columns] : columns;
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
  formOptions:{
    wrapperClass: 'grid-cols-3',
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
        component: 'ApiSelect',
        componentProps: {
          api: requestGetWwccWwcc00000100PageList,
          allowClear: true,
          labelField: 'wrkRef',
          valueField: 'wrkRef',
          resultField: 'items',
          showSearch: true,
          style:{
            width:'100%',
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
          style:{
            width:'100%',
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
  gridEvents:gridEvents,
  gridOptions: {
    checkboxConfig,
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
        query: async ({page,sorts}, formValues) => {
          const data = await requestPageNestOverview({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            ...queryParameters,
            sortRules: sorts.map(sort => ({property: sort.field,direction:sort.order})),
            loadPlan,
          });
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
watch(() => columnsSchema,(columnsSchema) => {
  console.log(columnsSchema);
  gridApi.setGridOptions({
    columns: buildColumns(
      columnsSchema?.length ? columnsSchema : mode === 'group' ? DEFAULT_GROUP_SCHEMA : DEFAULT_SCHEMA,
      mode
    )
  })
})
watch(() => enableServerSideSorting,(enableServerSideSorting) => {
  console.log(enableServerSideSorting);
  gridApi.setGridOptions({
    sortConfig: {
      remote: enableServerSideSorting,
    }
  })
})

watch(() => props.queryParameters,(queryParameters) => {
  console.log(queryParameters);
  gridApi.query();
},{
  deep: true
})

defineExpose({
  _gridApi: gridApi,
});
</script>

<template>
  <Grid>
    <template #toolbar-actions>
      <slot name="toolbar-actions"></slot>
    </template>
  </Grid>
</template>

<style scoped>

</style>
