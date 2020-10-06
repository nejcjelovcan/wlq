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
  websocketEndpoint: string,
  eventHandler: WebsocketEventHandler<P>,
): Promise<APIGatewayProxyResult> => {
  try {
    const events = await eventHandler(incomingEvent)
    for (const event of events) {
      if ('connectionId' in event && event.connectionId) {
        try {
          await getWebsocketApiGateway(websocketEndpoint)
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
          await getSns()
            .publish({
              Subject: event.action,
              Message: JSON.stringify(event),
              TopicArn: process.env.BROADCAST_TOPIC!,
            })
            .promise()
        } catch (e) {
          console.error('awsWebsocketHandler publish to SNS error')
          console.log(e)
        }
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
