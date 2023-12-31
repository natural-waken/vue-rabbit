import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 引入插件
// 导入按需引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 配置插件
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [
                // 1. 配置 elementPlus  采用 sass  样式配色系统
                ElementPlusResolver({ importStyle: "sass" })
            ],
        }),
        // Components({
        //   resolvers: [ElementPlusResolver()],
        // }),
        // 按需定制主题配置
        // ElementPlus({
        //   useSource: true,
        // }),
    ],
    resolve: {
        // 实际的路径转换  @  ->  src
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    css: {
        preprocessorOptions: {
            scss: {
                // 2. 自动导入定制化样式文件进行样式覆盖
                // 自动导入scss文件
                additionalData: `
                    @use "@/styles/element/index.scss" as *;
                    @use "@/styles/var.scss" as *;
                `,
            }
        }
    }
})













