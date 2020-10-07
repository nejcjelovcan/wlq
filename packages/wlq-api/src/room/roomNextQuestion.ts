import { getPosedQuestionPublic } from '@wlq/wlq-model/src/collection'
import {
  getAllCollections,
  poseQuestion,
} from '@wlq/wlq-model/src/data/geography'
import {
  GameFinishedPayload,
  GetRoomCallback,
  PoseQuestionPayload,
  SetRoomFinishedCallback,
  SetRoomQuestionCallback,
  StartExecutionCallback,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandlerReturn } from '../websocket'

const QUESTION_TIME = 10

const roomNextQuestion = (
  getRoomByRoomId: GetRoomCallback,
  setRoomQuestion: SetRoomQuestionCallback,
  startExecution: StartExecutionCallback,
  setRoomFinished: SetRoomFinishedCallback,
) => async (roomId: string): WebsocketEventHandlerReturn => {
  let room = await getRoomByRoomId(roomId)

  if (room) {
    const posePossible =
      room.state === 'Idle' ||
      (room.state === 'Answer' && room.atQuestionNumber < room.questionCount)

    if (posePossible) {
      console.log('Updating room')
      const question = poseQuestion(getAllCollections())
      await setRoomQuestion(room.roomId, question)

      console.log('Start RoomQuestionTimeout state machine')
      await startExecution(process.env.ROOM_QUESTION_TIMEOUT!, {
        roomId: room.roomId,
        questionTime: QUESTION_TIME,
      })

      console.log('Broadcasting poseQuestion message')
      const broadcast: WebsocketBroadcast<PoseQuestionPayload> = {
        channel: room.roomId,
        action: 'poseQuestion',
        data: {
          question: getPosedQuestionPublic(question),
          questionTime: QUESTION_TIME,
        },
      }
      return [broadcast]
    } else {
      console.log('Out of questions')
      await setRoomFinished(room.roomId)
      const broadcast: WebsocketBroadcast<GameFinishedPayload> = {
        channel: room.roomId,
        action: 'gameFinished',
        data: {},
      }
      return [broadcast]
    }
  }

  return []
}

export default roomNextQuestion
