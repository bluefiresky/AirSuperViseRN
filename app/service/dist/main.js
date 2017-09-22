/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-业务相关接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 证件管理-检查记录 */
export const post_get_certificate_check_list = ({version}) => {
  return http_post( 'certificate.check.list', {}, {}, version )
}

/** 证件管理-检查记录详情 */
export const post_get_certificate_check_detail = ({id, version}) => {
  return http_post( 'certificate.check.detail', {id}, {}, version )
}

/** 证件管理- 记分管理*/
export const post_get_certificate_deduction_list = ({version}) => {
  return http_post( 'certificate.deduction.list', {}, {}, version )
}

/** 证件管理- 记分管理详情*/
export const post_get_certificate_deduction_detail = ({id, version}) => {
  return http_post( 'certificate.deduction.detail', {id}, {}, version )
}

/** 证件管理- 申请复议*/
export const post_certificate_reconsider = ({id, reconsiderReason, version}) => {
  return http_post( 'certificate.reconsider', {id}, {reconsiderReason}, version )
}

/** 证件管理- 提交临时证件丢失信息 */
export const post_certificate_report_loss = ({paperworkSerialNumber, reportLossReason, photos, version}) => {
  return http_post( 'certificate.report.loss', {paperworkSerialNumber}, {reportLossReason, photos}, version )
}

/** 证件管理- 违规登记 */
export const post_certificate_check = ({paperworkSerialNumber, signFlag, totalDeductionScore, signImg, legalProvisionNumbers, livePhotos, version}) => {
  return http_post( 'certificate.check', {paperworkSerialNumber, signFlag, totalDeductionScore, legalProvisionNumbers}, {signImg, livePhotos}, version )
}

/** 安全监管-单位人员历史检查单 */
export const post_get_supervise_company_check_history = ({checkListStatus, urgentType, version}) => {
  return http_post( 'supervision.getCompanyCheckHistory', {checkListStatus, urgentType}, {}, version )
}

/** 安全监管-单位人员历史检查单 */
export const post_get_supervise_company_chaosong_history = ({urgentType, version}) => {
  return http_post( 'supervision.getCcCheckHistory', {urgentType}, {}, version )
}

/** 安全监管-民警-历史检查记录 */
export const post_get_supervise_police_check_history = ({checkListStatus, version}) => {
  return http_post( 'supervision.getPoliceCheckHistory', {checkListStatus}, {}, version )
}
