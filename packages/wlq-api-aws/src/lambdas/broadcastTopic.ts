import getRoomParticipantsCallback from '../callbacks/getRoomParticipantsCallback'
import getWebsocketApiGateway from '../getWebsocketApi'
import { WebsocketBroadcast, WebsocketEvent } from '@wlq/wlq-api/src/websocket'
import { SNSHandler } from 'aws-lambda'
import getDatabaseProps from '../getDatabaseProps'

const DbProps = getDatabaseProps()

const getRoomConnectionIds = async (roomId: string): Promise<string[]> => {
  return (await getRoomParticipantsCallback(DbProps)(roomId)).map(
    p => p.connectionId,
  )
}

export const handler: SNSHandler = async event => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message) as
      | WebsocketBroadcast
      | WebsocketEvent
    let connectionIds: string[] = []

    if ('connectionId' in message && message.connectionId)
      connectionIds.push(message.connectionId)
    if ('channel' in message && message.channel)
      connectionIds = await getRoomConnectionIds(message.channel)

    const websocketApi = getWebsocketApiGateway(process.env.WEBSOCKET_ENDPOINT!)
    if (connectionIds.length > 0) {
      console.log('Broadcasting message', message)
      const promises = connectionIds.map(async ConnectionId => {
        try {
          console.log('Broadcasting to', ConnectionId)
          await websocketApi
            .postToConnection({
              ConnectionId,
              Data: JSON.stringify({
                action: message.action,
                data: message.data,
              }),
            })
            .promise()
        } catch (e) {
          console.error('broadcastTopic Could not send to websocket')
          console.log(e)
        }
      })
      await Promise.all(promises)
    } else {
      console.error('broadcastTopic No recipients')
      console.log(message)
    }
  }
}
