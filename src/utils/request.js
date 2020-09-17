
import Axios from 'axios'

/**
 * axios 初始化
 * @type {AxiosInstance}
 * @author ths
 */

const service = Axios.create({
  baseURL: 'http://10.168.2.206:8080', // 请求基地址
  timeout: 13000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token && config.type) {
      switch (config.type) {
        case 'db_search' || 'db_update':
          config.transformRequest = [
            data => {
              return 'args=' + JSON.stringify(data)
            }
          ]
          break
        default:
          config.headers = {
            'Content-Type': 'application/json'
          }
      }
    }
    config.headers.Authorization = 'Bearer ' + token
    return config
  },
  error => {
    console.log(error)
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject()
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject()
    }
  },
  error => {
    return error.response
  }
)

export default service
