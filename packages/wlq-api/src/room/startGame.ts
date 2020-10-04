import {
  getAllCollections,
  poseQuestion,
} from '@wlq/wlq-model/src/data/geography'
import { getPosedQuestionPublic } from '@wlq/wlq-model/src/collection'
import { Room, RoomParticipant } from '@wlq/wlq-model/src/room'
import { RoomAndParticipantsGetter, RoomUpdateRoomProps } from '.'
import { WsEventIterableFunction, WsMessage } from '../ws'

const startGame = (
  roomParticipantGetter: (
    connectionId: string,
  ) => Promise<RoomParticipant | undefined>,
  roomAndParticipantsGetter: RoomAndParticipantsGetter,
  updateRoom: (room: Room, update: Partial<Room>) => Promise<Room>,
): WsEventIterableFunction<object> => {
  async function* startGameIterableFunction({ connectionId }) {
    console.log('Getting participant')
    const participant = await roomParticipantGetter(connectionId)

    if (participant) {
      console.log('Getting room data', participant)
      let [room, participants] = await roomAndParticipantsGetter(
        participant?.roomId,
      )

      if (room && room.state === 'Idle') {
        console.log('Updating room')
        const question = poseQuestion(getAllCollections())
        const roomUpdate: Partial<Room> = {
          state: 'Question',
          question,
          questionPublic: getPosedQuestionPublic(question),
        }
        room = await updateRoom(room, roomUpdate)

        console.log('Broadcasting roomUpdate message')
        const message: WsMessage<RoomUpdateRoomProps> = {
          action: 'roomUpdate',
          data: {
            state: roomUpdate.state,
            questionPublic: roomUpdate.question,
          },
        }
        yield participants.map(({ connectionId }) => ({
          connectionId,
          message,
        }))
      }
    }

    yield undefined
  }
  return startGameIterableFunction
}
export default startGame