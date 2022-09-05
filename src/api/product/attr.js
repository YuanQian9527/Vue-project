import request from '@/utils/request'
//获取一级分类数据接口
export const getCategory1List = () => request({ url: '/product/getCategory1' })
//获取二级分类数据接口
export const getCategory2List = (category1Id) => request({ url: `/product/getCategory2/${category1Id}` })
//获取三级分类数据接口
export const getCategory3List = (category2Id) => request({ url: `/product/getCategory3/${category2Id}` })

//获取平台属性
export const getAttrList = (category1Id, category2Id, category3Id) => request({ url: `/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` })
//添加属性接口
export const getAttrInfo = (data) => request({ url: '/product/saveAttrInfo', method: 'post', data })
//删除属性接口
export const delAttrInfo = (attrId) => request({ url: `/product/deleteAttr/${attrId}`, method: 'delete'})
