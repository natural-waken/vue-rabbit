import request from '@/utils/http'


// 获取订单接口  渲染个人订单数据

// params: {
//     orderState: 0,  // 订单切换时的状态
//     page: 1,  // 当前页数  获取哪页数据
//     pageSize: 2  // 每页条数
// }



export const getUserOrder = (params) => {
    return request({
        url: '/member/order',
        method: 'GET',
        params
    })
}






