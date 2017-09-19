/**
 *
 * wuran on 17/1/10.
 */
import { POST_GET_CERTIFICATE_USER_INFO } from '../../service/contract.js';


const CLEAR_CERTIFICATEPROFILE = 'CLEAR_CERTIFICATEPROFILE';
const initial = {
  occupation:'',          // 职位
  paperworkStatus:'',     // 证件状态
  realname:'',            // 用户名称
  serialNumber:'',        // 证件编号
  organizationName:'',    // 所属单位-组织名称
  score:'',               // 剩余记分
  passArea:'',            // 通行区域
  deadline:''             // 证件有效期
}

export const certificateProfile = (state = initial, action) => {
  switch(action.type) {
    case POST_GET_CERTIFICATE_USER_INFO :
      return getProfile(action.data.data.entity);
    case CLEAR_CERTIFICATEPROFILE :
      global.certificateProfile = null;
      return {...initial};
  }
  return state;
}

function getProfile(data) {
  let { occupation, paperworkStatus, realname, serialNumber, organizationName, score, passArea, deadline } = data;
  let profile = { occupation, paperworkStatus, realname, serialNumber, organizationName, score, passArea, deadline };
  global.certificateProfile = profile;
  return profile;
}
