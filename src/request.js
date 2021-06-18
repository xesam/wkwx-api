const axios = require('axios');

axios.defaults.baseURL = 'https://qyapi.weixin.qq.com/cgi-bin/';

function get(path, params) {
    return axios.get(path, {params}).then(res => {
        return res.data;
    });
}

function post(path, params) {
    return axios.post(path, params).then(res => {
        return res.data;
    });
}

exports.get = get;
exports.post = post;