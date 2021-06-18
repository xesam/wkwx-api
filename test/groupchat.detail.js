const fs = require('fs');
const json5 = require('json5');
const readFiles = require('read-files-promise');
const groupchat = require('../src/externalcontact/groupchat');
const arrayAsyncQueue = require("array-async-queue");

let details = [];

readFiles(['./groupchat.list.json5'], {encoding: 'utf-8'})
    .then(json5.parse).then(chats => {
    arrayAsyncQueue(chats, 1, (chat, stop) => {
        console.log(chat);
        return groupchat.get(chat).then(data => {
            details.push(data);
            fs.writeFileSync('./groupchat.detail.json5', json5.stringify(details, null, 4));
        }).catch(err => {
            console.error(err);
            stop();
        });
    });
});