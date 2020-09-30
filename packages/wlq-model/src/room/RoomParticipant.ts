import { nanoid } from 'nanoid'
import UserDetails from '../user/UserDetails'

export default interface RoomParticipant {
  type: 'RoomParticipant'
  roomId: string
  details: UserDetails
  uid: string
  connectionId: string
  joinedTime: string
}

export type RoomParticipantJoin = Pick<
  RoomParticipant,
  'roomId' | 'details' | 'connectionId'
>

export const getRoomParticipantPK = ({
  roomId,
}: Pick<RoomParticipant, 'roomId'>) => roomId

export const getRoomParticipantSK = ({
  connectionId,
}: Pick<RoomParticipant, 'connectionId'>) => `#ROOM_PARTICIPANT#${connectionId}`

export const getRoomParticipantKeys = (
  room: Pick<RoomParticipant, 'roomId' | 'connectionId'>,
) => ({
  PK: getRoomParticipantPK(room),
  SK: getRoomParticipantSK(room),
})

export const newRoomParticipant = (
  join: RoomParticipantJoin,
): RoomParticipant => {
  return {
    type: 'RoomParticipant',
    uid: nanoid(),
    joinedTime: new Date().toISOString(),
    ...join,
  }
}
