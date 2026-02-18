import { defineConfig } from 'umi';

export default defineConfig({
  title: '汽服报价系统',
  navTheme: 'light',
  primaryColor: '#475569',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  headerHeight: 56,
  splitMenus: false,
});
