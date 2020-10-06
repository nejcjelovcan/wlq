import getRoomParticipantsCallback from '@wlq/wlq-api-aws/src/callbacks/getRoomParticipantsCallback'
import getWebsocketApiGateway from '@wlq/wlq-api-aws/src/getWebsocketApi'
import { WebsocketBroadcast } from '@wlq/wlq-api/lib/esm/websocket'
import { SNSHandler } from 'aws-lambda'
import getDatabaseProps from '../getDatabaseProps'

const DbProps = getDatabaseProps()

const getParticipants = ((cache: { [roomId: string]: string[] }) => async (
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
    const message = JSON.parse(record.Sns.Message) as WebsocketBroadcast
    const channel = message.channel
    let sent = false

    const websocketApi = getWebsocketApiGateway(process.env.WEBSOCKET_ENDPOINT!)
    if (channel) {
      switch (message.action) {
        case 'userJoined':
        case 'userLeft':
        case 'userAnswered':
        case 'poseQuestion':
          console.log(
            'Broadcasting message to websockets',
            process.env.WEBSOCKET_ENDPOINT,
            channel,
            message,
          )
          const participants = await getParticipants(channel)
          const promises = participants.map(ConnectionId =>
            websocketApi
              .postToConnection({
                ConnectionId,
                Data: JSON.stringify({
                  action: message.action,
                  data: message.data,
                }),
              })
              .promise(),
          )
          if (promises.length > 0)
            await Promise.all(
              promises.map(async promise => {
                // wrap promises in try-catch so that they don't cancel other
                // postToConnections
                try {
                  await promise
                } catch (e) {
                  console.error('broadcastTopic Could not send to websocket')
                }
              }),
            )
          sent = true
          break
      }
    }

    if (!sent) {
      console.error('broadcastTopic Unrecognized event')
      console.log(message)
    }
  }
}
