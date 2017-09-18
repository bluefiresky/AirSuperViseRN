/**
 *
 * Created by wuran on 16/12/21.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 * 若 action 含有then且是function类型，则把此 action.then 同步执行
 */

// To let the caller handle the rejection
function warn(error) {
  console.warn(error.message || error);
  throw error;
}

/*
 * Promise.resolve(action)，返回执行过action.then的Promise对象
 * 1. 返回的Promise对象正常，则then中调用 next function
 * 2. 返回的Promise对象抛出异常，则then中调用 warn function
 * [解释] https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
 */
module.exports = store => next => action =>
  typeof action.then === 'function'
    ? Promise.resolve(action).then(next, warn)
    : next(action)
