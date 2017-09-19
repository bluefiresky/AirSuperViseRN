/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-业务相关接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 证件管理-当前用户信息 */
export const post_get_certificate_check_list = ({version}) => {
  return http_post( 'certificate.check.list', {}, {}, version )
}

/** 证件管理-当前用户信息 */
export const post_get_certificate_check_detail = ({id, version}) => {
  return http_post( 'certificate.check.detail', {id}, {}, version )
}
