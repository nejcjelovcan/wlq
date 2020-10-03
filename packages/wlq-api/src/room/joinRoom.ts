import {
  RoomParticipant,
  getRoomParticipantPublic,
  newRoomParticipant,
} from '@wlq/wlq-model/src/room'
import { validateUserDetails } from '@wlq/wlq-model/src/user'
import {
  RoomAndParticipantGetter,
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
  roomAndParticipantsGetter: RoomAndParticipantGetter,
  addParticipant: (participant: RoomParticipant) => Promise<any>,
): WsEventIterableFunction<RoomJoinProps> => {
  async function* joinRoomIterableFunction({
    connectionId,
    message: {
      data: { roomId, token, userDetails },
    },
  }) {
    // verify token, get room
    console.log('VERIFYING TOKEN', token)
    const uid = await verifyToken(token)
    console.log('GETTING ROOM', roomId)
    const room = await roomGetter(roomId)

    if (room && roomId) {
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
      console.log('YIELDING useJoined events')
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
