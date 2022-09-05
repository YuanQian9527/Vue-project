import request from '@/utils/request'
//获取品牌管理数据
// export const getTradeMarkList = (page, limit) => request({
//     url: `/product/baseTrademark/${page}/${limit}`,
// })
export const getTradeMarkList = (page, limit) => request.get(`/product/baseTrademark/${page}/${limit}`)
//添加品牌
//修改品牌 需要带品牌id
export const addOrupdateTradeMark = (trademark) => {
    if (trademark.id) {
        return request({
            url: '/product/baseTrademark/update',
            method:'put',
            data:trademark
        })
    } else {
        return request({
            url: '/product/baseTrademark/save',
            method:'post',
            data:trademark
        })
    }
}