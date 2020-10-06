import { APIGatewayProxyEvent } from 'aws-lambda'

const extractFromWebsocketEvent = ({
  requestContext: { domainName, stage, connectionId, routeKey },
  body,
}: APIGatewayProxyEvent) => {
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
  }
}
export default extractFromWebsocketEvent
