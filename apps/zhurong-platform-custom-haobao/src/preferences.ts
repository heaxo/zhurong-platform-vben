import { defineOverridesPreferences } from '@vben/preferences';

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
    defaultHomePath: '/nest/program',
    defaultAvatar: '/log.png',
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
    styleType: 'normal',
    showHome: true,
  },
  footer: {
    enable: false,
    fixed: false,
  },
  tabbar: {
    styleType: 'brisk',
  },
  theme: {
    colorPrimary: '#166cbd',
    colorSuccess: '#16a34a',
    colorWarning: '#f08519',
    colorDestructive: '#dc2626',
    builtinType: 'custom',
    mode: 'light',
    radius: '1',
    semiDarkHeader: false,
    semiDarkSidebar: true,
  },
  navigation: {
    accordion: false,
    styleType: 'plain',
  },
  widget: {
    globalSearch: false,
    lockScreen: true,
    notification: false,
    languageToggle: false,
    timezone: false,
  },
  copyright: {
    companyName: 'haobao',
    companySiteLink: 'http://localhost',
    date: '2026',
    enable: true,
    icp: '',
    icpLink: '',
    settingShow: true,
  }
});
