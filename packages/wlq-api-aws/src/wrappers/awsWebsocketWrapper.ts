import { AwsWebsocketEventData } from '@wlq/wlq-api-aws/src/extractFromWebsocketEvent'
import { COMMON_HEADERS } from '@wlq/wlq-api-aws/src/wrappers/awsRestRespond'
import {
  WebsocketEvent,
  WebsocketEventHandler,
  WebsocketPayload,
} from '@wlq/wlq-api/src/websocket'
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
          console.log('Publishing event to SNS')
          console.log(event)
          await getSns()
            .publish({
              Subject: event.action,
              Message: JSON.stringify(event),
              TopicArn: websocketEventData.BroadcastTopicArn,
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
    return { statusCode: 500, headers: COMMON_HEADERS, body: '{}' }
  }
}
export default awsWebsocketWrapper

let getSnsCache: AWS.SNS
const getSns = (): AWS.SNS => {
  if (!getSnsCache) getSnsCache = new AWS.SNS()
  return getSnsCache
}
