import {h} from "vue";
import TextFilter from './TextFilter.vue';
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
