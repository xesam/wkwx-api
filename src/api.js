const Config = require('@xesam/config');
const Token = require('@xesam/token');
const {get, post} = require('./request');

const corp = new Config("wkwx.corp").loadSync();
const cfg = new Config('wkwx.token');

const token = new Token(cfg, () => {
    return get('gettoken', {corpid: corp.CORP_ID, corpsecret: corp.CUSTOMER_SECRET});
});

function res_prepare(res) {
    if (res.errcode === 0) {
        return res;
    } else {
        return Promise.reject(res);
    }
}

exports.get = function (path, params) {
    return token.get().then(({access_token}) => {
        return get(`${path}`, {access_token, ...params}).then(res_prepare);
    });
}

exports.post = function (path, params) {
    return token.get().then(({access_token}) => {
        return post(`${path}?access_token=${access_token}`, params).then(res_prepare);
    });
}












