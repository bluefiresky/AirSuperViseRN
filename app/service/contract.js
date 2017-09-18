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
/*
 * Main 业务-相关接口
 */


/*
 * Common 产品-相关接口-(获取版本号。。。)
 */
export const GET_PROJECT_VERSION = 'get_project_version';                    // 获取版本号
export const POST_FORCED_UPDATE = 'post_forced_update';                      // 强制更新
export const POST_GET_WEATHER = 'post_get_weather';                          // 获取天气      
