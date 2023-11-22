import request from '@/utils/http'

// 支付页面 获取订单详情
export const getOrderAPI = (id) => {
    return request({
        url: `/member/order/${id}`
    })
}






