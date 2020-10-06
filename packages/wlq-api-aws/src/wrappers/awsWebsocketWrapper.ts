import { AwsWebsocketEventData } from '@wlq/wlq-api-aws/src/extractFromWebsocketEvent'
import { COMMON_HEADERS } from '@wlq/wlq-api-aws/src/wrappers/awsRestRespond'
import { RestResponseError } from '@wlq/wlq-api/lib/esm'
import {
  WebsocketEvent,
  WebsocketEventHandler,
  WebsocketPayload,
  WebsocketErrorPayload,
} from '@wlq/wlq-api/src/websocket'
import { ValidationError } from '@wlq/wlq-model/lib/esm'
import { APIGatewayProxyResult } from 'aws-lambda'
import AWS from 'aws-sdk'
import getWebsocketApiGateway from '../getWebsocketApi'

const awsWebsocketWrapper = async <P extends WebsocketPayload>(
  incomingEvent: WebsocketEvent<P>,
  websocketEventData: Pick<
    AwsWebsocketEventData,
    'websocketEndpoint' | 'BroadcastTopicArn'
  >,
  eventHandler: WebsocketEventHandler<P>,
): Promise<APIGatewayProxyResult> => {
  try {
    const events = await eventHandler(incomingEvent)
    console.log(`Wrapper returned ${events.length} events`)
    for (const event of events) {
      if ('connectionId' in event && event.connectionId) {
        try {
          console.log(
            'Posting event to websocket',
            websocketEventData.websocketEndpoint,
            event.connectionId,
            event.action,
          )
          await getWebsocketApiGateway(websocketEventData.websocketEndpoint)
            .postToConnection({
              ConnectionId: event.connectionId,
              Data: JSON.stringify({ action: event.action, data: event.data }),
            })
            .promise()
        } catch (e) {
          console.error('awsWebsocketHandler postToConnection error')
          console.log(e)
        }
      } else if ('channel' in event && event.channel) {
        try {
          console.log('Publishing event to SNS', event.channel, event.action)
          await getSns()
            .publish({
              Subject: event.action,
              Message: JSON.stringify(event),
              TopicArn: websocketEventData.BroadcastTopicArn,
              MessageAttributes: {
                action: { DataType: 'String', StringValue: event.action },
              },
            })
            .promise()
        } catch (e) {
          console.error('awsWebsocketHandler publish to SNS error')
          console.log(e)
          console.log('TopicArn', websocketEventData.BroadcastTopicArn)
        }
      } else {
        console.error('awsWebsocketHandler invalid websocket event')
        console.log(event)
      }
    }
    return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
  } catch (e) {
    console.error('awsWebsocketHandler error')
    console.log(e)

    // In some cases when eventHandlers raise descriptive exceptions,
    // we want to send those errors to the user
    if (e instanceof RestResponseError || e instanceof ValidationError) {
      const websocketError: WebsocketErrorPayload = {
        action: 'error',
        data: { error: e.message },
      }
      try {
        await getWebsocketApiGateway(websocketEventData.websocketEndpoint)
          .postToConnection({
            ConnectionId: incomingEvent.connectionId,
            Data: websocketError,
          })
          .promise()
      } catch (e) {}
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
