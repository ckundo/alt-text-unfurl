const { App, ExpressReceiver } = require('@slack/bolt');
const Twitter = require('twitter-v2');
const serverlessExpress = require('@vendia/serverless-express');

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true
});

// const client = new Twitter({
//   consumer_key: process.env.TWITTER_KEY,
//   consumer_secret: process.env.TWITTER_SECRET,
// });

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
});

app.event('link_shared', async ({ event, client, channel }) => {
  const url = event.links[0].url;
  const parts = url.split("/")
  // const id = parts[parts.length - 1];

  // const { data } = await client.get('tweets', {
  //   id,
  //   expansions: 'attachments.media_keys'
  // });

  const unfurls = {}

  unfurls[url] = { title: "something" }

  client.chat.unfurl({ token: process.env.SLACK_BOT_TOKEN, ts: event.message_ts, channel: event.channel, unfurls });
});

module.exports.handler = serverlessExpress({
  app: expressReceiver.app
});
