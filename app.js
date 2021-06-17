const { App, ExpressReceiver } = require('@slack/bolt');
const serverlessExpress = require('@vendia/serverless-express');
const Twitter = require('twitter-lite');

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
});

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

app.event('link_shared', async ({ event, client, channel }) => {
  const url = event.links[0].url;
  const parts = url.split("/")
  const id = parts[parts.length - 1];

  try {
    const result = await twitter.get('statuses/show', {
      id: id,
      include_ext_alt_text: true,
      tweet_mode: 'extended',
    });
    const unfurls = {};
    let descriptions = [];

    const hasImage = result.extended_entities;
    if (!hasImage) { return; }

    const missing = result.extended_entities.media.every(img => img.ext_alt_text === null);

    descriptions = missing ? ["could not find alt text."] :
      result.extended_entities.media.map(img => img.ext_alt_text);

    unfurls[url] = { title: descriptions.join("\n") }
    await client.chat.unfurl({ token: process.env.SLACK_BOT_TOKEN, ts: event.message_ts, channel: event.channel, unfurls });
  } catch (err) {
    console.log(err);
  }

});

module.exports.handler = serverlessExpress({
  app: expressReceiver.app
});
