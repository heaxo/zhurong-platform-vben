import type { App } from 'vue';

import { VxeUIAll } from '@vben/plugins/vxe-table';

export * from './industrial-login-page';
export * from './job-browser-page';
export * from './job-browser-selecter';
export * from './job-select-modal';
export * from './nesting-table';
export * from './table-column-data-filter';

// 按需加载组件
export const setupVxeTable = (app: App) => {
  app.use(VxeUIAll.VxeInput);
  app.use(VxeUIAll.VxeSelect);
  app.use(VxeUIAll.VxeOption);
  app.use(VxeUIAll.VxeImage);
  app.use(VxeUIAll.VxeButton);
};
