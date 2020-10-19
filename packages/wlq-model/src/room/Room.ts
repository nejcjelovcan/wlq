import { nanoid } from 'nanoid'
import { PosedQuestion } from '../collection'
import { Validator } from '../validation'

export interface Room {
  type: 'Room'
  roomId: string
  state: 'Idle' | 'Question' | 'Answer' | 'Finished'
  listed: boolean
  question?: PosedQuestion
  answers?: { [pid: string]: string }
  ws?: string
  participantCount: number
  questionCount: number
  atQuestionNumber: number
  _questionToken?: string
}

export type RoomCreation = Pick<Room, 'listed'>

export const getRoomPK = ({ roomId }: Pick<Room, 'roomId'>) => roomId

export const getRoomSK = () => `#METADATA`

export const getRoomKeys = (room: Pick<Room, 'roomId'>) => ({
  PK: getRoomPK(room),
  SK: getRoomSK(),
})

export const validateRoomCreation: Validator<RoomCreation> = obj => {
  return {
    listed: obj.listed ? true : false,
  }
}

export const newRoom = ({ listed }: RoomCreation): Room => {
  return {
    type: 'Room',
    roomId: nanoid(10),
    state: 'Idle',
    listed,
    questionCount: 10,
    atQuestionNumber: 0,
    participantCount: 0,
  }
}

export const getRoomPublic = ({ _questionToken, ...rest }: Room): Room => rest
