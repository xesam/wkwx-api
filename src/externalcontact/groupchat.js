const api = require('../api');

function list({ limit }) {
    return api.post(`externalcontact/groupchat/list`, {
        limit
    }).then(res => res.group_chat_list);
}

function get({ chat_id }) {
    return api.post(`externalcontact/groupchat/get`, {
        chat_id,
        need_name: '1'
    }).then(res => res.group_chat)
}

exports.list = list;
exports.get = get;