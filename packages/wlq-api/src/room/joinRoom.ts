import {
  getRoomParticipantPublic,
  newRoomParticipant,
  RoomParticipant,
} from '@wlq/wlq-model/src/room'
import { validateUserDetails } from '@wlq/wlq-model/src/user'
import {
  RoomAndParticipantsGetter,
  RoomGetter,
  RoomJoinProps,
  RoomSetParticipantsProps,
  RoomUserJoinedProps,
} from '.'
import { RestResponseError } from '../rest'
import { newWsMessageEvent, WsEventIterableFunction, WsMessage } from '../ws'

// TODO Broadcasting (see ws.ts)
const joinRoom = (
  verifyToken: (token: string) => Promise<string>,
  roomGetter: RoomGetter,
  roomAndParticipantsGetter: RoomAndParticipantsGetter,
  addParticipant: (participant: RoomParticipant) => Promise<any>,
): WsEventIterableFunction<RoomJoinProps> => {
  async function* joinRoomIterableFunction({
    connectionId,
    message: {
      data: { roomId, token, userDetails },
    },
  }) {
    // verify token
    let uid: string
    try {
      console.log('VERIFYING TOKEN', token)
      uid = await verifyToken(token)
    } catch (e) {
      throw new RestResponseError(403, 'Unauthorized')
    }

    // get room
    const room = await roomGetter(roomId)

    if (room && room.state === 'Idle') {
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
      console.log('ADDING PARTICIPANT', participant)
      await addParticipant(participant)
      const [, participants] = await roomAndParticipantsGetter(roomId)

      // send setParticipants to joined participant
      console.log('YIELDING setParticipants event')
      yield newWsMessageEvent<RoomSetParticipantsProps>(
        connectionId,
        'setParticipants',
        {
          participants: participants.map(getRoomParticipantPublic),
          pid: participant.pid,
        },
      )

      // send userJoined to all participants
      console.log('YIELDING userJoined events')
      const message: WsMessage<RoomUserJoinedProps> = {
        action: 'userJoined',
        data: { participant: getRoomParticipantPublic(participant) },
      }
      yield participants
        // TODO with broadcasting filtering will not be possible
        .filter(p => p.connectionId !== connectionId)
        .map(p => ({ connectionId: p.connectionId, message }))
    } else {
      // no room
      throw new RestResponseError(400, 'Failed to join room')
    }
  }
  return joinRoomIterableFunction
}

export default joinRoom
