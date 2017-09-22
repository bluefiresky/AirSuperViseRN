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

/** 证件管理-当前用户信息 */
export const post_get_certificate_user_info = ({version}) => {
  return http_post( 'certificate.user.get', {}, {}, version )
}

/** 证件管理-证件编号-当前用户信息 */
export const post_get_certificate_user_info_by_serialnumber = ({paperworkNumber, version}) => {
  return http_post( 'certificate.paperwork.get', {paperworkNumber}, {}, version )
}

/** 安全监管-当前用户信息 */
export const post_get_supervise_user_info = ({version}) => {
  return http_post( 'supervision.getUserInfo', {}, {}, version )
}
