/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-产品相关其他接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 获取版本号 */
// export const get_project_version = ({version}) => {
//   return http_get( service_url('/version'), {}, version )
// }

/** 获取强制更新信息 */
export const post_forced_update = ({appType, appVer, version}) => {
  return http_post( 'forcedUpdate', {appType, appVer}, {}, version )
}

/** 获取天气信息 */
export const post_get_weather = ({cityName, version}) => {
  return http_post( 'getWeatherAndBannerList', {cityName}, {}, version )
}
