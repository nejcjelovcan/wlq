import { nanoid } from 'nanoid'
import { PosedQuestion } from '../collection'
import { ValidationError, Validator } from '../validation'

export interface Room {
  type: 'Room'
  name: string
  roomId: string
  state: 'Idle' | 'Question' | 'Answer'
  listed: boolean
  question?: PosedQuestion
  answers?: { [pid: string]: string }
  ws?: string
  questionCount: number
  atQuestionNumber: number
  _questionToken?: string
}

export type RoomCreation = Pick<Room, 'name' | 'listed'>

export const getRoomPK = ({ roomId }: Pick<Room, 'roomId'>) => roomId

export const getRoomSK = () => `#METADATA`

export const getRoomKeys = (room: Pick<Room, 'roomId'>) => ({
  PK: getRoomPK(room),
  SK: getRoomSK(),
})

export const validateRoomCreation: Validator<RoomCreation> = obj => {
  if (
    typeof obj.name !== 'string' ||
    obj.name.length < 1 ||
    obj.name.length > 30
  ) {
    throw new ValidationError(
      'name',
      'Room name must be between 1 and 30 characters',
    )
  }
  return {
    name: obj.name,
    listed: obj.listed ? true : false,
  }
}

export const newRoom = ({ name, listed }: RoomCreation): Room => {
  return {
    type: 'Room',
    roomId: nanoid(10),
    name,
    state: 'Idle',
    listed,
    questionCount: 10,
    atQuestionNumber: 0,
  }
}
