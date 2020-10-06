import AWS from 'aws-sdk'

import {
  AddRoomAnswerCallback,
  AnswerQuestionPayload,
  GetParticipantCallback,
  GetRoomCallback,
  GetRoomParticipantsCallback,
  UserAnsweredPayload,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandler } from '../websocket'

const answerQuestion = (
  getParticipant: GetParticipantCallback,
  getRoomByRoomId: GetRoomCallback,
  addRoomAnswer: AddRoomAnswerCallback,
  getRoomParticipants: GetRoomParticipantsCallback,
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

        console.log('Check if everybody answered')
        const participants = await getRoomParticipants(room.roomId)
        if (
          Object.keys(answers ?? {}).length === participants.length &&
          room._questionToken
        ) {
          console.log('Send Task success to step function')
          await new AWS.StepFunctions()
            .sendTaskSuccess({
              taskToken: room._questionToken,
              output: room.roomId,
            })
            .promise()
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
