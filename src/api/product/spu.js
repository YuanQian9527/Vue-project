import request from '@/utils/request'
//获取spu列表数据接口
export const getSpuList = (page, limit, category3Id) => request({ url: `/product/${page}/${limit}`, method: 'get', params: { category3Id } })
//获取spu信息
export const getSpu = (spuId) => request({ url: `/product/getSpuById/${spuId}` })
//获取品牌信息 /admin/product/baseTrademark/getTrademarkList
export const getTrademarkList = () => request({ url: '/product/baseTrademark/getTrademarkList' })
//获取sku图片 /admin/product/spuImageList/{spuId}
export const getSpuImageList = (spuId) => request({ url: `/product/spuImageList/${spuId}` })
//获取销售属性
export const getBaseSaleAttrList = () => request({ url: '/product/baseSaleAttrList' })
//添加spu和修改spu
export const addOrUpdateSpuList = (spuInfo) => { 
    if (spuInfo.id) {
        request ({url:'/product/updateSpuInfo',method:'post',data:spuInfo})
    } else {
        request ({url:'/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}
//删除spu
export const delSpu = (spuId) => request({ url: `/product/deleteSpu/${spuId}`,method:'delete'})