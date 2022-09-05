import request from '@/utils/request'
//获取sku图片 /admin/product/spuImageList/{spuId}
export const getSpuImageList = (spuId) => request({ url: `/product/spuImageList/${spuId}` })
//获取平台属性
export const getAttrList = (category1Id, category2Id, category3Id) => request({ url: `/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` })
//获取销售属性
export const getSpuSaleList = (spuId) => request({ url: `/product/spuSaleAttrList/${spuId}` })
//添加sku
export const addSku = (SkuInfo) => request({ url: '/product/saveSkuInfo',method:'post',data:SkuInfo })
//查看sku列表
export const lookSku=(spuId) => request({ url: `/product/findBySpuId/${spuId}`})
//获取sku接口
export const getSkuList=(page,limit) => request({ url: `/product/list/${page}/${limit}`})
//上架/admin/product/onSale/{skuId}
export const onSale=(skuId) => request({ url: `/product/onSale/${skuId}`})
//下架/admin/product/cancelSale/{skuId}
export const cancelSale=(skuId) => request({ url: `/product/cancelSale/${skuId}`})
//查看sku详情
export const getSku=(skuId) => request({ url: `/product/getSkuById/${skuId}`})