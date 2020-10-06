import { PosedQuestionPublic } from '@wlq/wlq-model/src/collection'
import {
  Room,
  RoomParticipant,
  RoomParticipantPublic,
} from '@wlq/wlq-model/src/room'
import { WebsocketPayload } from '../websocket'

// Rest interfaces

export type GetRoomResponseData = {
  room: Room
}

// Websocket interfaces

export type JoinRoomPayload = WebsocketPayload<
  'joinRoom',
  { token: string; roomId: string; userDetails: { [key: string]: any } }
>

export type UserJoinedPayload = WebsocketPayload<
  'userJoined',
  { participant: RoomParticipantPublic }
>

export type LeaveRoomPayload = WebsocketPayload<'leaveRoom'>

export type UserLeftPayload = WebsocketPayload<
  'userLeft',
  { participant: RoomParticipantPublic }
>

export type SetParticipantsPayload = WebsocketPayload<
  'setParticipants',
  { participants: RoomParticipantPublic[]; pid: string }
>

export type StartGamePayload = WebsocketPayload<'startGame'>

export type PoseQuestionPayload = WebsocketPayload<
  'poseQuestion',
  { question: PosedQuestionPublic }
>

export type AnswerQuestionPayload = WebsocketPayload<
  'answerQuestion',
  { answer: string }
>

export type UserAnsweredPayload = WebsocketPayload<
  'userAnswered',
  { pid: string }
>

// Callbacks

export type GetRoomCallback = (roomId: string) => Promise<Room | undefined>

export type PutRoomCallback = (room: Room, update: boolean) => Promise<Room>

export type GetParticipantCallback = (
  connectionId: string,
) => Promise<RoomParticipant | undefined>

export type GetRoomParticipantsCallback = (
  roomId: string,
) => Promise<RoomParticipant[]>

export type PutParticipantCallback = (
  participant: RoomParticipant,
) => Promise<RoomParticipant>

export type DeleteParticipantCallback = (
  participant: RoomParticipant,
) => Promise<void>
