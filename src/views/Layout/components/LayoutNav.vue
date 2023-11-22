<script setup>
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

const confirm = () => {
    // 退出登录业务逻辑实现
    // 1. 清除当前用户信息   触发 action
    userStore.clearUserInfo()
    // 2. 跳转到登录页面
    router.push('/login')
}

</script>

<template>
    <nav class="app-topnav">
        <div class="container">
            <ul>
                <!-- 多模板渲染  区分登录和非登录状态 -->

                <!-- 登录和非登录状态适配 -->
                <!-- 适配思路： 登录时显示第一块  非登录时 显示第二块   是否有 token -->
                <template v-if="userStore.userInfo.token">
                    <li>
                        <a href="javascript:;" @click="$router.push('/member')">
                            <!-- 字体图标 -->
                            <i class=" iconfont icon-user"></i>
                            {{ userStore.userInfo.account }}
                        </a>
                    </li>
                    <li>
                        <!-- 退出登录按钮外层已经包裹了对话框组件  包含了确认退出 -->
                        <!-- 这个组件自带个事件  confirm  当点击确认按钮时就会触发 -->
                        <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
                            <template #reference>
                                <a href="javascript:;">退出登录</a>
                            </template>
                        </el-popconfirm>
                    </li>
                    <li><a href="javascript:;" @click="$router.push('/member/order')">我的订单</a></li>
                    <li><a href="javascript:;" @click="$router.push('/member')">会员中心</a></li>
                </template>
                <template v-else>
                    <!-- 跳转到登录页 -->
                    <li><a href="javascript:;" @click="$router.push('/login')">请先登录</a></li>
                    <li><a href="javascript:;">帮助中心</a></li>
                    <li><a href="javascript:;">关于我们</a></li>
                </template>
            </ul>
        </div>
    </nav>
</template>


<style scoped lang="scss">
.app-topnav {
    background: #333;

    ul {
        display: flex;
        height: 53px;
        justify-content: flex-end;
        align-items: center;

        li {
            a {
                padding: 0 15px;
                color: #cdcdcd;
                line-height: 1;
                display: inline-block;

                i {
                    font-size: 14px;
                    margin-right: 2px;
                }

                &:hover {
                    color: $xtxColor;
                }
            }

            ~li {
                a {
                    border-left: 2px solid #666;
                }
            }
        }
    }
}
</style>





