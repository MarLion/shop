// 导入axios
import axios from 'axios'
// 导入qs库格式化数据
import qs from 'qs';
const baseUrl = 'http://192.168.1.198:6203'
axios.defaults.baseURL = baseUrl

// 获取商品列表
export const getAllProduct = (storeId)=>{
    return axios.post('/goods/getgoodsList',qs.stringify({storeId:storeId}))
}

// 获取商品一级分类
export const getFirstProductCate = ()=>{
    return axios.get('/goodsType/getFirstClassLevel')
}

// 获取商品二级分类
export const getSecondProductCate = (params)=>{
    return axios.post('/goodsType/getSecondClassLevelByFirstClass',qs.stringify(params))
}

// 编辑商品
export const editProduct = (id)=>{
    return  axios.get(`/goods/editGoods?id=${id}`)
}

// 回显非手机规格参数列表
export const ishasProductArguments = (goodsTypeId)=>{
    return axios.post(`/goodsSpecificTemplateValue/getSpecificParamList`,qs.stringify(goodsTypeId))
}