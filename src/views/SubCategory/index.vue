<script setup>
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/apis/category.js'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// 渲染商品组件
import GoodsItem from '@/views/Home/components/GoodsItem.vue'

// 获取面包屑数据
const categoryData = ref({})
const route = useRoute()
const getCategoryData = async () => {
    const res = await getCategoryFilterAPI(route.params.id)
    categoryData.value = res.result
}

onMounted(() => {
    getCategoryData()
})

// 获取基础列表渲染数据
const goodList = ref([])
// 基础参数
const reqData = ref({
    categoryId: route.params.id,
    page: 1,
    pageSize: 20,
    sortField: 'publishTime'
})
const getGoodList = async () => {
    const res = await getSubCategoryAPI(reqData)
    goodList.value = res.result.items
}

onMounted(() => {
    getGoodList()
})

// tab  切换回调
const tabChange = () => {
    console.log('tab 切换了', reqData.value.sortField);
    reqData.value.page = 1
    getGoodList()
}

// 无限滚动   加载更多数据
const disabled = ref(false)
const load = async () => {
    // 页数加   获取下页数据
    reqData.value.page++
    const res = await getSubCategoryAPI(reqData.value)

    // 新数据  老数据拼接    共同渲染
    goodList.value = [...goodList.value, ...res.result.items]

    // 加载完毕   停止监听
    if (res.result.items.length === 0) {
        disabled.value = true
    }
}

</script>

<template>
    <div class="container ">
        <!-- 面包屑 -->
        <div class="bread-container">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">{{ categoryData.parentName }}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="sub-container">

            <!-- v-model  和下面哪项 name  属性相等时就选中哪个 -->
            <!-- name  是根据接口文档参数中提供的数据 -->
            <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
                <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
                <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
                <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
            </el-tabs>

            <!-- 无限滚动功能 -->
            <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
                <!-- 商品列表-->
                <GoodsItem v-for="good in goodList" :good="good" :key="good.id"></GoodsItem>
            </div>
        </div>
    </div>
</template>



<style lang="scss" scoped>
.bread-container {
    padding: 25px 0;
    color: #666;
}

.sub-container {
    padding: 20px 10px;
    background-color: #fff;

    .body {
        display: flex;
        flex-wrap: wrap;
        padding: 0 10px;
    }

    .goods-item {
        display: block;
        width: 220px;
        margin-right: 20px;
        padding: 20px 30px;
        text-align: center;

        img {
            width: 160px;
            height: 160px;
        }

        p {
            padding-top: 10px;
        }

        .name {
            font-size: 16px;
        }

        .desc {
            color: #999;
            height: 29px;
        }

        .price {
            color: $priceColor;
            font-size: 20px;
        }
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }


}
</style>