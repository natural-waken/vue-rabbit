// 封装所有和用户相关的接口函数
import request from '@/utils/http'

export const loginAPI = ({ account, password }) => {
    return request({
        url: '/login',
        method: 'POST',
        // 因为是 get 请求  并且是 body  参数   所以要添加  body  配置项
        data: {
            account,
            password
        }
    })
}


// 猜你喜欢接口
// 参数限制 4 条
export const getLikeListAPI = ({ limit = 4 }) => {
    return request({
        url: '/goods/relevant',
        params: {
            limit
        }
    })
}










