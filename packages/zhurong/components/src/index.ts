import { VxeUIAll } from '@vben/plugins/vxe-table';
export * from './job-browser-selecter';
export * from './job-browser-page';
export * from './nesting-table';
export * from './table-column-data-filter';

//按需加载组件
export const setupVxeTable = (app) => {
  app.use(VxeUIAll.VxeInput);
  app.use(VxeUIAll.VxeSelect);
  app.use(VxeUIAll.VxeImage);
  app.use(VxeUIAll.VxeButton);
};
