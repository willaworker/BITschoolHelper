//这只是样例，没有实际作用

import axios from 'axios'
import { useCounterStore } from '@/stores'
// import router from '../router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  //1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    //2. 携带token
    const useStore = useCounterStore()
    if (useStore.count) {
      config.headers.Authorization = useStore.count
    }
    return config
  },
  (err) => Promise.reject(err)
)

//相应拦截器
instance.interceptors.response.use(
  (res) => {
    //4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    //3. 处理业务失败
    //Toest(res.data.message||'服务异常')
    return res.Promise.reject(res.data)
  },
  (err) => {
    //5. 处理401错误
    //特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    // if(err.response?.status === 401){
    //    router.push('/login')
    //}

    //错误的默认情况
    //Toest(err.response.data.message||'服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
