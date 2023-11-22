// 导入使用 vueUse  插件函数   实现是否进入视口监测
import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
    install(app) {
        // 懒加载指令逻辑
        // 定义全局指令
        app.directive('img-lazy', {
            mounted(el, binding) {
                // el:  指令绑定的那个元素  img
                // binding:  binding.value    指令等于号后面绑定的表达式值    图片 url
                // console.log(el, binding.value);

                // vueUse  提供函数
                // 首参数是监听谁就写谁
                // 解构出  stop  方法    首次加载之后就不加载了
                const { stop } = useIntersectionObserver(
                    el,
                    ([{ isIntersecting }]) => {
                        if (isIntersecting) {
                            // 进入视口区域
                            el.src = binding.value
                            stop()
                        }
                    },
                )
            }
        })

    }
}







