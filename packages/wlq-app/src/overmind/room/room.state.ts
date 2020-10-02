import { ValidationFieldErrorData } from '@wlq/wlq-model/src/validation'
import Room, { RoomCreation } from '@wlq/wlq-model/src/room/Room'
import { RequestState } from '../../utils/api'

export type RoomState = {
  currentRoom?: Room
  getRoomRequest: RequestState
  roomCreation: Partial<RoomCreation>
  roomCreationValid?: boolean
  roomCreationError?: ValidationFieldErrorData
  roomCreationRequest: RequestState
}

export const state: RoomState = {
  getRoomRequest: {},
  roomCreationRequest: {},
  roomCreation: {},
}
