import {
  WebsocketBroadcast,
  WebsocketEvent,
  WebsocketEventHandler,
} from '@wlq/wlq-api/src/websocket'
import {
  getRoomParticipantPublic,
  newRoomParticipant,
  validateUserDetails,
} from '@wlq/wlq-model/src'
import {
  JoinRoomPayload,
  PutParticipantCallback,
  GetRoomCallback,
  GetRoomParticipantsCallback,
  SetParticipantsPayload,
  UserJoinedPayload,
} from '.'
import { RestResponseError } from '../rest'
import { TokenVerifier } from '../user'

const joinRoom = (
  getRoomByRoomId: GetRoomCallback,
  verifyToken: TokenVerifier,
  putParticipant: PutParticipantCallback,
  getRoomParticipants: GetRoomParticipantsCallback,
): WebsocketEventHandler<JoinRoomPayload> => async ({
  connectionId,
  data: { token, roomId, userDetails },
}) => {
  let uid: string
  try {
    console.log('VERIFYING TOKEN', token)
    uid = await verifyToken(token)
  } catch (e) {
    throw new RestResponseError(403, 'Unauthorized')
  }

  // get room
  const room = await getRoomByRoomId(roomId)

  if (!room) throw new RestResponseError(400, 'Failed to join room')
  if (room.state !== 'Idle')
    throw new RestResponseError(400, 'Failed to join room: Game in progress')

  // validate user details
  console.log('VALIDATING USER DETAILS', userDetails)
  const details = validateUserDetails(userDetails)

  // create & add participant
  const participant = newRoomParticipant({
    roomId,
    details,
    connectionId,
    uid,
  })
  await putParticipant(participant)

  const event: WebsocketEvent<SetParticipantsPayload> = {
    connectionId,
    action: 'setParticipants',
    data: {
      pid: participant.pid,
      participants: (await getRoomParticipants(roomId)).map(
        getRoomParticipantPublic,
      ),
    },
  }

  const broadcast: WebsocketBroadcast<UserJoinedPayload> = {
    channel: roomId,

    action: 'userJoined',
    data: {
      participant: getRoomParticipantPublic(participant),
    },
  }

  return [event, broadcast]
}
export default joinRoom
