import { Room, RoomParticipant } from '@wlq/wlq-model/src/room'
import { ServerSchema } from '.'
import { WS } from './makeWsServer'

// TODO mirage schema typing

export const getRoomByRoomId = (schema: ServerSchema, roomId: string): Room => {
  const room = schema.findBy('room', { roomId })
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
