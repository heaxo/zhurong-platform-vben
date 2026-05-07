import {h} from "vue";
import TextFilter from './TextFilter.vue';
import NumberRangeFilter from './NumberRangeFilter.vue';
import SelectFilter from './SelectFilter.vue';
export {
  TextFilter,
}
export function registerTableTextFilterInput(vxeUI) {
  vxeUI.renderer.add('TableTextFilterInput', {
    // 自定义筛选模板
    renderTableFilter(renderOpts, renderParams) {
      return h(TextFilter, {
        renderOpts,
        renderParams,
      });
    },
    // 自定义重置数据方法
    tableFilterResetMethod(params) {
      const {options} = params
      options.forEach((option) => {
        option.data = ''
      })
    },
    // 自定义重置筛选复原方法（当未点击确认时，该选项将被恢复为默认值）
    tableFilterRecoverMethod({option}) {
      option.data = ''
    },
    // 自定义筛选方法
    tableFilterMethod(params) {
      const {option, row, column} = params
      const {data} = option
      const cellValue = row[column.field]
      if (cellValue) {
        return cellValue.indexOf(data) > -1
      }
      return false
    }
  })
}
export function registerTableNumberRangeFilter(vxeUI) {
  vxeUI.renderer.add('TableNumberRangeFilter', {
    renderTableFilter(renderOpts, renderParams) {
      return h(NumberRangeFilter, {
        renderOpts,
        renderParams,
      });
    },

    tableFilterResetMethod(params) {
      const { options } = params;

      options.forEach((option) => {
        option.data = {
          min: null,
          max: null,
        };
      });
    },

    tableFilterRecoverMethod({ option }) {
      option.data = {
        min: null,
        max: null,
      };
    },

    tableFilterMethod(params) {
      const { option, row, column } = params;
      const data = option.data || {};
      const { min, max } = data;

      const rawValue = row[column.field];

      if (rawValue === null || rawValue === undefined || rawValue === '') {
        return false;
      }

      const value = Number(rawValue);

      if (Number.isNaN(value)) {
        return false;
      }

      if (min !== null && min !== undefined && min !== '') {
        if (value < Number(min)) {
          return false;
        }
      }

      if (max !== null && max !== undefined && max !== '') {
        if (value > Number(max)) {
          return false;
        }
      }

      return true;
    },
  });
}

export function registerTableSelectFilter(vxeUI) {
  vxeUI.renderer.add('TableSelectFilter', {
    renderTableFilter(renderOpts, renderParams) {
      return h(SelectFilter, {
        renderOpts,
        renderParams,
      });
    },

    tableFilterResetMethod({ options }) {
      options.forEach((option) => {
        option.data = null;
      });
    },

    tableFilterRecoverMethod({ option }) {
      option.data = null;
    },

    tableFilterMethod({ option, row, column }) {
      const filterValue = option.data;

      if (filterValue === null || filterValue === undefined || filterValue === '') {
        return true;
      }

      return row[column.field] === filterValue;
    },
  });
}
