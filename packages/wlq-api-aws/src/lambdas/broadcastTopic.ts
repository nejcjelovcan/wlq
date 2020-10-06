import getRoomParticipantsCallback from '@wlq/wlq-api-aws/src/callbacks/getRoomParticipantsCallback'
import getWebsocketApiGateway from '@wlq/wlq-api-aws/src/getWebsocketApi'
import {
  WebsocketBroadcast,
  WebsocketEvent,
} from '@wlq/wlq-api/lib/esm/websocket'
import { SNSHandler } from 'aws-lambda'
import getDatabaseProps from '../getDatabaseProps'

const DbProps = getDatabaseProps()

const getRoomConnectionIds = ((cache: { [roomId: string]: string[] }) => async (
  roomId: string,
): Promise<string[]> => {
  if (!cache[roomId])
    cache[roomId] = (await getRoomParticipantsCallback(DbProps)(roomId)).map(
      p => p.connectionId,
    )
  return cache[roomId]
})({})

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
      console.log(
        'Broadcasting message to websockets',
        process.env.WEBSOCKET_ENDPOINT,
        connectionIds,
        message,
      )

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
          console.log(message)
        }
      })

      if (promises.length > 0) {
        await Promise.all(promises)
      } else {
        console.error('broadcastTopic No participants')
        console.log(message)
      }
    } else {
      console.error('broadcastTopic No recipients')
      console.log(message)
    }
  }
}
