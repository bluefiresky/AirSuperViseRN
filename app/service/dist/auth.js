/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-授权登录相关
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 发送验证码 ## smsType -> 1:文字;2:语音 */
export const post_send_dynamic_check_code = ({phoneNum, smsType, version}) => {
  return http_post( 'getValidaCode', {phoneNum, smsType}, {}, version )
}
// /** 注册　## from: [] */
// export const post_user_register = ({code, password, mobile, userSource, version}) => {
//   return http_post( service_url('/user/register', 'cn'), {code, password, mobile, userSource}, version )
// }
/** 用户登录-账号登录　*/
export const post_user_login_account = ({phoneNum, smsCode, deviceId, appType, version}) => {
  return http_post( 'login', {phoneNum, smsCode}, {deviceId, appType}, version )
}
// /** 重置密码 */
// export const post_reset_password = ({phoneNumber, password, code, version}) => {
//   return http_post( service_url('/users/password', 'cn'), {phoneNumber, password, code}, version )
// }
/** 退出登录  */
export const post_user_logout = ({version}) => {
  return http_post( 'logout', {}, {}, version)
}
