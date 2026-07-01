import {defineOverridesPreferences} from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
    name: import.meta.env.VITE_APP_TITLE,
    defaultHomePath: '/order',
    defaultAvatar: '/log.png'
  },
  transition: {
    name: 'fade-down',
  },
  logo: {
    enable: true,
    fit: 'contain',
    source: '/log.png',
    sourceDark: '/logo-dark.png',
  },
  breadcrumb: {
    styleType: "background",
  },
  footer: {
    enable: true,
  },
  tabbar: {
    styleType: "brisk",
  },
  theme: {
    colorPrimary: '#f97316',
    builtinType: 'orange',
    mode: "light",
    radius: "1",
    semiDarkSidebar: true,
  },
  widget: {
    globalSearch: false,
    lockScreen: false,
    notification: false,
  },
});
