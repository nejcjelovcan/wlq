import { nanoid } from 'nanoid'
import { UserDetails } from '../user/UserDetails'

export interface RoomParticipant {
  type: 'RoomParticipant'
  roomId: string
  details: UserDetails
  uid: string
  pid: string
  connectionId: string
  joinedTime: string
}

export type RoomParticipantJoin = Pick<
  RoomParticipant,
  'roomId' | 'details' | 'connectionId' | 'uid'
>

export type RoomParticipantPublic = Pick<
  RoomParticipant,
  'type' | 'details' | 'pid'
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
    pid: nanoid(),
    joinedTime: new Date().toISOString(),
    ...join,
  }
}

export const getRoomParticipantPublic = ({
  type,
  details,
  pid,
}: RoomParticipant): RoomParticipantPublic => ({ type, details, pid })
