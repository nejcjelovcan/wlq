import { Context } from 'aws-lambda'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import setRoomStateCallback from '../callbacks/setRoomStateCallback'
import { getBroadcastTopic } from '../extractFromWebsocketEvent'
import getDatabaseProps from '../getDatabaseProps'
import { publish } from '../wrappers/awsWebsocketWrapper'

const DbProps = getDatabaseProps()

export const handler = async (
  event: { [key: string]: unknown },
  context: Context,
) => {
  console.log('Reveal answer', event)
  if (typeof event.roomId === 'string') {
    console.log('Updating room state')
    await setRoomStateCallback(DbProps)(event.roomId, 'Answer')
    const room = await getRoomByRoomIdCallback(DbProps)(event.roomId)
    if (room && room.question) {
      await publish(
        {
          action: 'revealAnswer',
          channel: event.roomId,
          data: {
            answer: room.question.answer,
            userAnswers: room.answers ?? {},
          },
        },
        getBroadcastTopic(context),
      )
    }
    // answer: CollectionItem; userAnswers: { [pid: string]: string }
  }
  return { channel: event.roomId }
}
