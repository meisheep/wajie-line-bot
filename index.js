require('dotenv').config()

const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const data = require('all-items.json');

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let msg = '瓦姊我不知道耶';

  const query = event.message.text;

  if (query in data) {
    const list = Object.keys(data[query])
      .map((k) => {
        const last = data[query][k].pop();
        return `${k}，最貴：${last[1]}，最俗：${last[2]}`;
      })
      .join('\n');
    msg = `
      齁來，${query}價格問瓦姊：
      ${list}
    `;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: msg
  });
}

exports.handler = (event, context, cb) => {
  // console.log(event);
  // console.log(event.body.events[0]);

  Promise
    .all(event.body.events.map(handleEvent))
    .then((result) => res.json(result));
};
