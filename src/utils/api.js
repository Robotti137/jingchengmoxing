import { get, post, deletes, put } from './axios.js';//导入axios实例文件中方法
import { requestUrl } from '../default'

//用户登录
export const userByLogin = (data) => {
    return post(`${requestUrl}/users/login`, data);
}

//增加项目规格
export const postProject = (data) => {
    return post(`${requestUrl}/project`, data);
}

//获取项目数据
export const getProject = (data) => {
    return get(`${requestUrl}/project`, data);
}

//删除项目数据
export const deleteProject = (id) => {
    return deletes(`${requestUrl}/project/${id}`);
}

//获修改项目数据
export const putProject = (id, data) => {
    return put(`${requestUrl}/project/${id}`, data);
}

//增加立项申请
export const postApplication = (data) => {
    return post(`${requestUrl}/application`, data);
}

//获取立项申请
export const getApplication = (data) => {
    return get(`${requestUrl}/application`, data);
}

//获取立项申请
export const deleteApplication = (id) => {
    return deletes(`${requestUrl}/application/${id}`);
}

//修改立项申请
export const putApplication = (id, data) => {
    return put(`${requestUrl}/application/${id}`, data);
}

//立项申请签字
export const postSignature = (data) => {
    return post(`${requestUrl}/application/signature`, data);
}