import {
  Room,
  RoomParticipant,
  RoomParticipantPublic,
} from '@wlq/wlq-model/src'

export type RoomJoinProps = {
  token: string
  roomId: string
  userDetails: { [key: string]: any }
}
export type RoomSetParticipantsProps = {
  participants: RoomParticipantPublic[]
  pid: string
}
export type RoomUserJoinedProps = {
  participant: RoomParticipantPublic
}

export type RoomGetter = (roomId: string) => Promise<Room | undefined>

export type RoomAndParticipantGetter = (
  roomId: string,
) => Promise<[Room | undefined, RoomParticipant[]]>

export type GetRoomResponseData = {
  room: Room
}

export { default as createRoom } from './createRoom'
export { default as getRoom } from './getRoom'
export { default as joinRoom } from './joinRoom'
