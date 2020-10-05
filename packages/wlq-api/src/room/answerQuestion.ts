import { Room, RoomParticipant } from '@wlq/wlq-model/src/room'
import {
  RoomAndParticipantsGetter,
  RoomAnswerQuestionProps,
  RoomUserAnsweredProps,
} from '.'
import { WsEventIterableFunction, WsMessage } from '../ws'

const answerQuestion = (
  roomParticipantGetter: (
    connectionId: string,
  ) => Promise<RoomParticipant | undefined>,
  roomAndParticipantsGetter: RoomAndParticipantsGetter,
  updateRoom: (room: Room, update: Partial<Room>) => Promise<Room>,
): WsEventIterableFunction<RoomAnswerQuestionProps> => {
  async function* answerQuestionIterableFunction({
    connectionId,
    message: {
      data: { answer },
    },
  }) {
    console.log('Getting participant')
    const participant = await roomParticipantGetter(connectionId)

    if (participant) {
      console.log('Getting room data', participant)
      let [room, participants] = await roomAndParticipantsGetter(
        participant?.roomId,
      )

      console.log('ROOM', room)

      if (room && room.state === 'Question') {
        const option = room.question?.options.find(opt => opt.name === answer)
        const alreadyAnswered = participant.pid in (room.answers ?? {})
        if (option && !alreadyAnswered) {
          const roomUpdate: Partial<Room> = {
            answers: { ...room.answers, [participant.pid]: answer },
          }
          console.log('Updating room')
          room = await updateRoom(room, roomUpdate)

          console.log('Broadcasting userAnswered')
          const message: WsMessage<RoomUserAnsweredProps> = {
            action: 'userAnswered',
            data: {
              pid: participant.pid,
            },
          }
          yield participants
            // .filter(p => p.pid !== participant.pid)
            .map(({ connectionId }) => ({
              connectionId,
              message,
            }))
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

    yield undefined
  }
  return answerQuestionIterableFunction
}
export default answerQuestion
