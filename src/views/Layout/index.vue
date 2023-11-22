<script setup>

import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutFixed from './components/LayoutFixed.vue'

// 触发获取导航列表  action
// 这里就是 layout 通过 store 发起请求，两个子组件通过 store 拿到请求后数据
import { useCategoryStore } from '@/stores/categoryStore'
import { onMounted } from 'vue'

const categoryStore = useCategoryStore()

onMounted(() => {
    // 调用获取数据方法
    categoryStore.getCategory()
})

</script>

<template>
    <LayoutFixed />
    <LayoutNav />
    <LayoutHeader />

    <!-- 添加 key  破坏复用机制   强制销毁重建 -->
    <!-- <RouterView :key="$route.fullPath" /> -->
    <RouterView />
    <LayoutFooter />
</template>






