<script setup>
import { getCheckInfoAPI, createOrderAPI } from '@/apis/checkout';
import { ref, onMounted } from 'vue'
import { getAddress, addAddress } from '@/apis/address'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore';
// 提示框
import { ElMessage } from 'element-plus'


const router = useRouter()  // 路由实例
const cartStore = useCartStore()  // 购物车

const checkInfo = ref({})  // 订单对象
const curAddress = ref({})  // 默认地址项

// 一、渲染获取订单详情信息
const getCheckInfo = async () => {
    const res = await getCheckInfoAPI()
    checkInfo.value = res.result

    // 适配默认地址
    // 从地址列表中筛选出来  isDefault === 0  那项
    const item = checkInfo.value.userAddresses.find(item => {
        return item.isDefault === 0
    })
    curAddress.value = item
    console.log(checkInfo.value);

}
onMounted(() => {
    getCheckInfo()
})


// 二、地址相关
// a 控制弹窗打开

// 添加地址
// 用户自己添加新地址
// 需要自己填写信息
// 点击按钮之后显示
const showAdd = ref(false)
// 绑定地址规则
// 2. 准备规则对象
// 3. 收集用户提交数据
const form = ref({
    receiver: '',
    contact: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    address: '',
    postalCode: '',
    addressTags: '',
    isDefault: 0,
    fullLocation: '',
})
const rules = {
    address: [
        { required: true, message: 'address 不能为空', trigger: 'blur' }
    ],
    addressTags: [
        { required: true, message: 'addressTags 不能为空', trigger: 'blur' },
    ],
    cityCode: [
        { required: true, message: 'cityCode 不能为空', trigger: 'blur' },
    ],
    contact: [
        { required: true, message: 'contact 不能为空', trigger: 'blur' },
    ],
    countyCode: [
        { required: true, message: 'countyCode 不能为空', trigger: 'blur' },
    ],
    fullLocation: [
        { required: true, message: 'fullLocation 不能为空', trigger: 'blur' },
    ],
    isDefault: [
        { required: true, message: 'isDefault 不能为空', trigger: 'blur' },
    ],
    postalCode: [
        { required: true, message: 'postalCode 不能为空', trigger: 'blur' },
    ],
    provinceCode: [
        { required: true, message: 'provinceCode 不能为空', trigger: 'blur' },
    ],
    receiver: [
        { required: true, message: 'receiver 不能为空', trigger: 'blur' },
    ],

}

// 4. 点击按钮确认提交
// 调用接口
// 获取 form 实例做统一校验
const formRef = ref(null)
const doSubmit = () => {

    // 调用实例方法
    formRef.value.validate(async (valid) => {
        // valid: 所有表单都通过校验   才为 true
        console.log(valid);   //  bool

        // 以 valid 作为判断条件   如果通过校验才能执行登录逻辑
        if (valid) {
            // TODO  LOGIN
            // 存入数据
            console.log(form.value);
            const res = await addAddress(form.value)
            console.log(res);



            // 1. 提示用户
            ElMessage({ type: 'success', message: '添加成功' })
            // 2. 取消弹窗
            showAdd.value = false
            form.value = {}
        }
    })
}

const showDialog = ref(false)
// 点击按钮之后切换成 true

// b 切换地址
const activeAddress = ref({})

// 就是点击哪个对象就将这个对象赋值给  激活状态
// 也就是点击哪项   就将哪项记录下来
const switchAddress = (item) => {
    activeAddress.value = item
}
// 点击确认按钮之后就当前地址覆盖默认渲染地址
const confirm = async () => {
    curAddress.value = activeAddress.value
    // 关掉弹窗
    showDialog.value = false
    activeAddress.value = {}
}

// 切换地址之后去后面数据修改  调用接口
// 获取当前用户地址
const addressData = ref([])
const getAddressAPI = async () => {
    showDialog.value = true
    const res = await getAddress()
    addressData.value = res.result
}





