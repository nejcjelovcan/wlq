import { v4 } from 'uuid'
import UserDetails from '../user/UserDetails'

export default interface RoomParticipant {
  type: 'RoomParticipant'
  room: string
  details: UserDetails
  uuid: string
  connectionId: string
  joinedTime: string
}

export type RoomParticipantJoin = Pick<
  RoomParticipant,
  'room' | 'details' | 'connectionId'
>

export const getRoomParticipantPK = ({ room }: Pick<RoomParticipant, 'room'>) =>
  room

export const getRoomParticipantSK = ({
  connectionId,
}: Pick<RoomParticipant, 'connectionId'>) => `#ROOM_PARTICIPANT#${connectionId}`

export const getRoomParticipantKeys = (
  room: Pick<RoomParticipant, 'room' | 'connectionId'>,
) => ({
  PK: getRoomParticipantPK(room),
  SK: getRoomParticipantSK(room),
})

export const newRoomParticipant = (
  join: RoomParticipantJoin,
): RoomParticipant => {
  return {
    type: 'RoomParticipant',
    uuid: v4(),
    joinedTime: new Date().toISOString(),
    ...join,
  }
}
