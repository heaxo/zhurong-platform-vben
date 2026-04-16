import type {VxeGridPropTypes} from "@vben/plugins/vxe-table";
import {h} from "vue";
import {VxeButton} from "vxe-pc-ui";

export const FIELDS = {
  image: 'image',
  nstRef: 'nstRef',
  crtDate: 'crtDate',
  crtUser: 'crtUser',

  wrkRef: 'wrkRef',
  oprRef: 'oprRef',
  cnc: 'cnc',

  matRef: 'matRef',
  shtRef: 'shtRef',
  shtRefOrg: 'shtRefOrg',

  sLength: 'sLength',
  sWidth: 'sWidth',
  sThickness: 'sThickness',

  sArea: 'sArea',
  suArea: 'suArea',
  partArea: 'partArea',

  sWeight: 'sWeight',
  suWeight: 'suWeight',
  partWeight: 'partWeight',

  sProfit: 'sProfit',
  sProfitS: 'sProfitS',
} as const;
type FieldKey = keyof typeof FIELDS;
export type DataTableColumnSchema =
  | GroupColumnSchema
  | SimpleColumnSchema;

export interface GroupColumnSchema {
  type: 'group';
  title: string;
  width?: number;
  schemas: Array<SimpleColumnSchema>;
  override?: Partial<VxeGridPropTypes.Column>;
}

export interface SimpleColumnSchema {
  type: 'field';
  title: string;
  field: FieldKey;
  override?: Partial<VxeGridPropTypes.Column>;
}

export interface QueryOptions {
  /** 查询套料零件 */
  includeNestParts?: boolean

  /** 查询套料余料 */
  includeNestRemnants?: boolean

  /** 查询套料辅助属性 */
  includeNestMetrics?: boolean

  /** 查询套料文档 */
  includeNestFiles?: boolean

  /** 查询单项 */
  includePartMaster?: boolean

  /** 查询钣金件辅助数据 */
  includePartExtra?: boolean

  /** 查询单项文档 */
  includePartFiles?: boolean

  /** 查询作业信息 */
  includeJobCard?: boolean

  /** 查询作业全路径 */
  includeJobFullPath?: boolean
}

export const defaultQueryOptions: QueryOptions = {
  includeNestParts: false,
  includeNestRemnants: false,
  includeNestMetrics: false,
  includeNestFiles: false,
  includePartMaster: false,
  includePartExtra: false,
  includePartFiles: false,
  includeJobCard: false,
  includeJobFullPath: false
}
function columnSort({column},events) {
  return h(VxeButton, {
    mode: 'text',
    title: '点击排序',
    status: column.order ? 'primary' : '',
    icon:
      column.order === 'desc'
        ? 'vxe-icon-sort-alpha-desc'
        : 'vxe-icon-sort-alpha-asc',
    ...(events??{}),
  })
}
export function useFieldRegistry(params?:any): Record<FieldKey, SimpleColumnSchema> {
  const {sortEvent} = params??{};
  function sort(params) {
    console.log(params);
    const {column} = params;
    return columnSort(params,{
      onClick: (e) => {
        sortEvent && sortEvent(column.field, column.order,e)
      }
    })
  }
  return {
      image: {
        type: 'field',
        field: FIELDS.image,
        title: '排版图',
        override: {
          width: 135,
          cellRender: {
            name: 'VxeImage',
            props: {
              width: 'auto',
              height: 'auto'
            }
          }
        },
      },

      nstRef: {
        type: 'field',
        field: FIELDS.nstRef,
        title: '套料编码',
        override: {
          width: 120,
          showOverflow: true,
          resizable: true,
          slots:{
            sort,
          }
        }
      },

    cnc: {
      type: 'field',
      field: FIELDS.cnc,
      title: '程序NC',
      override: {
        width: 160,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    wrkRef: {
      type: 'field',
      field: FIELDS.wrkRef,
      title: '套料机床',
      override: {
        width: 200,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },

    oprRef: {
      type: 'field',
      field: FIELDS.oprRef,
      title: '工艺类型',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },

    matRef: {
      type: 'field',
      field: FIELDS.matRef,
      title: '材质',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    shtRef: {
      type: 'field',
      field: FIELDS.shtRef,
      title: '钢板编码',
      override: {
        width: 130,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    shtRefOrg: {
      type: 'field',
      field: FIELDS.shtRefOrg,
      title: '母材编码',
      override: {
        width: 130,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },

    sLength: {
      type: 'field',
      field: FIELDS.sLength,
      title: '板长',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    sWidth: {
      type: 'field',
      field: FIELDS.sWidth,
      title: '板宽',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    sThickness: {
      type: 'field',
      field: FIELDS.sThickness,
      title: '板厚',
      override: {
        width: 90,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    sArea: {
      type: 'field',
      field: FIELDS.sArea,
      title: '钢板面积',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    suArea: {
      type: 'field',
      field: FIELDS.suArea,
      title: '使用面积',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    partArea: {
      type: 'field',
      field: FIELDS.partArea,
      title: '零件面积',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    sWeight: {
      type: 'field',
      field: FIELDS.sWeight,
      title: '钢板重量',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    suWeight: {
      type: 'field',
      field: FIELDS.suWeight,
      title: '使用重量',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    partWeight: {
      type: 'field',
      field: FIELDS.partWeight,
      title: '零件重量',
      override: {
        width: 100,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    sProfit: {
      type: 'field',
      field: FIELDS.sProfit,
      title: '钢板利用率',
      override: {
        width: 120,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    sProfitS: {
      type: 'field',
      field: FIELDS.sProfitS,
      title: '去余料利用率',
      override: {
        width: 120,
        resizable: true,
        showOverflow: false,
        slots:{
          sort,
        }
      }
    },
    crtUser: {
      type: 'field',
      field: FIELDS.crtUser,
      title: '程序员',
      override: {
        width: 120,
        resizable: true,
        slots:{
          sort,
        }
      }
    },

    crtDate: {
        type: 'field',
        field: FIELDS.crtDate,
        title: '套料时间',
        override: {
          width: 160,
          showOverflow: true,
          resizable: true,
          slots:{
            sort,
          }
        }
      },
    };
}