// 三、提交订单信息
// 创建订单信息
// 1. 封装生成订单接口
// 2. 点击按钮调用接口获取响应数据中 id
// 3. 携带 id  参数进行路由跳转到支付页面
const createOrder = async () => {
    const res = await createOrderAPI({
        deliveryTimeType: 1,
        payType: 1,
        payChannel: 1,
        buyerMessage: '',
        // 数组中每项是个对象   现在是对象中只有两个这个 skuId  和  count  属性
        goods: checkInfo.value.goods.map(item => {
            return {
                skuId: item.skuId,
                count: item.count
            }
        }),
        addressId: curAddress.value.id
    })

    // id
    const orderId = res.result.id
    // 注意这里路由传参跳转到支付页  是需要 query 参数
    router.push({
        path: '/pay',
        query: {
            id: orderId
        }
    })

    // 跳转到支付页之后要清空购物车
    // 直接调用更新购物车
    cartStore.updateNewList()
}


</script>

<template>
    <div class="xtx-pay-checkout-page">
        <div class="container">
            <div class="wrapper">
                <!-- 收货地址 -->
                <h3 class="box-title">收货地址</h3>
                <div class="box-body">
                    <div class="address">
                        <div class="text">

                            <!-- 地址对象 -->
                            <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
                            <ul v-else>
                                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
                            </ul>
                        </div>
                        <div class="action">
                            <el-button size="large" @click="getAddressAPI">切换地址</el-button>
                            <el-button size="large" @click="showAdd = true">添加地址</el-button>
                        </div>
                    </div>
                </div>
                <!-- 商品信息 -->
                <h3 class="box-title">商品信息</h3>
                <div class="box-body">
                    <table class="goods">
                        <thead>
                            <tr>
                                <th width="520">商品信息</th>
                                <th width="170">单价</th>
                                <th width="170">数量</th>
                                <th width="170">小计</th>
                                <th width="170">实付</th>
                            </tr>
                        </thead>

                        <tbody>
                            <!-- 商品渲染 -->
                            <tr v-for="i in checkInfo.goods" :key="i.id">
                                <td>
                                    <a href="javascript:;" class="info">
                                        <img :src="i.picture" alt="">
                                        <div class="right">
                                            <p>{{ i.name }}</p>
                                            <p>{{ i.attrsText }}</p>
                                        </div>
                                    </a>
                                </td>
                                <td>&yen;{{ i.price }}</td>
                                <td>{{ i.price }}</td>
                                <td>&yen;{{ i.totalPrice }}</td>
                                <td>&yen;{{ i.totalPayPrice }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 配送时间 -->
                <h3 class="box-title">配送时间</h3>
                <div class="box-body">
                    <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
                    <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
                    <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
                </div>

                <!-- 支付方式 -->
                <h3 class="box-title">支付方式</h3>
                <div class="box-body">
                    <a class="my-btn active" href="javascript:;">在线支付</a>
                    <a class="my-btn" href="javascript:;">货到付款</a>
                    <span style="color:#999">货到付款需付5元手续费</span>
                </div>
                <!-- 金额明细 -->
                <h3 class="box-title">金额明细</h3>
                <div class="box-body">
                    <div class="total">
                        <dl>
                            <dt>商品件数：</dt>
                            <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
                        </dl>
                        <dl>
                            <dt>商品总价：</dt>
                            <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
                        </dl>
                        <dl>
                            <dt>运<i></i>费：</dt>
                            <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
                        </dl>
                        <dl>
                            <dt>应付总额：</dt>
                            <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
                        </dl>
                    </div>
                </div>
                <!-- 提交订单 -->
                <div class="submit">
                    <!-- 绑定事件提交订单 -->
                    <el-button @click="createOrder" type="primary" size="large">提交订单</el-button>
                </div>
            </div>
        </div>
    </div>

    <!-- 弹窗交互 -->
    <!-- 切换地址 -->
    <el-dialog v-model="showDialog" title="切换收货地址" width="30%" center>
        <div class="addressWrapper">

            <!-- 点击切换地址 -->
            <!-- 渲染时候  激活状态 id  要是等于当前渲染时的 id  那就高亮激活 -->
            <!-- 也就是点击了哪项就将哪项高亮激活 -->
            <div class="text item" :class="{ active: activeAddress.id === item.id }" @click="switchAddress(item)"
                v-for="item in addressData" :key="item.id">
                <ul>
                    <li><span>收<i />货<i />人：</span>{{ item.receiver }} </li>
                    <li><span>联系方式：</span>{{ item.contact }}</li>
                    <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
                </ul>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showDialog = false">取消</el-button>
                <!-- 点击确认覆盖默认地址 -->
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 添加地址 -->
    <!-- 来  自己写  我就不信了 -->
    <el-dialog v-model="showAdd" title="添加新地址" center>
        <div class="form">

            <!-- 绑定表单对象  规则对象 -->
            <!-- 组件中要求使用 prop  绑定规则 -->
            <!-- model  绑定 formData 数据 -->
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="87px" status-icon>

                <el-form-item prop="receiver" label="receiver">
                    <el-input v-model="form.receiver" />
                </el-form-item>
                <el-form-item prop="address" label="address">
                    <el-input v-model="form.address" />
                </el-form-item>
                <el-form-item prop="addressTags" label="addressTags">
                    <el-input v-model="form.addressTags" />
                </el-form-item>

                <el-form-item prop="cityCode" label="cityCode">
                    <el-input v-model="form.cityCode" />
                </el-form-item>
                <el-form-item prop="contact" label="contact">
                    <el-input v-model="form.contact" />
                </el-form-item>

                <el-form-item prop="countyCode" label="countyCode">
                    <el-input v-model="form.countyCode" />
                </el-form-item>
                <el-form-item prop="fullLocation" label="fullLocation">
                    <el-input v-model="form.fullLocation" />
                </el-form-item>
                <el-form-item prop="isDefault" label="isDefault">
                    <el-input v-model="form.isDefault" />
                </el-form-item>
                <el-form-item prop="postalCode" label="postalCode">
                    <el-input v-model="form.postalCode" />
                </el-form-item>
                <el-form-item prop="provinceCode" label="provinceCode">
                    <el-input v-model="form.provinceCode" />
                </el-form-item>



                <!-- 登录按钮做点击事件 -->
                <el-button size="large" class="subBtn" @click="doSubmit">确认提交</el-button>
            </el-form>
        </div>
    </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
    margin-top: 20px;

    .wrapper {
        background: #fff;
        padding: 0 20px;

        .box-title {
            font-size: 16px;
            font-weight: normal;
            padding-left: 10px;
            line-height: 70px;
            border-bottom: 1px solid #f5f5f5;
        }

        .box-body {
            padding: 20px 0;
        }
    }
}

