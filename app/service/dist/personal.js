/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-个人相关接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 用户信息 */
export const get_user_info = ({userID, version}) => {
  return http_get( service_url('/user/info','cn'), {userID}, version )
}

/** 获取用户角色所属列表 */
export const post_user_role_lsit = ({version}) => {
  return http_post( 'getCurrentUserInfo', {}, {}, version )
}
