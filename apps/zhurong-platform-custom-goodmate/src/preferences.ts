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
    defaultHomePath: '/inventory/sync',
    defaultAvatar: '/goodmate-logo.png',
    enablePreferences: false
  },
  transition: {
    name: 'fade-down',
  },
  logo: {
    enable: true,
    fit: 'contain',
    source: '/goodmate-logo.png',
    sourceDark: '/goodmate-logo.png',
  },
  breadcrumb: {
    styleType: "background",
    showHome: true
  },
  footer: {
    enable: true,
    fixed: true
  },
  tabbar: {
    styleType: "brisk",
  },
  theme: {
    colorPrimary: '#46af32',
    builtinType: 'deep-blue',
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
    companyName: 'custom-goodmate',
    companySiteLink: 'https://www.szgoodmate.com/',
    date: '2026',
    enable: true,
    icp: '',
    icpLink: '',
    settingShow: false,
  }
});
