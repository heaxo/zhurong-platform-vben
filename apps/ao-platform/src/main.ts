import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

//离线icon注册
import carbon from '@iconify/json/json/carbon.json';
import antDesign from '@iconify/json/json/ant-design.json';
import mdi from '@iconify/json/json/mdi.json';
import fileIcons from '@iconify/json/json/file-icons.json';
import epIcons from '@iconify/json/json/ep.json';
import fluentMdl2Icons from '@iconify/json/json/fluent-mdl2.json';
import { addCollection } from '@iconify/vue';
addCollection(carbon);
addCollection(antDesign);
addCollection(mdi);
addCollection(fileIcons);
addCollection(epIcons);
addCollection(fluentMdl2Icons);
/**
 * 应用初始化完成之后再进行页面加载渲染
 */
async function initApplication() {
  // name用于指定项目唯一标识
  // 用于区分不同项目的偏好设置以及存储数据的key前缀以及其他一些需要隔离的数据
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;

  // app偏好设置初始化
  await initPreferences({
    namespace,
    overrides: overridesPreferences,
  });

  // 启动应用并挂载
  // vue应用主要逻辑及视图
  const { bootstrap } = await import('./bootstrap');
  await bootstrap(namespace);

  // 移除并销毁loading
  unmountGlobalLoading();
}

initApplication();