.address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;

        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }

        >ul {
            flex: 1;
            padding: 20px;

            li {
                line-height: 30px;

                span {
                    color: #999;
                    margin-right: 5px;

                    >i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }

        >a {
            color: $xtxColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }

    .action {
        width: 420px;
        text-align: center;

        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;

            &:first-child {
                margin-right: 10px;
            }
        }
    }
}

.goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    .info {
        display: flex;
        text-align: left;

        img {
            width: 70px;
            height: 70px;
            margin-right: 20px;
        }

        .right {
            line-height: 24px;

            p {
                &:last-child {
                    color: #999;
                }
            }
        }
    }

    tr {
        th {
            background: #f5f5f5;
            font-weight: normal;
        }

        td,
        th {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid #f5f5f5;

            &:first-child {
                border-left: 1px solid #f5f5f5;
            }

            &:last-child {
                border-right: 1px solid #f5f5f5;
            }
        }
    }
}

.my-btn {
    width: 228px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-right: 25px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
        border-color: $xtxColor;
    }
}

.total {
    dl {
        display: flex;
        justify-content: flex-end;
        line-height: 50px;

        dt {
            i {
                display: inline-block;
                width: 2em;
            }
        }

        dd {
            width: 240px;
            text-align: right;
            padding-right: 70px;

            &.price {
                font-size: 20px;
                color: $priceColor;
            }
        }
    }
}

.submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
}

.addressWrapper {
    max-height: 500px;
    overflow-y: auto;
}

.text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    &.item {
        border: 1px solid #f5f5f5;
        margin-bottom: 10px;
        cursor: pointer;

        &.active,
        &:hover {
            border-color: $xtxColor;
            background: lighten($xtxColor, 50%);
        }

        >ul {
            padding: 10px;
            font-size: 14px;
            line-height: 30px;
        }
    }
}

.subBtn {
    margin-left: 200px;
}
</style>