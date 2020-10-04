import {
  Room,
  RoomParticipant,
  RoomParticipantPublic,
} from '@wlq/wlq-model/src/room'

export type RoomJoinProps = {
  token: string
  roomId: string
  userDetails: { [key: string]: any }
}

export type RoomLeaveProps = {
  connectionId: string
}

export type RoomSetParticipantsProps = {
  participants: RoomParticipantPublic[]
  pid: string
}

export type RoomUpdateRoomProps = Partial<Room>

export type RoomUserJoinedProps = {
  participant: RoomParticipantPublic
}

export type RoomUserLeftProps = {
  participant: RoomParticipantPublic
}

export type RoomGetter = (roomId: string) => Promise<Room | undefined>

export type RoomAndParticipantsGetter = (
  roomId: string,
) => Promise<[Room | undefined, RoomParticipant[]]>

export type RoomParticipantGetter = (
  connectionId: string,
) => Promise<RoomParticipant | undefined>

export type GetRoomResponseData = {
  room: Room
}

export { default as createRoom } from './createRoom'
export { default as getRoom } from './getRoom'
export { default as joinRoom } from './joinRoom'
export { default as leaveRoom } from './leaveRoom'
export { default as startGame } from './startGame'
