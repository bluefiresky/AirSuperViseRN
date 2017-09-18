/**
* Created by wuran on 16/12/28.
* react-native-router-flux 所需相关配置，用于路由配置
*/
import { Reducer } from 'react-native-router-flux';

export const routerReducerCreate = params => {
   const defaultReducer = new Reducer(params);
   return (state, action) => {
    //  console.log('%c Router action -->> ','color:cornflowerblue', action);
    //  console.log('%c Router State -->> ','color:cornflowerblue', state);
     return defaultReducer(state, action);
   };
 };
