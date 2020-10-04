import { Room, RoomParticipant } from '@wlq/wlq-model/src/room'
import { ServerSchema } from '.'
import { WS } from './makeWsServer'

// TODO mirage schema typing

export const getRoomByRoomId = (
  schema: ServerSchema,
  roomId: string,
): Room | undefined => {
  const room = schema.findBy('room', { roomId })
  if (!room) return undefined
  return { ...((room?.attrs as unknown) as Room), ws: WS }
}

export const getRoomAndParticipantsByRoomId = (
  schema: ServerSchema,
  roomId: string,
): [Room | undefined, RoomParticipant[]] => {
  const room = schema.findBy('room', { roomId })
  const participants = schema.where('participant', { roomId })
  return [
    { ...((room?.attrs as unknown) as Room), ws: WS },
    (participants.models.map(m => m.attrs) as unknown) as RoomParticipant[],
  ]
}

export const getRoomParticipantByConnectionId = (
  schema: ServerSchema,
  connectionId: string,
): RoomParticipant | undefined => {
  const participant = schema.findBy('participant', { connectionId })
  if (!participant) return undefined
  return { ...((participant?.attrs.attrs as unknown) as RoomParticipant) }
}
