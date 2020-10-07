import { RestResponseError } from '@wlq/wlq-api/src/rest'
import {
  WebsocketBroadcast,
  WebsocketErrorPayload,
  WebsocketEvent,
  WebsocketEventHandlerReturn,
} from '@wlq/wlq-api/src/websocket'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { APIGatewayProxyResult } from 'aws-lambda'
import AWS from 'aws-sdk'
import { AwsWebsocketEventData } from '../extractFromWebsocketEvent'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'

export const publish = async (
  event: WebsocketEvent | WebsocketBroadcast,
  topic: string,
) =>
  getSns()
    .publish({
      Subject: event.action,
      Message: JSON.stringify(event),
      TopicArn: topic,
      MessageAttributes: {
        action: { DataType: 'String', StringValue: event.action },
      },
    })
    .promise()

// TODO It would be great if we could specify when calling whether
// the payloads are sent to broadcast topic on SNS or immediately
// broadcasted (regardless of .channel or .connectionId)
const awsWebsocketWrapper = async <E>(
  incomingEvent: E,
  websocketEventData: Pick<AwsWebsocketEventData, 'BroadcastTopicArn'>,
  eventHandler: (incomingEvent: E) => WebsocketEventHandlerReturn,
): Promise<APIGatewayProxyResult> => {
  try {
    const events = await eventHandler(incomingEvent)
    console.log(`Wrapper returned ${events.length} events`)
    for (const event of events) {
      console.log('Posting to SNS')
      try {
        await publish(event, websocketEventData.BroadcastTopicArn)
      } catch (e) {
        console.error('awsWebsocketHandler SNS publish error')
        console.log(e)
      }
    }
    return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
  } catch (e) {
    // In some cases when eventHandlers raise descriptive exceptions,
    // we want to send those errors to the user
    if (e instanceof RestResponseError || e instanceof ValidationError) {
      const websocketError: WebsocketErrorPayload = {
        action: 'error',
        data: { error: e.message },
      }
      try {
        if ('connectionId' in incomingEvent)
          await publish(
            { connectionId: incomingEvent['connectionId'], ...websocketError },
            websocketEventData.BroadcastTopicArn,
          )
      } catch (e) {}
    } else {
      console.error('awsWebsocketWrapper error')
      console.log(e)
    }

    return { statusCode: 500, headers: COMMON_HEADERS, body: '{}' }
  }
}
export default awsWebsocketWrapper

let getSnsCache: AWS.SNS
const getSns = (): AWS.SNS => {
  if (!getSnsCache) getSnsCache = new AWS.SNS()
  return getSnsCache
}
