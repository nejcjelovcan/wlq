import {
  DeleteParticipantCallback,
  GetParticipantCallback,
  GetRoomCallback,
  GetRoomParticipantsCallback,
  GetTokenResponseData,
  PutParticipantCallback,
  PutRoomCallback,
  RestResponse,
} from '@wlq/wlq-api/src'
import { Room, RoomParticipant } from '@wlq/wlq-model/src/room'
import { ServerSchema } from '.'
import { WS } from './mockWebsocketServer'

// TODO mirage schema typing
export const getRoomByRoomId = (
  schema: ServerSchema,
): GetRoomCallback => async roomId => {
  const room = schema.findBy('room', { roomId })
  if (!room) return undefined
  return { ...((room?.attrs as unknown) as Room), ws: WS }
}

export const getParticipant = (
  schema: ServerSchema,
): GetParticipantCallback => async connectionId => {
  const participant = schema.findBy('participant', { connectionId })
  if (!participant) return undefined
  return { ...((participant?.attrs as unknown) as RoomParticipant) }
}

// TODO raise 400 if room already exists and update=false
export const putRoom = (
  schema: ServerSchema,
): PutRoomCallback => async room => ({
  ...((schema.create('room', room).attrs as unknown) as Room),
  ws: WS,
})

export const putParticipant = (
  schema: ServerSchema,
): PutParticipantCallback => async participant => ({
  ...((schema.create('participant', participant)
    .attrs as unknown) as RoomParticipant),
})

export const deleteParticipant = (
  schema: ServerSchema,
): DeleteParticipantCallback => async participant =>
  schema
    .findBy('participant', {
      connectionId: participant.connectionId,
    })
    .destroy()

export const getRoomParticipants = (
  schema: ServerSchema,
): GetRoomParticipantsCallback => async roomId => {
  const participants = schema.where('participant', { roomId })
  return (participants.models.map(m => m.attrs) as unknown) as RoomParticipant[]
}

export const verifyToken = async () => 'token'

// In case of getToken we can't use the common api function
// because jose (jwt library) is not browser ready
// We're still enforcing endpoint signature with typescript, though
export const mirageGetToken = (): RestResponse<GetTokenResponseData> => ({
  statusCode: 200,
  data: { token: 'testtoken' },
})
