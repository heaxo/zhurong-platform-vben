import type {VxeGridPropTypes} from "@vben/plugins/vxe-table";
import {h} from "vue";
import {VxeButton} from "@vben/plugins/vxe-pc-ui";

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
  queryNestingParts?: boolean

  /** 查询套料余料 */
  queryNestingRemnant?: boolean

  /** 查询套料辅助属性 */
  queryNestingAuxiliaryProperties?: boolean

  /** 查询套料文档 */
  queryNestingDocuments?: boolean

  /** 查询单项 */
  queryItems?: boolean

  /** 查询钣金件辅助数据 */
  querySheetPartsAuxiliaryData?: boolean

  /** 查询单项文档 */
  queryItemsDocuments?: boolean

  /** 查询作业信息 */
  queryJob?: boolean

  /** 查询作业全路径 */
  queryJobFullPath?: boolean
}

export const defaultQueryOptions: QueryOptions = {
  queryNestingParts: false,
  queryNestingRemnant: false,
  queryNestingAuxiliaryProperties: false,
  queryNestingDocuments: false,
  queryItems: false,
  querySheetPartsAuxiliaryData: false,
  queryItemsDocuments: false,
  queryJob: false,
  queryJobFullPath: false
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
        title: '套料图',
        override: {
          width: 140,
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

      crtDate: {
        type: 'field',
        field: FIELDS.crtDate,
        title: '创建时间',
        override: {
          width: 160,
          showOverflow: true,
          resizable: true,
          slots:{
            sort,
          }
        }
      },

      crtUser: {
        type: 'field',
        field: FIELDS.crtUser,
        title: '套料人员',
        override: {
          width: 120,
          resizable: true,
          slots:{
            sort,
          }
        }
      },

      wrkRef: {
        type: 'field',
        field: FIELDS.wrkRef,
        title: '机床',
        override: {
          width: 190,
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
        title: '工序',
        override: {
          width: 100,
          resizable: true,
          showOverflow: false,
          slots:{
            sort,
          }
        }
      },

      cnc: {
        type: 'field',
        field: FIELDS.cnc,
        title: 'CNC',
        override: {
          width: 150,
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
          width: 120,
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
        title: '板材',
        override: {
          width: 120,
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
        title: '母板',
        override: {
          width: 120,
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
        title: '长度',
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
        title: '宽度',
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
        title: '厚度',
        override: {
          width: 80,
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
        title: '整板面积',
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
        title: '整板重量',
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
        title: '整板利用率',
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
    };
}
