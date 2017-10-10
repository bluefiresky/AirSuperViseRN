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

/** 安全监管-民警-搜索单位 */
export const post_get_supervise_check_company = ({keyword, version}) => {
  return http_post( 'supervision.getCheckCompany', {keyword}, {}, version )
}

/** 安全监管-民警-搜索抄送单位 */
export const post_get_supervise_copy_company = ({keyword, version}) => {
  return http_post( 'supervision.getCcCompany', {keyword}, {}, version )
}

/** 安全监管-民警-获取民警列表 */
export const post_get_supervise_check_police = ({version}) => {
  return http_post( 'supervision.getCheckPolice', {}, {}, version )
}

/** 安全监管-民警-提交登记记录 */
export const post_supervise_submit_check = ({
  companyNum, companyName, listType, checkResult, signType, circulationType, templateType, appVersion,
  locationAddress, inputAddress, longitude, latitude, signData, checkPhoneNum, checkDetails, urgentType, timeLimit, templateData, ccCompanyList, lawList, photoList, policeUserList,
  version}) => {
  return http_post(
    'supervision.submitChecklist',
    {companyNum, companyName, listType, checkResult, signType, circulationType, templateType, appVersion},
    {policeUserList, locationAddress, inputAddress, longitude, latitude, signData, checkPhoneNum, checkDetails, urgentType, timeLimit, templateData, ccCompanyList, lawList, photoList},
    version
  )
}

/** 安全监管-民警-获取民警列表 */
export const post_get_supervise_check_detail = ({checkListNum, version}) => {
  return http_post( 'supervision.getCheckDetails', {checkListNum}, {}, version )
}

/** 安全监管-民警-获取民警列表 */
export const post_supervise_submit_feedback = ({checkListNum, modifyDetails, photoList, version}) => {
  return http_post( 'supervision.submitFeedback', {checkListNum}, {modifyDetails, photoList}, version )
}

/** 安全监管-民警-提交审核状态 */
export const post_supervise_submit_audit = ({checkListNum, auditStatus, auditDetails, version}) => {
  return http_post( 'supervision.submitAudit', {checkListNum, auditStatus}, {auditDetails}, version )
}

/** 违法举报-提交我要举报*/
export const post_report_submit_report = ({phoneNum, reportType, illegalDetails, urgentType, reportAddress, longitude, latitude, reporterName, reporterId, photoList, version}) => {
  return http_post( 'report.submitReport', {phoneNum, reportType, illegalDetails, urgentType, reportAddress}, {longitude, latitude, reporterName, reporterId, photoList}, version )
}

/** 违法举报-历史举报信息 */
export const post_get_report_history = ({version}) => {
  return http_post( 'report.getReportHistory', {}, {}, version )
}

/** 违法举报-历史举报信息 */
export const post_get_report_detail = ({reportNum, version}) => {
  return http_post( 'report.getReportDetails', {reportNum}, {}, version )
}

/** 网上预约-获取消防所有子项列表 */
export const post_get_fire_fighting_list = ({version}) => {
  return http_post( 'firefighting.getFirefightingItems', {}, {}, version )
}

/** 网上预约-消防预约接口 */
export const post_fire_fighting_submit_reservation = ({itemId, reservationDueDate, dayHalfType, version}) => {
  return http_post( 'firefighting.submitReservation', {itemId, reservationDueDate, dayHalfType}, {}, version )
}

/** 网上预约-获取消防历史预约接口 */
export const post_get_fire_fighting_history_reservations = ({version}) => {
  return http_post( 'firefighting.getHistoryReservations', {}, {}, version )
}

/** 网上预约-获取登录用户在新机场模块的角色列表 */
export const post_airportcard_get_role_list = ({version}) => {
  return http_post( 'airportcard.getRole', {}, {}, version )
}

/** 网上预约-申请部门单位列表接口 */
export const post_airportcard_get_approve_deptorunit = ({deptCode, version}) => {
  return http_post( 'airportcard.getApproveDeptOrUnit', {deptCode}, {}, version )
}
