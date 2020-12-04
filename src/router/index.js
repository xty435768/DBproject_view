//import Vue from 'vue'
//import Router from 'vue-router'
// 导入刚才编写的组件

// import Login from '../components/Login.vue'
// import itemDetail from '../components/ItemDetail'
// import Home from '../components/home/Home'
// import Index from '../components/index/Index'
// import Market from '../components/Market'
// import Release from '../components/Release'
// import User from '../components/User'
// import info from '../components/user/info'
// import pwd from '../components/user/pwd'
// import itemShow from '../components/user/itemsShow'
// import orders from '../components/user/orders'
// import cart from '../components/user/cart'
// import selling from '../components/user/selling'
// import Admin from '../components/Admin'
// import manageItem from '../components/admin/manageItem'
// import viewTransaction from '../components/admin/viewTransaction'
// import notFound from '../components/common/404'


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
      component:resolve=>require(['../components/Login.vue'],resolve),
      //component: Login,
      meta:{
        title: 'SCUT Commercial Website'
      }
    },
    {
      path: '/itemDetail',
      name: 'itemDetail',
      component:resolve=>require(['../components/ItemDetail'],resolve),
      //component:itemDetail,
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
      //component:Home,
      children:
      [
        {
          path:'/index',
          name:'Index',
          component:resolve=>require(['../components/index/Index'],resolve),
          //component:Index,
          meta:{auth: true},
        },
        {
          path:'/market',
          name:'Market',
          component:resolve=>require(['../components/Market'],resolve),
          //component:Market,
          meta:{auth:true}
        },
        {
          path: '/release',
          name: 'Release',
          component:resolve=>require(['../components/Release'],resolve),
          //component: Release
        },
        {
          path:'/user',
          name:'User',
          component:resolve=>require(['../components/User'],resolve),
          //component:User,
          meta:{auth:true},
          children:[
            {path:'/user/info',
              component:resolve=>require(['../components/user/info'],resolve)
              //component:info,
            },
            {path:'/user/pwd',
              component:resolve=>require(['../components/user/pwd'],resolve)
              //component:pwd,
            },
            {path:'/user/items',
              component:resolve=>require(['../components/user/itemsShow'],resolve)
              //component:itemShow,
            },
            {path:'/user/orders',
              component:resolve=>require(['../components/user/orders'],resolve)
              //component:orders,
            },
            {path:'/user/cart',
              component:resolve=>require(['../components/user/cart'],resolve)
              //component:cart,
            },
            {path:'/user/selling',
              component:resolve=>require(['../components/user/selling'],resolve)
              //component:selling,
            }
          ]
        },
        {
          path: '/admin',
          name: 'Admin',
          component:resolve=>require(['../components/Admin'],resolve),
          //component:Admin,
          meta:{auth:true},
          children:[
            {path:'/admin/items',
              component:resolve=>require(['../components/admin/manageItem'],resolve)
              //component:manageItem,
            },
            {path:'/admin/transactions',
              component:resolve=>require(['../components/admin/viewTransaction'],resolve)
              //component:viewTransaction,
            },
          ]
        },
      ]
    },
    
    {
      path: '/404',
      name: 'notFound',
      component:resolve=>require(['../components/common/404'],resolve),
      //component:notFound,
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
    else {
      if(to.path.substr(0,6) === '/admin' && sessionStorage.getItem('user_type') != 'admin'){
        Message({
          showClose: true,
          message: '您当前无权访问该页面',
          type: 'warning'
        });
        return;
      }
      next();
    }
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

