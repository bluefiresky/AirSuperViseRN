/**
 * Created by wuran on 17/1/9.
 * 接口名定义文件
 */

export const UPLOAD_IMAGE = 'upload_image';

/*
 * Auth 相关接口
 */
export const POST_SEND_DYNAMIC_CHECK_CODE = 'post_send_dynamic_check_code';   // 发送手机验证码
export const POST_USER_REGISTER = 'post_user_register';                       // 注册
export const POST_USER_LOGIN_ACCOUNT = 'post_user_login_account';             // 登录-账号
export const POST_RESET_PASSWORD = 'post_reset_password';                     // 重置密码
export const POST_USER_LOGOUT = 'post_user_logout';                           // 退出登录



/*
 * Personal 个人信息-相关接口
 */
export const GET_USER_INFO = 'get_user_info';                                 // 用户信息
export const POST_USER_ROLE_LIST = 'post_user_role_lsit';                     // 获取用户所属角色列表
export const POST_GET_CERTIFICATE_USER_INFO = 'post_get_certificate_user_info';   // 证件管理-当前用户信息
export const POST_GET_CERTIFICATE_USER_INFO_BY_SERIANUMBER = 'post_get_certificate_user_info_by_serialnumber';  // 通过证件编号，查询用户信息
export const POST_GET_SUPERVISE_USER_INFO = 'post_get_supervise_user_info';   // 安全监管-获取用户信息

/*
 * Main 业务-相关接口
 */
export const POST_GET_CERTIFICATE_CHECK_LIST = 'post_get_certificate_check_list';             // 证件管理-获取检查记录
export const POST_GET_CERTIFICATE_CHECK_DETAIL = 'post_get_certificate_check_detail';         // 证件管理-获取检查记录详情
export const POST_GET_CERTIFICATE_DEDUCTION_LIST = 'post_get_certificate_deduction_list';     // 证件管理-记分管理
export const POST_GET_CERTIFICATE_DEDUCTION_DETAIL = 'post_get_certificate_deduction_detail'; // 证件管理-记分管理详情
export const POST_CERTIFICATE_RECONSIDER = 'post_certificate_reconsider';                     // 证件管理-申请复议
export const POST_CERTIFICATE_REPORT_LOSS = 'post_certificate_report_loss';                   // 证件管理-临时证件挂失
export const POST_CERTIFICATE_CHECK = 'post_certificate_check';                               // 证件管理-违规登记
export const POST_GET_SUPERVISE_COMPANY_CHECK_HISTORY = 'post_get_supervise_company_check_history';  // 安全监管-获取单位人员历史检查单
export const POST_GET_SUPERVISE_COMPANY_CHAOSONG_HISTORY = 'post_get_supervise_company_chaosong_history';  // 安全监管-获取单位人员历史检查单
export const POST_GET_SUPERVISE_POLICE_CHECK_HISTORY = 'post_get_supervise_police_check_history';     // 安全监管-民警-历史检查记录
export const POST_GET_SUPERVISE_CHECK_COMPANY = 'post_get_supervise_check_company';           // 安全监管-搜索单位
export const POST_GET_SUPERVISE_COPY_COMPANY = 'post_get_supervise_copy_company';             // 安全监管-搜索抄送单位
export const POST_GET_SUPERVISE_CHECK_POLICE = 'post_get_supervise_check_police';             // 安全监管-民警列表
export const POST_SUPERVISE_SUBMIT_CHECK = 'post_supervise_submit_check';                     // 安全监管-提交登记记录
export const POST_GET_SUPERVISE_CHECK_DETAIL = 'post_get_supervise_check_detail';             // 安全监管-获取检查单详情
export const POST_GET_SUPERVISE_SUBMIT_FEEDBACK = 'post_supervise_submit_feedback';           // 安全监管-提交检查单反馈
export const POST_SUPERVISE_SUBMIT_AUDIT = 'post_supervise_submit_audit';                     // 安全监管-提交审核状态
export const POST_REPORT_SUBMIT_REPORT = 'post_report_submit_report';                         // 违法举报-提交我要举报
export const POST_GET_REPORT_HISTORY = 'post_get_report_history';                             // 违法举报-获取历史举报信息
export const POST_GET_REPORT_DETAIL = 'post_get_report_detail';                               // 违法举报-获取举报详情
export const POST_GET_FIRE_FIGHTING_LIST = 'post_get_fire_fighting_list';                     // 网上预约-获取消防所有子项列表
export const POST_FIRE_FIGHTING_SUBMIT_RESERVATION = 'post_fire_fighting_submit_reservation';            // 网上预约-消防预约接口
export const POST_GET_FIRE_FIGHTING_HISTORY_RESERVATIONS = 'post_get_fire_fighting_history_reservations';     // 网上预约-获取消防历史预约接口
export const POST_AIRPORTCARD_GET_ROLE_LIST = 'post_airportcard_get_role_list';               // 网上预约-获取登录用户在新机场模块的角色列表
export const POST_AIRPORTCARD_GET_APPROVE_DEPTORUNIT = 'post_airportcard_get_approve_deptorunit';        // 网上预约-申请部门单位列表接口
export const POST_AIRPORTCARD_SUBMIT_APPLY_RECORD = 'post_airportcard_submit_apply_record';   // 网上预约-新机场证件-提交申请记录接口
export const POST_AIRPORTCARD_APPLY = 'post_airportcard_apply';                               // 网上预约-空防新入场单位资质申请接口
export const POST_GET_AIRPORTCARD_APPLY_RECORD = 'post_get_airportcard_apply_record';         // 网上预约-空防新入场单位资质审核记录查询接口
export const POST_GET_AIRPORTCARD_APPLY_DETAIL = 'post_get_airportcard_apply_detail';         // 网上预约-空防新入场单位资质审核记录详情查询接口
export const POST_GET_AIRPORTCARD_APPROVE_LISTS = 'post_get_airportcard_approve_lists';       // 网上预约-新机场证件-审核申请记录列表
export const POST_GET_AIRPORTCARD_APPROVE_DETAIL = 'post_get_airportcard_approve_detail';     // 网上预约-新机场证件-获取显示审核申请记录详情
export const POST_GET_AIRPORTCARD_HISTORY_APPROVE_LIST = 'post_get_airportcard_history_approve_lists';     // 网上预约-新机场证件-查看历史申请记录列表接口
export const POST_GET_AIRPORTCARD_APPROVE_HISTORY_DETAIL = 'post_get_airportcard_approve_history_detail';  // 网上预约-新机场证件-历史记录详情接口


/*
 * Common 产品-相关接口-(获取版本号。。。)
 */
export const GET_PROJECT_VERSION = 'get_project_version';                    // 获取版本号
export const POST_FORCED_UPDATE = 'post_forced_update';                      // 强制更新
export const POST_GET_WEATHER = 'post_get_weather';                          // 获取天气
