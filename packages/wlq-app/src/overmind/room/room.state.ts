import { PosedQuestionPublic } from '@wlq/wlq-model/src/collection'
import {
  Room,
  RoomCreation,
  RoomParticipantPublic,
} from '@wlq/wlq-model/src/room'
import { ValidationFieldErrorData } from '@wlq/wlq-model/src/validation'
import { RequestState } from '../../utils/api'

export type RoomState = {
  currentRoom?: Room
  getRoomRequest: RequestState
  roomCreation: Partial<RoomCreation>
  roomCreationValid?: boolean
  roomCreationError?: ValidationFieldErrorData
  roomCreationRequest: RequestState
  socket: {
    loading?: boolean
    connected?: boolean
    error?: string
  }
  roomSession: {
    pid?: string
    participants: RoomParticipantPublic[]
    currentQuestion?: PosedQuestionPublic
    currentAnswer?: string
    usersAnswered: string[]
    itemAnswers: { [name: string]: string[] }
  }
}

export const state: RoomState = {
  getRoomRequest: {},
  roomCreationRequest: {},
  roomCreation: {},
  socket: {},
  roomSession: { participants: [], usersAnswered: [], itemAnswers: {} },
}
