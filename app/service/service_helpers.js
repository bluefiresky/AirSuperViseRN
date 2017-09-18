import qs from "qs";
import 'whatwg-fetch';
import md5 from 'md5';
import R from 'ramda';
import sha1 from 'sha1';

import { SERVICE_URL, REQ_TIMEOUT, APISIGN_STR, CURRENT_TIME } from '../configs/index.js';
import { getStore } from "../redux/index.js";

// 生成可用url
const service_url = (path, more) => {
  return SERVICE_URL + path
}

// 签名参数
const appKey = '110101';
const format = 'json';

// http 类型定义
const http_post = http_factory({method : "POST", paramsType : "form"})
const http_get = http_factory({method : "GET", paramsType : "query"})
const http_put = http_factory({method : "PUT", paramsType : "json"})
const http_post_file = http_factory({method : "POST", paramsType : "file"})

function http_factory({method, paramsType}) {

  return async (api, signParams, otherParams, version = '1.0') => {
    const state = getStore().getState()
    const auth = state.auth;

    /** 形成service头和数据包 */
    const meta = {
      method : method,
      timeout : REQ_TIMEOUT,
      headers: {}
    }

    let h;
    let path = SERVICE_URL;
    if(paramsType === 'form') {
      if(auth.token){
        signParams.sessionId = auth.token;
      }
      h = {method: api, appKey, format, v: version, sign: sign(api, version, signParams)};
      meta.headers['Content-type'] = 'application/x-www-form-urlencoded';
      meta.body = qs.stringify(Object.assign(signParams, otherParams, h))

    } else if (paramsType === 'query') {
      let query;
      if(auth.token){
        h = {method: api, appKey, format, v: version, sign: sign(api, version, signParams, {sessionId: auth.token})}
        query = qs.stringify(Object.assign(signParams, otherParams, h))
        query += "&" + 'sessionId=' + auth.token
      }else{
        h = {method: api, appKey, format, v: version, sign: sign(api, version, signParams)}
        query = qs.stringify(Object.assign(signParams, otherParams, h))
      }
      path += "?" + query

    }

    /** 开始连网获并取返回数据 */
    console.log('%c service_helpers ## path: ## ' + path + ' ## meta -->> ', 'color:limegreen', meta);
    try{
      const response = await fetch(path, meta);
      console.log('%c service_helpers resopnse-stauts -->> ', 'color:limegreen', response.status );
      if(response.status == 200){
        const text = await response.text()
        // console.log('%c service_helpers response-text -->> ', 'color:limegreen', text);
        const jsonData = JSON.parse(text)
        console.log('%c service_helpers response-jsonData -->> ', 'color:limegreen', jsonData);

        let code = parseInt(jsonData.code);
        if(code != 200 && code != 21){
          return { success: false, message: jsonData.message };
        }else {
          return { success: true, data: jsonData };
        }
      }else{
        return { success : false, code : response.status, message : '网络连接错误' };
      }

    }catch(ex) {
      console.log('%c service_helpers fetch error -->> ', 'color:red', ex);
      return { success : false, code : 400, message : "网络请求错误" };
    }

    return jsonData
  }
}

function object2pairs(api, version, signParams, extraParams){
  const pairs = []
  pairs.push({key: 'method', value: api});
  pairs.push({key: 'appKey', value: appKey});
  pairs.push({key: 'format', value: format});
  pairs.push({key: 'v', value: version});
  for(let key in signParams){
    pairs.push({key, value: signParams[key]})
  }
  for(let key in extraParams){
    pairs.push({key, value: extraParams[key]})
  }
  return pairs
}

function sign(api, version, signParams, extraParams){

  const pairs = object2pairs(api, version, signParams, extraParams)
  const sortByKey = R.sortBy(R.prop('key'))
  const sortedPairs = sortByKey(pairs)

  let str = APISIGN_STR
  sortedPairs.map(item => {
    str += item.key + '' + item.value
  })
  str += APISIGN_STR

  // console.log('before sha1 sign str -->> ', str);
  let sign = sha1(str);
  // console.log('after sha1 sign str -->> ', sign.toUpperCase());
  return sign.toUpperCase();
}

export { http_get, http_post, http_put, service_url, http_post_file }
