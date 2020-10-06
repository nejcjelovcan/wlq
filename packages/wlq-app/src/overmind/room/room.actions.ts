import {
  AnswerQuestionPayload,
  PoseQuestionPayload,
  SetParticipantsPayload,
  StartGamePayload,
  UserAnsweredPayload,
  UserJoinedPayload,
  UserLeftPayload,
} from '@wlq/wlq-api/src/room'
import { uniqueBy } from '@wlq/wlq-model/src/helpers'
import { RoomCreation, validateRoomCreation } from '@wlq/wlq-model/src/room'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { Action } from 'overmind'

export const setRoomCreation: Action<Partial<RoomCreation>> = (
  { state: { room } },
  roomCreation,
) => {
  room.roomCreation = roomCreation
  room.roomCreationError = undefined
  try {
    room.roomCreation = validateRoomCreation(roomCreation)
    room.roomCreationValid = true
  } catch (e) {
    if (e instanceof ValidationError) {
      room.roomCreationError = { field: e.field, message: e.message }
    }
    room.roomCreationValid = false
  }
}

export const cleanRoomData: Action = ({ state: { room } }) => {
  room.currentRoom = undefined
  room.roomSession = { participants: [], usersAnswered: [], itemAnswers: {} }
}

export const roomOnSetParticipants: Action<SetParticipantsPayload['data']> = (
  { state: { room } },
  data,
) => {
  room.roomSession.participants = data.participants
  room.roomSession.pid = data.pid
}

export const roomOnUserJoined: Action<UserJoinedPayload['data']> = (
  { state: { room } },
  data,
) => {
  room.roomSession.participants = uniqueBy(
    [...room.roomSession.participants, data.participant],
    'pid',
  )
}

export const roomOnUserLeft: Action<UserLeftPayload['data']> = (
  { state: { room } },
  data,
) => {
  room.roomSession.participants = room.roomSession.participants.filter(
    p => p.pid !== data.participant.pid,
  )
}

export const roomOnPoseQuestion: Action<PoseQuestionPayload['data']> = (
  {
    state: {
      room: { currentRoom, roomSession },
    },
  },
  { question },
) => {
  if (currentRoom) {
    currentRoom.state = 'Question'
    roomSession.currentQuestion = question
    roomSession.currentAnswer = undefined
    roomSession.usersAnswered = []
    roomSession.itemAnswers = {}
  }
}

export const roomOnUserAnswered: Action<UserAnsweredPayload['data']> = (
  {
    state: {
      room: { currentRoom, roomSession },
    },
  },
  { pid },
) => {
  if (currentRoom) {
    currentRoom.state = 'Question'
    roomSession.usersAnswered.push(pid)
  }
}

export const answerQuestion: Action<string> = (
  {
    state: {
      room: { currentRoom, roomSession },
    },
    effects: { websocket },
  },
  answer,
) => {
  if (currentRoom?.state === 'Question' && !roomSession.currentAnswer) {
    roomSession.currentAnswer = answer
    roomSession.usersAnswered.push(roomSession.pid!)
    websocket.sendPayload<AnswerQuestionPayload>({
      action: 'answerQuestion',
      data: { answer: answer },
    })
  }
}

export const startGame: Action = ({ effects: { websocket } }) => {
  websocket.sendPayload<StartGamePayload>({
    action: 'startGame',
    data: {},
  })
}

export * from './room.rest.actions'
export * from './room.websocket.actions'
