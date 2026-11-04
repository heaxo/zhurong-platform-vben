import CuttingPrograms from './modules/cutting-programs.vue';
import Parts from './modules/parts.vue';

/**
 * 报表注册表：新增 modules/*.vue 后只需在这里增加一项。
 * 下拉选项与组件共用此列表，避免名称和组件映射分散维护。
 */
export const reports = [
  { key: 'cutting-programs', title: '切割程序清单', component: CuttingPrograms },
  { key: 'parts', title: '零件清单', component: Parts },
];

export const reportOptions = reports.map(({ key, title }) => ({
  value: key,
  label: title,
}));
