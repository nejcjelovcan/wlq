import { getRoomParticipantPublic, RoomParticipant } from '@wlq/wlq-model/src'
import { RoomAndParticipantsGetter, RoomUserLeftProps } from '.'
import { WsEventIterableFunction, WsMessage } from '../ws'

const leaveRoom = (
  roomParticipantGetter: (
    connectionId: string,
  ) => Promise<RoomParticipant | undefined>,
  deleteRoomParticipant: (participant: RoomParticipant) => Promise<any>,
  roomAndParticipantsGetter: RoomAndParticipantsGetter,
): WsEventIterableFunction => {
  async function* leaveRoomIterableFunction({ connectionId }) {
    console.log('Getting participant')
    const participant = await roomParticipantGetter(connectionId)
    if (participant) {
      console.log('Deleting participant')
      await deleteRoomParticipant(participant)

      console.log('Getting participants to broadcast to')
      const [room, participants] = await roomAndParticipantsGetter(
        participant.roomId,
      )
      if (room) {
        const message: WsMessage<RoomUserLeftProps> = {
          action: 'userLeft',
          data: { participant: getRoomParticipantPublic(participant) },
        }

        console.log('Broadcasting userLeft')
        yield participants
          // TODO with broadcasting filtering will not be possible
          .filter(p => p.connectionId !== connectionId)
          .map(p => ({ connectionId: p.connectionId, message }))
      } else {
        yield undefined
      }
    } else {
      console.error('No participant found')
      yield undefined
    }
  }
  return leaveRoomIterableFunction
}
export default leaveRoom
