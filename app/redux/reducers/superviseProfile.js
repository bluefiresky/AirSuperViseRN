/**
 *
 * wuran on 17/1/10.
 */
import { POST_GET_SUPERVISE_USER_INFO, POST_USER_LOGOUT } from '../../service/contract.js';

const initial = {
  /** police */
  userid:null,
  phoneNum:null,
  policeDeptName:null,
  policeJob:null,
  policeModifyCounts:null,
  policeMonthCounts:null,
  policeName:null,
  policeNum:null,
  policeReviewCounts:null,
  policeYearCounts:null,
  roleNum:null,

  /** merchant */
  userName:null,
  userJob:null,
  userCompanyName:null,
  userMonthCounts:null,
  userYearCounts:null,
  userModifyCounts:null,
  userReviewCounts:null,
  userNotPassCounts:null
}

export const superviseProfile = (state = initial, action) => {
  switch(action.type) {
    case POST_GET_SUPERVISE_USER_INFO :
      return getProfile(action.data.data.entity);
    case POST_USER_LOGOUT :
      global.superviseProfile = null;
      return {...initial};
  }
  return state;
}

function getProfile(data) {
  let profile = { ...data };
  global.superviseProfile = profile;
  return profile;
}
