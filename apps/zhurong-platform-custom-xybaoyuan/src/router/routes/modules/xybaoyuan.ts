import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [{
  path: '/xybaoyuan',
  name: 'XyBaoyuan',
  meta: { icon: 'mdi:factory', order: 10, title: '象屿宝元' },
  children: [
    { path: 'base-parts', name: 'XyBaseParts', component: () => import('#/views/xybaoyuan/base-parts.vue'), meta: { icon: 'mdi:cube-outline', title: '基础零件' } },
    { path: 'steel-plates', name: 'XySteelPlates', component: () => import('#/views/xybaoyuan/steel-plates.vue'), meta: { icon: 'mdi:layers-triple-outline', title: '钢板库存' } },
    { path: 'manufacturing-orders', name: 'XyManufacturingOrders', component: () => import('#/views/xybaoyuan/manufacturing-orders.vue'), meta: { icon: 'mdi:clipboard-list-outline', title: '生产订单' } },
    { path: 'nests', name: 'XyNests', component: () => import('#/views/xybaoyuan/nests.vue'), meta: { icon: 'mdi:view-grid-outline', title: '套料反馈' } },
  ],
}];

export default routes;
