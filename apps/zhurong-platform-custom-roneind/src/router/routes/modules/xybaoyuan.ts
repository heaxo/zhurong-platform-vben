import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [{
  path: '/roneind',
  name: 'Roneind',
  meta: { icon: 'mdi:factory', order: 10, title: '朗恩精密' },
  children: [
    { path: 'base-parts', name: 'RoneindBaseParts', component: () => import('#/views/roneind/base-parts.vue'), meta: { icon: 'mdi:cube-outline', title: '基础零件' } },
    { path: 'steel-plates', name: 'RoneindSteelPlates', component: () => import('#/views/roneind/steel-plates.vue'), meta: { icon: 'mdi:layers-triple-outline', title: '钢板库存' } },
    { path: 'manufacturing-orders', name: 'RoneindManufacturingOrders', component: () => import('#/views/roneind/manufacturing-orders.vue'), meta: { icon: 'mdi:clipboard-list-outline', title: '生产订单' } },
    { path: 'nests', name: 'RoneindNests', component: () => import('#/views/roneind/nests.vue'), meta: { icon: 'mdi:view-grid-outline', title: '套料反馈' } },
  ],
}];

export default routes;
