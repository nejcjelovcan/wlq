import { Room } from '@wlq/wlq-model/src/room'
import {
  AnswerQuestionPayload,
  GetParticipantCallback,
  GetRoomCallback,
  PutRoomCallback,
  UserAnsweredPayload,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandler } from '../websocket'

const answerQuestion = (
  getParticipant: GetParticipantCallback,
  getRoomByRoomId: GetRoomCallback,
  putRoom: PutRoomCallback,
): WebsocketEventHandler<AnswerQuestionPayload> => async ({
  connectionId,
  data: { answer },
}) => {
  console.log('Getting participant')
  const participant = await getParticipant(connectionId)

  if (participant) {
    console.log('Getting room data', participant)
    let room = await getRoomByRoomId(participant.roomId)

    if (room && room.state === 'Question') {
      const option = room.question?.options.find(opt => opt.name === answer)
      const alreadyAnswered = participant.pid in (room.answers ?? {})

      if (option && !alreadyAnswered) {
        let roomUpdate: Partial<Room> = {
          answers: { ...room.answers, [participant.pid]: answer },
        }
        console.log('Updating room')
        room = await putRoom({ ...room, ...roomUpdate }, true)

        const broadcast: WebsocketBroadcast<UserAnsweredPayload> = {
          channel: room.roomId,
          action: 'userAnswered',
          data: { pid: participant.pid },
        }
        return [broadcast]
      } else {
        if (alreadyAnswered) {
          console.error('User already answered')
        } else {
          console.error('Invalid answer')
        }
      }
    } else {
      console.error("Can't answer, room not in Question state")
    }
  }

  return []
}
export default answerQuestion
