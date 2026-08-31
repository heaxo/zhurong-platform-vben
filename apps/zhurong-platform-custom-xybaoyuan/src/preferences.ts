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
    defaultHomePath: '/xybaoyuan/manufacturing-orders',
    defaultAvatar: '/log.png',
    enablePreferences: false
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
    showHome: true
  },
  footer: {
    enable: false,
    fixed: true
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
  navigation: {
    accordion: false,
    styleType: "plain"
  },
  widget: {
    globalSearch: false,
    lockScreen: true,
    notification: false,
    languageToggle: false,
    timezone: false,
  },
  copyright: {
    companyName: 'custom-template',
    companySiteLink: 'http://localhost',
    date: '2026',
    enable: false,
    icp: '',
    icpLink: '',
    settingShow: true,
  }
});
