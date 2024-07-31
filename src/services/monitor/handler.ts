import { SNSEvent } from "aws-lambda";

// a WebHook in my personal Slack channel
const webHookUrl = 'https://hooks.slack.com/services/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';

async function handler(event: SNSEvent, context) {
    // We sendf a HTTP Request to our Slack WebHook
    for (const record of event.Records) {
        await fetch(webHookUrl, {
            method: 'POST',
            body: JSON.stringify({
                "text": `Housting, we have a problem: ${record.Sns.Message}`
            })
        })
    }
}

export {handler}