/**
 * 物联告警引擎 api 集合
 * Created by ths on 2020.9.16
 */

const path = 'api-alarm'

/** 公共路由 **/
export const commonModule = {
  loginApi: path + ''
}

/** * 请求数据源 ****/
export const dbsource = {
  queryByParamKey: path + '/dbsource/queryByParamKey',
  axiosTest: 'http://114.116.196.102:8080/PMS/WorkLog/getWorkLog'
}
