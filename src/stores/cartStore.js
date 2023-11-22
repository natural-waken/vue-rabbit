// 封装购物车模块

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findnewCartListAPI, delCartAPI } from '@/apis/cart'

// 两个   本地购物车   和   接口购物车
// 如果已经登录了  有 token  就调用接口加入购物车
// 要是还没有登录  就加入本地购物车

export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    const isLogin = computed(() => {
        // 返回 token   根据 token 判断是否登录
        return userStore.userInfo.token
    })

    // 获取最新  更新购物车列表 action
    const updateNewList = async () => {
        const res = await findnewCartListAPI()
        cartList.value = res.result
    }



    // 1. 定义 state  -  cartList
    // 2. 定义 action  -  addCart
    const cartList = ref([])

    // 接受传过来的参数    添加购物车
    // 判断有无 token
    const addCart = async (goods) => {
        if (isLogin.value) {
            const { skuId, count } = goods

            // 登录之后的加入购物车逻辑  调用接口
            await insertCartAPI({ skuId, count })

            // 合并而不是覆盖    登录之前的购物车列表和之后的进行合并
            // cartList.value = [ ...cartList.value, ...res.result ]
            // cartList.value.push(...res.result)
            // console.log(res.result);

            // 这个是直接就覆盖了
            updateNewList()
        }
        else {
            // 添加购物车操作
            // 已添加过   ->   count + 1
            // 未添加过   ->   直接给 cartList 数组中 push  个新数据
            // 思路:  通过匹配传递过来的视频对象中 skuId  能不能再 cartList 中找到   找到了就是添加过   不然就没有
            const item = cartList.value.find((item) => {
                return goods.skuId === item.skuId
            })
            if (item) {
                // 找到了
                console.log('找到了');
                item.count++
            }
            else {
                // 没找到
                cartList.value.push(goods)
            }
        }
    }

    // 删除购物车物品
    const delCart = async (skuId) => {
        if (isLogin.value) {
            // 调用接口实现接口购物车中删除功能
            await delCartAPI([skuId])
            updateNewList()
        }
        else {
            // 思路:
            // 1. 找到要删除的下标值  -   splice
            // 2. 使用数组过滤方法   -   filter
            // const index = cartList.value.findIndex((item) => {
            //     return skuId === item.skuId
            // })
            // cartList.value.splice(index, 1)

            cartList.value = cartList.value.filter((item) => {
                return item.skuId !== skuId
            })
        }
    }

    // 清除购物车
    const clearCart = () => {
        cartList.value = []
    }

    // 单选功能实现
    const singleCheck = (skuId, selected) => {
        // 通过 skuId 找到要修改的那一项  然后将它的 selected 修改为传过来的 selected
        const item = cartList.value.find((item) => {
            return item.skuId === skuId
        })
        item.selected = selected
    }

    // 全选功能实现
    const allCheck = (selected) => {
        // 把 cartList 中每项 selected 都设置为当前全选框状态
        cartList.value.forEach(item => {
            item.selected = selected
        })
    }


    // 计算属性统计商品数量价格
    // 1. 总数量  所有下 count 之和
    // 2. 总价  所有项 count * price 之和
    const allCount = computed(() => {
        return cartList.value.reduce((a, c) => {
            return a + c.count
        }, 0)
    })
    const allPrice = computed(() => {
        return cartList.value.reduce((a, c) => a + c.count * c.price, 0)
    })
    // 全选功能实现
    // 判断是否全选
    const isAll = computed(() => {
        return cartList.value.every((item) => {
            return item.selected
        })
    })

    // 3. 已选择数量
    const selectedCount = computed(() => {
        return cartList.value.filter((item) => {
            return item.selected
        }).reduce((a, c) => {
            return a + c.count
        }, 0)
    })
    // 4. 已选择商品价钱合计
    const selectedPrice = computed(() => {
        return cartList.value.filter((item) => {
            return item.selected
        }).reduce((a, c) => {
            return a + c.count * c.price
        }, 0)
    })





    return {
        cartList,
        allCount,
        allPrice,
        isAll,
        allCheck,
        clearCart,
        updateNewList,
        selectedCount,
        selectedPrice,
        singleCheck,
        addCart,
        delCart
    }
}, {
    persist: true
})












