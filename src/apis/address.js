// 地址相关 api

import request from '@/utils/http'

// 获取地址
export const getAddress = () => {
    return request({
        url: `/member/address`,
    })
}


// 添加收货地址
// 参数是个对象
export const addAddress = (data) => {
    return request({
        url: `/member/address`,
        method: 'POST',
        data
    })
}