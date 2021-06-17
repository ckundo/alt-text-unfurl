# Alt Text Unfurl for Slack

Slack does not preview (unfurl) alt text from tweets with images. Add this integration to get alt text unfurling.

## Installation

The project runs on AWS Lambda.

1. clone the repo and `npm install`.
1. run `brew install awscli && aws configure` to set your AWS access tokens.
1. copy `.env.sample` to `.env` and set your Twitter and Slack secrets.
1. run `npx serverless deploy`.
1. copy the lambda url printed in the output, and add it to the Event Subscriptions Slack app config.

## Usage

In Slack:

`/invite @Alt Text Unfurl`

Paste a link to a tweet that has alt text into the channel. For example https://twitter.com/philosophequeer/status/1404408769551994880
