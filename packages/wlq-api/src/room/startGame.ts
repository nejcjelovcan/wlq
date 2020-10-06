import { getPosedQuestionPublic } from '@wlq/wlq-model/src/collection'
import {
  getAllCollections,
  poseQuestion,
} from '@wlq/wlq-model/src/data/geography'
import { Room } from '@wlq/wlq-model/src/room'
import {
  GetParticipantCallback,
  GetRoomCallback,
  PoseQuestionPayload,
  PutRoomCallback,
  StartGamePayload,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandler } from '../websocket'

const startGame = (
  getParticipant: GetParticipantCallback,
  getRoomByRoomId: GetRoomCallback,
  putRoom: PutRoomCallback,
): WebsocketEventHandler<StartGamePayload> => async ({ connectionId }) => {
  console.log('Getting participant')
  const participant = await getParticipant(connectionId)

  if (participant) {
    console.log('Getting room data', participant)
    let room = await getRoomByRoomId(participant.roomId)

    if (room && room.state === 'Idle') {
      console.log('Updating room')
      const question = poseQuestion(getAllCollections())
      const roomUpdate: Partial<Room> = {
        state: 'Question',
        question,
        answers: {},
      }
      room = await putRoom({ ...room, ...roomUpdate })

      console.log('Broadcasting roomUpdate message')
      const broadcast: WebsocketBroadcast<PoseQuestionPayload> = {
        channel: room.roomId,
        action: 'poseQuestion',
        data: { question: getPosedQuestionPublic(question) },
      }
      return [broadcast]
    }
  }
  return []
}

export default startGame
