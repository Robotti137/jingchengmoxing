import { get, post, deletes, put } from './axios.js';//导入axios实例文件中方法
import { requestUrl } from '../default'

//用户登录
export const userByLogin = (data) => {
    return post(`${requestUrl}/users/login`, data);
}

//增加项目规格
export const postSpecification = (data) => {
    return post(`${requestUrl}/specification`, data);
}

//获取项目数据
export const getSpecification = (data) => {
    return get(`${requestUrl}/specification`, data);
}

//删除项目数据
export const deleteSpecification = (id) => {
    return deletes(`${requestUrl}/specification/${id}`);
}

//获修改项目数据
export const putSpecification = (id, data) => {
    return put(`${requestUrl}/specification/${id}`, data);
}