const json5 = require('json5');
const writeFile = require('write-file-promise');
const groupchat = require('../src/externalcontact/groupchat');


groupchat.list({limit: 500}).then(data => {
    return writeFile('./groupchat.list.json5', json5.stringify(data, null, 4), {encoding: 'utf-8'});
});