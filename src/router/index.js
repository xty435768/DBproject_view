//import Vue from 'vue'
//import Router from 'vue-router'
// 导入刚才编写的组件

import Login from '../components/Login.vue'
import {Message} from 'element-ui'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        title: 'SCUT Commercial Website'
      }
    },
    {
      path: '/itemDetail',
      name: 'itemDetail',
      component:resolve=>require(['../components/ItemDetail'],resolve),
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
          path:'/market',
          name:'Market',
          component:resolve=>require(['../components/Market'],resolve),
          meta:{auth:true}
        },
        {
          path:'/user',
          name:'User',
          component:resolve=>require(['../components/User'],resolve),
          meta:{auth:true},
          children:[
            {path:'/user/info',component:resolve=>require(['../components/user/info'],resolve)},
            {path:'/user/pwd',component:resolve=>require(['../components/user/pwd'],resolve)},
            {path:'/user/items',component:resolve=>require(['../components/user/items'],resolve)},
            {path:'/user/orders',component:resolve=>require(['../components/user/orders'],resolve)},
            {path:'/user/cart',component:resolve=>require(['../components/user/cart'],resolve)},
            {path:'/user/selling',component:resolve=>require(['../components/user/selling'],resolve)}
          ]
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component:resolve=>require(['../components/Admin'],resolve),
      children:[
        {path:'/admin/items',component:resolve=>require(['../components/admin/manageItem'],resolve)},
      ]
    },
    {
      path: '/404',
      name: 'notFound',
      component:resolve=>require(['../components/common/404'],resolve),
    }, 
    {
      path: '*',
      redirect: '/404'
    }
  ]
})


router.beforeEach((to, form, next) => {
  
  let flag = sessionStorage.getItem("user")
  if (to.meta.auth) {
    if(!flag)
    {
      Message({
      showClose: true,
      message: '请先登录',
      type: 'warning'
    });
    next({ path: '/login' });
    }
    else next();
  } 
  else if(to.path=='/login' && flag){
    Message({
      showClose: true,
      message: '您已登录，若想退出当前用户请点击注销！',
      type: 'warning'
    });
  }
  else next();
});

export default router

