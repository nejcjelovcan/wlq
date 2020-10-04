import { WsSendFunction } from '@wlq/wlq-api/src/ws'

const awsWebsocketSendFunction = (
  api: AWS.ApiGatewayManagementApi,
): WsSendFunction => async event => {
  try {
    api
      .postToConnection({
        ConnectionId: event.connectionId,
        Data: JSON.stringify(event.message),
      })
      .promise()
  } catch (e) {
    console.error('Failed to send to websocket', event)
  }
}

export default awsWebsocketSendFunction
