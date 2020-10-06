import { APIGatewayProxyEvent } from 'aws-lambda'

const extractFromWebsocketEvent = ({
  requestContext: { domainName, stage, connectionId, routeKey },
  body,
}: APIGatewayProxyEvent) => {
  let data: { [key: string]: any } = {}
  if (body) {
    data = JSON.parse(body)
  }
  return {
    connectionId,
    routeKey,
    data,
    websocketEndpoint: `${domainName}/${stage}`,
  }
}
export default extractFromWebsocketEvent
