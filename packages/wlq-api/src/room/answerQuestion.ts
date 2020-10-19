import {
  AddRoomAnswerCallback,
  AnswerQuestionPayload,
  GetParticipantCallback,
  GetRoomCallback,
  GetRoomParticipantsCallback,
  SendTaskSuccessCallback,
  UserAnsweredPayload,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandler } from '../websocket'

const answerQuestion = (
  getParticipant: GetParticipantCallback,
  getRoomByRoomId: GetRoomCallback,
  addRoomAnswer: AddRoomAnswerCallback,
  getRoomParticipants: GetRoomParticipantsCallback,
  sendTaskSuccessCallback: SendTaskSuccessCallback,
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
        console.log('Updating room')
        const { answers } = await addRoomAnswer(
          room.roomId,
          participant.pid,
          answer,
        )

        const participants = await getRoomParticipants(room.roomId)

        const answersCount = Object.keys(answers ?? {}).length
        console.log(
          'Check if everybody answered',
          answersCount,
          participants.length,
        )
        if (answersCount >= participants.length && room._questionToken) {
          console.log('Sending task success')
          await sendTaskSuccessCallback(room._questionToken, {
            output: 'Everybody answered',
          })
        }

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
