import {
  CollectionItem,
  PosedQuestion,
  PosedQuestionPublic,
} from '@wlq/wlq-model/src/collection'
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
  { question: PosedQuestionPublic; questionTime: number }
>

export type AnswerQuestionPayload = WebsocketPayload<
  'answerQuestion',
  { answer: string }
>

export type UserAnsweredPayload = WebsocketPayload<
  'userAnswered',
  { pid: string }
>

export type RevealAnswerPayload = WebsocketPayload<
  'revealAnswer',
  { answer: CollectionItem; userAnswers: { [pid: string]: string } }
>

export type SetQuestionTokenPayload = WebsocketPayload<
  'setQuestionToken',
  { questionToken: string }
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

export type AddRoomAnswerCallback = (
  roomId: string,
  pid: string,
  answer: string,
) => Promise<Pick<Room, 'answers'>>

export type SetRoomQuestionCallback = (
  roomId: string,
  question: PosedQuestion,
) => Promise<unknown>

export type SetRoomQuestionTokenCallback = (
  roomId: string,
  questionToken: string,
) => Promise<unknown>

export type SetRoomStateCallback = (
  roomId: string,
  state: string,
) => Promise<unknown>

export type SendQuestionTimerSuccessCallback = (
  taskToken: string,
) => Promise<unknown>

export type StartExecutionCallback = (
  stepFunctionArn: string,
  input: object,
) => Promise<unknown>

export type SendTaskSuccessCallback = (
  taskToken: string,
  output: string,
) => Promise<unknown>
