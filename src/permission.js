import router from '@/router'
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
import store from '@/store'
import { asyncRouter} from '@/router'

// 前置守卫
const whiteList = ['/login','/404']
router.beforeEach(async(to,from,next)=>{
  nprogress.start()
  if(store.getters.token) {
    // 存在token
    if(to.path === "/login"){
      //跳到主页
      next("/") // 中转到主页
      // next(地址)并没有执行后置守卫
      nprogress.done()
    }else{
      // 判断是否获取过资料
      if(!store.getters.userId){
        const {roles} = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus); // 数组
        // console.log(asyncRouter); // 数组
        const filterRoutes = asyncRouter.filter(item=>{
           //return true false
           return roles.menus.includes(item.name)
        })// 筛选后的路由
        store.commit("user/setRoutes",filterRoutes)
        router.addRoutes([...filterRoutes,{ path: '*', redirect: '/404', hidden: true }])  // 添加动态路由信息到路由表
        // router 添加动态路由信息之后 需要转发一下
        next(to.path)  // 目的是路由拥有信息
      }else{
        next()  //放过
      }
    }
  }else{
    // 没有token
    if(whiteList.includes(to.path)){
      next()
    }else{
      next("/login")
      nprogress.done()
    }
  }
})
// 后置守卫
router.afterEach(()=>{
  nprogress.done()
})