'use strict';
import axios from 'axios';
import { Message } from 'element-ui';
import Qs from 'qs';
import router from '../router'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 不显示loading的url
var ajax = axios.create({
    baseURL: '/',
    timeout: 6000,
    crossDomain: true,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    transformRequest: [function (data) {
        let object = data;
        for (let i in object) {
            let value = object[i]
            if (value == null || value === "" || value ==undefined) {
                delete object[i]
            }
        }
        return Qs.stringify(object, { allowDots: true })
    }]
});
// 添加请求拦截器
ajax.interceptors.request.use(function (config) {
        config.headers['Set-Token'] = sessionStorage.getItem('token') || ''
    return config
    // return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

ajax.interceptors.response.use(
    response => {
        const requestUrl = response.request.responseURL || response.config.url
        if (response.data.code == 200) { //响应成功

            return Promise.resolve(response.data);

        } else if (response.data.code == 401) { //账户已在其他地方登陆
            Message.error(response.data.message);
            if (response.data.message === "用户名或密码错误") {
                return Promise.resolve(response.data);
            } else {
                router.push({ path: '/login' });
            }

        } else if (response.data.code == 403) {
            Message.error(response.data.message);
            router.push({ path: '/login' });
        } else {
            if (/nomessage/ig.test(requestUrl)) return Promise.resolve(response.data);
            Message.error(response.data.message || 'unKnow');
        }
        return Promise.reject(response);
    },
    error => {
        if (error.response) {
            if (error.response.status === 500) {
                Message.error(error.response.data.message);
            } else if (error.response.status === 401) {
                router.push({ path: '/login' });
            } else {
                Message.error(error.response.data.message || error.response.statusText);
            }
        } else {
            if (error.code == "ECONNABORTED") {
                Message.error('请求超时！');
            }
        }
        return Promise.reject(error);
    })

export default ajax