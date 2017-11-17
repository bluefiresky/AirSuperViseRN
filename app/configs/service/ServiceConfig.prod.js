/**
 *
 * Created by wuran on 17/1/9.
 * 信分期 Service 相关配置
 */

/** 请求服务环境 @type {string} */
export const SERVICE_ENV = 'dist';  // 连网真实环境
// export const SERVICE_ENV = 'mock';　// app本地测试环境

/** 请求超时设置 @type {number} */
export const REQ_TIMEOUT = 10000

/** 请求服务的url @type {string} */
export const ConfigTitle = "Dev"
export const SERVICE_URL = 'https://app.sdjcgafj.gov.cn/airport-web-api/router'
// export const SERVICE_URL = 'http://192.168.1.201:8080/airport-web-api/router'
export const APISIGN_STR = '1c36c9f2-7a0c-9efe-b93f-1d4be5e0b785'
export const CURRENT_TIME = () => {
  // return new Date("2021/02/08 18:16:13").getTime();
  return Date.parse(new Date());
}
