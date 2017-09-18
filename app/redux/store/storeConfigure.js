/**
 * Created by wuran on 16/12/21.
 */

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { AsyncStorage } from 'react-native'
// Middleware
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import promise from './promise.js'
import track from './track.js'

// reducers
import { auth } from '../reducers/auth.js';

/**
 * configure store params
 */
// 添加 Middleware
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  promise,
  track
)(createStore);
// 合并 reducers
const reducer = combineReducers({
  auth
});


let store = null

export const configureStore = (onComplete) => {
  store = autoRehydrate()(createStoreWithMiddleware)(reducer) // 函数嵌套，自右向左展开
  persistStore(store, {storage: AsyncStorage, blacklist : []}, onComplete )
  global.store = store;
  return store
}

export const getStore = () => {
  return store
}
