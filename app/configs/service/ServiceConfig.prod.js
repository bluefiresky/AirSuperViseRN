/**
 *
 * Created by wuran on 17/1/9.
 * 信分期 Service 相关配置
 */

/** 请求服务环境 @type {string} */
export const SERVICE_ENV = 'dist';  // 连网真实环境
// export const XIN_SERVICE_ENV = 'mock';　// app本地测试环境

/** 请求超时设置 @type {number} */
export const REQ_TIMEOUT = 5000

/** 请求服务的url @type {string} */
export const ConfigTitle = "Prod"

export const SERVICE_URL = 'https://api.xinfenqi.com/app'         /** 后台访问url */
export const APISIGN_STR = 'FcSRcblYPRyO3iCI^uzsXt*5h$NbAcue'     /** 后台访问验签混淆字符串 */
export const CURRENT_TIME = () => {                               /** 后台访问验签时间戳 */
  return Date.parse(new Date());
}
