//import Vue from 'vue'
//import Router from 'vue-router'
// 导入刚才编写的组件

import Login from '../components/Login.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
  // 下面都是固定的写法
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        title: '登录/注册'
      }
    },
    {
      path: '/home',
      name: 'Home',
      redirect: '/index',
      meta:{
        title: '京宝多',
        auth: true
      },
      component:resolve=> require(['../components/home/Home'],resolve),
      children:
      [
        {
          path:'/index',
          name:'Index',
          component:resolve=>require(['../components/index/Index'],resolve),
          meta:{auth: true},
        },
        {
          path:'/library',
          name:'Library',
          component:resolve=>require(['../components/Library'],resolve),
          meta:{auth:true}
        },
        {
          path:'user',
          name:'User',
          component:resolve=>require(['../components/User'],resolve),
          meta:{auth:true}
        }
      ]
    }
  ]
})