import request from '../utils/request'

/**
 * 自定义通用 axios 封装类
 * @param query 请求体
 * @returns {*}
 * @author ths
 */

export const fetchData = query => {
  return request({
    url: query.url, // 请求地址
    method: query.method || 'get', // 请求方式，默认为get
    params: query.params, // 请求参数
    responseType: query.responseType || 'json', // 请求类型，默认为json
    data: query.data || '', // 请求体数据 （仅仅post可用）
    type: query.type
  })
}
