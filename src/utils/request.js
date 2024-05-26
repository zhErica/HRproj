import axios from "axios"
import store from '@/store'
import {Message} from "element-ui"
// 创建一个axios实例
 const service =axios.create({
  baseURL:'/api', //基础地址
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
    return Promise.reject(new Error(message))
  }
},(erroe)=>{
  Message({type:'error',message:error.message})
  return Promise.reject(error)

})
export default service
