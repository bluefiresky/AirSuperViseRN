/**
 * Created by wuran on 16/1/3.
 * 真实连网函数, 上传照片
 */

import { http_get, http_post, service_url, http_post_file } from "../service_helpers";

/** 发送验证码 */
export const upload_image = ({type, imageArray,version}) => {
  return http_post_file( service_url('/image/upload','cn'), { ...imageArray,type,version} )
}
