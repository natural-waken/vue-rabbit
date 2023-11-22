// createRouter  创建 router 实例对象
// createWebHistory   创建 history 模式路由

import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'
import SubCategory from '@/views/SubCategory/index.vue'
import Detail from '@/views/Detail/index.vue'
import CartList from '@/views/CartList/index.vue'  // 二级路由 
import Checkout from '@/views/Checkout/index.vue'
import Pay from '@/views/Pay/index.vue'
import PayBack from '@/views/Pay/PayBack.vue'
import Member from '@/views/Member/index.vue'  // 个人中心  二级路由
import UserInfo from '@/views/Member/components/UserInfo.vue'  // 三级路由
import UserOrder from '@/views/Member/components/UserOrder.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    // path  和  component  对应关系位置
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '',
                    component: Home
                },
                {
                    // 需要个占位的路由参数
                    path: 'category/:id',
                    component: Category
                },
                {
                    path: 'category/sub/:id',
                    component: SubCategory
                },
                {
                    path: 'detail/:id',
                    component: Detail
                },
                {
                    path: 'cartlist',
                    component: CartList
                },
                {
                    path: 'checkout',
                    component: Checkout
                },
                {
                    path: 'pay',
                    component: Pay
                },
                {
                    path: 'paycallback',
                    component: PayBack
                },
                {
                    path: 'member',
                    component: Member,
                    children: [
                        // 三级路由
                        {
                            // 这样显示二级路由时候就默认显示这个组件了
                            path: '',
                            component: UserInfo
                        },
                        {
                            path: 'order',
                            component: UserOrder
                        }
                    ]
                },
            ]
        },
        {
            path: '/login',
            component: Login
        }
    ],

    // 路由滚动行为定制
    scrollBehavior() {
        return {
            top: 0
        }
    }
})

export default router























