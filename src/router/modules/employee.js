import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  name:'employee',
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },{
    path:'/employee/detail/:id?',  //员工详情地址  ?表示id可有可无
    component:()=>import('@/views/employee/detail.vue'),
    hidden:true,  // 表示隐藏在左侧菜单 菜单栏就不会发生变化
    meta:{
      title:'员工详情'  // 显示在导航的文本
    }
  }]
}
