/**
 *
 * wuran on 17/1/10.
 */

const SAVE_MERCHANT_LIST = 'SAVE_MERCHANT_LIST';
const CLEAR_MERCHANT_LIST = 'CLEAR_MERCHANT_LIST';

const initial = {
  list:[]
}

export const merchantSearchHistory = (state = initial, action) => {
  switch(action.type) {
    case SAVE_MERCHANT_LIST :
      return {list:action.data}
    case CLEAR_MERCHANT_LIST :
      return {...initial};
  }
  return state;
}
