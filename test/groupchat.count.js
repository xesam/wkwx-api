const fs = require('fs');
const xlsx = require('node-xlsx');
const json5 = require('json5');
const readFiles = require('read-files-promise');
const _ = require('lodash');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

function getDates(earliest) {
    let dates = [];
    const now = dayjs();
    for (let i = earliest; !i.isAfter(now); i = i.add(1, 'day')) {
        dates.push(i);
    }
    return dates;
}

function count_chat(chat, dates) {
    chat.members = dates.map(date => ({date: date.format('YYYY-MM-DD'), count: 0, sum: 0}));
    chat.member_list.forEach(member => {
        const join_day = dayjs(member.join_time * 1000).startOf('day');
        const days = Math.ceil(dayjs.duration(join_day.diff(dates[0])).asDays());
        chat.members[days].count++;
    });
    chat.members.forEach((ele, index, arr) => {
        ele.sum = (arr[index - 1] ? arr[index - 1].sum : 0) + ele.count
    });
    return chat;
}

readFiles(['./groupchat.detail.json5'], {encoding: 'utf-8'})
    .then(json5.parse)
    .then(chats => {
        const oldest = _.minBy(chats, 'create_time');
        const earliest = dayjs(oldest.create_time * 1000).startOf('day');
        const dates = getDates(earliest);
        const date_chats = chats.map(chat => {
            return count_chat(chat, dates);
        });
        fs.writeFileSync('./groupchat.count.json5', json5.stringify(date_chats, null, 4));
        const chatObj = [
            {
                name: 'count',
                data: [
                    ['群名', ...dates.map(ele => {
                        return ele.format('YYYY-MM-DD')
                    })],
                    ...date_chats.map(chat => {
                        return [chat.name, ...chat.members.map(ele => ele.count)]
                    })
                ]
            },
            {
                name: 'sum',
                data: [
                    ['群名', ...dates.map(ele => {
                        return ele.format('YYYY-MM-DD')
                    })],
                    ...date_chats.map(chat => {
                        return [chat.name, ...chat.members.map(ele => ele.sum)]
                    })
                ]
            }
        ];
        fs.writeFileSync('./群统计.xlsx', xlsx.build(chatObj), "binary");
    });