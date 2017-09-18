/**
 *
 * wuran on 17/1/10.
 */
import { POST_USER_LOGIN_ACCOUNT, POST_USER_LOGIN_PHONE, POST_USER_LOGIN_THIRD, POST_USER_LOGOUT } from '../../service/contract.js';

const initial = {
  token : null,
  headerUrl: null,
  name: null,
  is_self: -1,
  isLogin : false,
  userID: null,
  user_id: -1
}

export const auth = (state = initial, action) => {
  switch(action.type) {
    case POST_USER_LOGIN_ACCOUNT :
      return getAuth(action.data.data);
    case POST_USER_LOGIN_PHONE:
      return getAuth(action.data.data);
    case POST_USER_LOGIN_THIRD:
      return getAuth(action.data.data);
    case POST_USER_LOGOUT :
      global.auth = {...initial};
      return {...initial};
    case "LOGIN_FAIL" :
      global.auth = {...initial};
      return {...initial};
  }
  return state;
}

function getAuth(data) {
  let { headerUrl, is_self, name, sessionId, userID, user_id } = data;
  let auth = { headerUrl, is_self, name, token:sessionId, userID, user_id, isLogin: true };
  global.auth = auth;
  return auth;
}
