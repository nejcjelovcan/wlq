import {
  GetParticipantCallback,
  GetRoomCallback,
  SetRoomQuestionCallback,
  StartExecutionCallback,
  StartGamePayload,
} from '.'
import { WebsocketEventHandler } from '../websocket'
import roomNextQuestion from './roomNextQuestion'

const startGame = (
  getParticipant: GetParticipantCallback,
  getRoomByRoomId: GetRoomCallback,
  setRoomQuestion: SetRoomQuestionCallback,
  startExecution: StartExecutionCallback,
): WebsocketEventHandler<StartGamePayload> => async ({ connectionId }) => {
  const participant = await getParticipant(connectionId)

  if (participant) {
    return await roomNextQuestion(
      getRoomByRoomId,
      setRoomQuestion,
      startExecution,
      async () => {},
    )(participant.roomId)
  }
  return []
}

export default startGame
