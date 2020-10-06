import getRoomParticipantsCallback from '@wlq/wlq-api-aws/src/callbacks/getRoomParticipantsCallback'
import getWebsocketApiGateway from '@wlq/wlq-api-aws/src/getWebsocketApi'
import { WebsocketBroadcast } from '@wlq/wlq-api/lib/esm/websocket'
import { RoomParticipant } from '@wlq/wlq-model/lib/esm'
import { SNSHandler } from 'aws-lambda'
import getDatabaseProps from '../getDatabaseProps'

const DbProps = getDatabaseProps()

const getParticipants = ((cache: {
  [roomId: string]: RoomParticipant[]
}) => async (roomId: string): Promise<RoomParticipant[]> => {
  if (!cache[roomId])
    cache[roomId] = await getRoomParticipantsCallback(DbProps)(roomId)
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
          const promises = participants.map(async participant => {
            try {
              console.log('Broadcasting to', participant)
              await websocketApi
                .postToConnection({
                  ConnectionId: participant.connectionId,
                  Data: JSON.stringify({
                    action: message.action,
                    data: message.data,
                  }),
                })
                .promise()
            } catch (e) {
              console.error('broadcastTopic Could not send to websocket')
              console.log(e)
              console.log(participant)
              console.log(message)
            }
          })
          if (promises.length > 0) {
            Promise.all(promises)
          } else {
            console.error('broadcastTopic No participants')
            console.log(message)
          }
          sent = true
      }
    }

    if (!sent) {
      console.error('broadcastTopic Unrecognized event')
      console.log(message)
    }
  }
}
