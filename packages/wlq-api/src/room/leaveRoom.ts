import { getRoomParticipantPublic } from '@wlq/wlq-model/src'
import {
  DeleteParticipantCallback,
  GetParticipantCallback,
  UserLeftPayload,
} from '.'
import { WebsocketBroadcast, WebsocketEventHandler } from '../websocket'

const leaveRoom = (
  getParticipant: GetParticipantCallback,
  deleteParticipant: DeleteParticipantCallback,
): WebsocketEventHandler => async ({ connectionId }) => {
  console.log('Getting participant')
  const participant = await getParticipant(connectionId)
  if (participant) {
    console.log('Deleting participant')
    await deleteParticipant(participant)
    const broadcast: WebsocketBroadcast<UserLeftPayload> = {
      channel: participant.roomId,
      action: 'userLeft',
      data: {
        participant: getRoomParticipantPublic(participant),
      },
    }
    return [broadcast]
  }
  return []
}
export default leaveRoom
