/**
 *
 * Created by wuran on 16/12/21.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 * 打印 redux 当前执行的 action
 */


const log = ({type, ...other}) => {
  console.log('%c Redux action type: ' + type + ' && other -->> ', 'color:blue', other)
}
module.exports = store => next => action => {
  log(action)
  return next(action)
}
