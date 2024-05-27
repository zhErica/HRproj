import axios from "axios"
import store from '@/store'
import {Message} from "element-ui"
import router from "@/router"
// 创建一个axios实例
 const service =axios.create({
  baseURL:process.env.VUE_APP_BASE_API, //基础地址
  timeout:10000 //超时时间
 })
//请求拦截器
service.interceptors.request.use((config)=>{
  // 注入token
  // store.getters.token => 请求头里面
  if(store.getters.token){
    config.headers.Authorization =`Bearer ${store.getters.token}`
  }
  return  config
},(error)=>{
  // 失败执行promise
  return Promise.reject(error)
})

//响应拦截器
service.interceptors.response.use((response)=>{
  // axios 默认包裹了data
  const {data,message,success} = response.data
  if (success){
    return data
  }else {
    Message({type:'error',message})
    return Promise.reject(new Error(message))
  }
},async(error)=>{
  if(error.response.status === 401){
    Message({type:'warning',message:'token超时了'})
    // 说明token失效
    await store.dispatch("user/logout") // 调用action退出登录
    // 主动跳转登录页
    router.push('/login')  //跳转到登录页
    return Promise.reject(error)
  }
  //error.message
  Message({type:'error',message: error.message})
  return Promise.reject(error)

})
export default service
