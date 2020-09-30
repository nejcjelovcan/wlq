import { nanoid } from 'nanoid'

export default interface Room {
  type: 'Room'
  name: string
  roomId: string
  state: 'Idle' | 'Game'
  listed: boolean
}

export type RoomCreation = Pick<Room, 'name' | 'listed'>

export const getRoomPK = ({ roomId }: Pick<Room, 'roomId'>) => roomId

export const getRoomSK = ({ listed }: Pick<Room, 'listed'>) =>
  `##${listed ? 'LISTED' : 'UNLISTED'}`

export const getRoomKeys = (room: Pick<Room, 'roomId' | 'listed'>) => ({
  PK: getRoomPK(room),
  SK: getRoomSK(room),
})

export const newRoom = ({ name, listed = true }: RoomCreation): Room => {
  return {
    type: 'Room',
    roomId: nanoid(10),
    name,
    state: 'Idle',
    listed,
  }
}
