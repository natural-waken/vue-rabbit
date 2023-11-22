// 封装倒计时逻辑函数

import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'

export const useCountDown = () => {
    // 1. 响应式数据
    let timer = null
    const time = ref(0)
    // 格式化时间  为  x 分 x 秒
    // 某个数据依赖某个变化  使用计算属性
    const formatTime = computed(() => {
        return dayjs.unix(time.value).format('mm分ss秒')
    })

    // 2. 开启倒计时函数
    const start = (currentTime) => {
        // 开始倒计时逻辑
        // 核心逻辑简写   每隔 1s 就减一
        time.value = currentTime
        timer = setInterval(() => {
            time.value--
        }, 1000)
    }

    // 组件销毁时候  清除定时器
    onUnmounted(() => {
        timer && clearInterval(timer)
    })

    return {
        formatTime,
        start
    }

}
