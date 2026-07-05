import type {VxeGridPropTypes} from "@vben/plugins/vxe-table";
import {h} from "vue";
import {Tag} from 'ant-design-vue';
import {VxeButton} from "vxe-pc-ui";

export const FIELDS = {
  image: 'image',
  nstRef: 'nstRef',
  crtDate: 'crtDate',
  crtUser: 'crtUser',
  mstate: 'mstate',

  wrkRef: 'wrkRef',
  oprRef: 'oprRef',
  cnc: 'cnc',

  matRef: 'matRef',
  shtRef: 'shtRef',
  shtRefOrg: 'shtRefOrg',

  slength: 'slength',
  swidth: 'swidth',
  sthickness: 'sthickness',

  sarea: 'sarea',
  suarea: 'suarea',
  partArea: 'partArea',

  sweight: 'sweight',
  suweight: 'suweight',
  partWeight: 'partWeight',

  sprofit: 'sprofit',
  sprofitS: 'sprofitS',
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

  return {
      image: {
        type: 'field',
        field: FIELDS.image,
        title: '排版图',
        override: {
          width: 135,
          showOverflow: false,
          cellRender: {
            name: 'VxeImage',
            props: {
              width: 'auto',
              height: 'auto'
            }
          }
        },
      },

    cnc: {
      type: 'field',
      field: FIELDS.cnc,
      title: '程序NC',
      override: {
        width: 160,
        resizable: true,
        // showOverflow: false,
        slots:{
          default: (param) => {
            return [
              h(
                'span',
                {
                  style: {
                    color: 'hsl(var(--primary))',
                    cursor: 'pointer',
                    // textDecoration: 'underline',
                  },
                },
                param.row[FIELDS.cnc] || '-'
              )
            ]
          }
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
        // showOverflow: false,
        slots:{
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
        // showOverflow: false,
        slots:{
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
        // showOverflow: false,
        slots:{
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
        // showOverflow: false,
        slots:{
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
        // showOverflow: false,
        slots:{
        }
      }
    },

    slength: {
      type: 'field',
      field: FIELDS.slength,
      title: '板长',
      override: {
        width: 100,
        resizable: true,
        // showOverflow: false,
        sortable: true,
        slots:{
        }
      }
    },
    swidth: {
      type: 'field',
      field: FIELDS.swidth,
      title: '板宽',
      override: {
        width: 100,
        resizable: true,
        // showOverflow: false,
        sortable: true,
        slots:{
        }
      }
    },
    sthickness: {
      type: 'field',
      field: FIELDS.sthickness,
      title: '板厚',
      override: {
        width: 90,
        resizable: true,
        // showOverflow: false,
        sortable: true,
        slots:{
        }
      }
    },

    nstRef: {
      type: 'field',
      field: FIELDS.nstRef,
      title: '套料编码',
      override: {
        width: 120,
        showOverflow: true,
        resizable: true,
        sortable: true,
        slots:{
        }
      }
    },
    sarea: {
      type: 'field',
      field: FIELDS.sarea,
      title: '钢板面积',
      override: {
        width: 100,
        resizable: true,
        // showOverflow: false,
          sortable: true,
        slots:{
        }
      }
    },
    suarea: {
      type: 'field',
      field: FIELDS.suarea,
      title: '使用面积',
      override: {
        width: 100,
        resizable: true,
        // showOverflow: false,
          sortable: true,
        slots:{
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
        // showOverflow: false,
          sortable: true,
        slots:{
        }
      }
    },
    sweight: {
      type: 'field',
      field: FIELDS.sweight,
      title: '钢板重量',
      override: {
        width: 100,
        resizable: true,
        // showOverflow: false,
          sortable: true,
        slots:{
        }
      }
    },
    suweight: {
      type: 'field',
      field: FIELDS.suweight,
      title: '使用重量',
      override: {
        width: 100,
        resizable: true,
        // showOverflow: false,
          sortable: true,
        slots:{
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
        // showOverflow: false,
          sortable: true,
        slots:{
        }
      }
    },
    sprofit: {
      type: 'field',
      field: FIELDS.sprofit,
      title: '钢板利用率',
      override: {
        width: 120,
        resizable: true,
        // showOverflow: false,
          sortable: true,
        slots:{
        }
      }
    },
    sprofitS: {
      type: 'field',
      field: FIELDS.sprofitS,
      title: '去余料利用率',
      override: {
        width: 120,
        resizable: true,
        // showOverflow: false,
          sortable: true,
        slots:{
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
          sortable: true,
          slots:{
          }
        }
      },
    mstate: {
        type: 'field',
        field: FIELDS.mstate,
        title: '套料状态',
        override: {
          width: 100,
          showOverflow: true,
          fixed:"right",
          slots:{
            default({ row }){
              const stateMap = {
                10: { text: '编程中', color: 'geekblue' },
                40: { text: '在车间', color: 'orange' },
                90: { text: '已报工', color: 'success' }
              }
              const state = stateMap[row.mstate] || { text: '未知状态', color: 'default' }

              return h(
                Tag,
                { color: state.color,bordered:false },
                () => state.text
              )

            }
          }
        }
      },
    };
}
