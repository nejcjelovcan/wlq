import { APIGatewayProxyEvent, Context } from 'aws-lambda'

export type AwsWebsocketEventData = {
  connectionId?: string
  routeKey?: string
  data: { [key: string]: any }
  websocketEndpoint: string
  BroadcastTopicArn: string
}

export const getBroadcastTopic = (context: Context) => {
  const functionArnCols = context.invokedFunctionArn.split(':')
  const region = functionArnCols[3]
  const accountId = functionArnCols[4]
  return `arn:aws:sns:${region}:${accountId}:${process.env.BROADCAST_TOPIC!}`
}

const extractFromWebsocketEvent = (
  {
    requestContext: { domainName, stage, connectionId, routeKey },
    body,
  }: APIGatewayProxyEvent,
  context: Context,
): AwsWebsocketEventData => {
  const BroadcastTopicArn = getBroadcastTopic(context)
  let data: { [key: string]: any } = {}
  if (body) {
    // body is WebsocketPayload (but the action is already in routeKey)
    data = JSON.parse(body)?.data ?? {}
  }
  return {
    connectionId,
    routeKey,
    data,
    websocketEndpoint: `${domainName}/${stage}`,
    BroadcastTopicArn,
  }
}
export default extractFromWebsocketEvent
