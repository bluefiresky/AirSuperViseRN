/**
* Created by wuran on 16/12/29.
* Redux 相关组件调用入口
*/

/** Service */
export { create_service } from './actions/service.js';

/** Store */
export { configureStore, getStore } from './store/storeConfigure.js';

/** Reducers */
export { routerReducerCreate } from './reducers/routerFlux.js'; /** 路由使用的reducer，与app的redux无关 */
