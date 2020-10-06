import { getPosedQuestionPublic } from '@wlq/wlq-model/src/collection'
import {
  getAllCollections,
  poseQuestion,
} from '@wlq/wlq-model/src/data/geography'
import {
  GetParticipantCallback,
  GetRoomCallback,
  PoseQuestionPayload,
  SetRoomQuestionCallback,
  StartGamePayload,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandler } from '../websocket'

const startGame = (
  getParticipant: GetParticipantCallback,
  getRoomByRoomId: GetRoomCallback,
  setRoomQuestion: SetRoomQuestionCallback,
): WebsocketEventHandler<StartGamePayload> => async ({ connectionId }) => {
  console.log('Getting participant')
  const participant = await getParticipant(connectionId)

  if (participant) {
    console.log('Getting room data', participant)
    let room = await getRoomByRoomId(participant.roomId)

    if (room && room.state === 'Idle') {
      console.log('Updating room')
      const question = poseQuestion(getAllCollections())
      await setRoomQuestion(room.roomId, question)

      console.log('Broadcasting roomUpdate message')
      const broadcast: WebsocketBroadcast<PoseQuestionPayload> = {
        channel: room.roomId,
        action: 'poseQuestion',
        data: { question: getPosedQuestionPublic(question), questionTime: 15 },
      }
      return [broadcast]
    }
  }
  return []
}

export default startGame
