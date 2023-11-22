// 管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'  // 合并购物车列表

export const useUserStore = defineStore('user', () => {
    // 购物车 cartStore
    const cartStore = useCartStore()
    // 1. 定义管理用户数据的 state
    const userInfo = ref({})

    // 2. 定义获取接口数据的 action  函数
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password })
        userInfo.value = res.result

        // 登录成功之后就合并购物车
        mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }))
        // 然后更新获取最新数据
        cartStore.updateNewList()
    }

    // 退出时清除用户信息
    const clearUserInfo = () => {
        userInfo.value = {}
        // 清除购物车  action
        cartStore.clearCart()
    }

    // 3. 以对象格式把 state  和  action  return
    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
}, {
    persist: true
})



















