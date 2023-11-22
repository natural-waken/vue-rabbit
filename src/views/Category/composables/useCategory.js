// 封装分类数据业务相关代码
import { getCategoryAPI } from '@/apis/category';
import { ref, onUpdated, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteUpdate } from 'vue-router'


export function useCategory() {
    // 分类数据
    const categoryData = ref({})
    const route = useRoute()

    // 这个参数意思是  如果给我传了参数就使用传来  没有的话就使用  route.params.id
    const getCategory = async (id = route.params.id) => {
        const res = await getCategoryAPI(id)
        categoryData.value = res.result
    }

    // onMounted  使用时候每次点击之后需要刷新    onUpdated
    onMounted(() => {
        getCategory()
    })

    // 目标    路由哦参数变化时候   可以把分类数据接口重新发送
    onBeforeRouteUpdate((to) => {
        console.log('路由变化了');

        // 存在问题    使用最新路由参数请求最新分类数据
        getCategory(to.params.id)
    })

    return {
        categoryData
    }
}