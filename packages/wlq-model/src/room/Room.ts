import { nanoid } from 'nanoid'

export default interface Room {
  type: 'Room'
  uuid: string
  name: string
  state: 'Idle' | 'Game'
  listed: boolean
}

export type RoomCreation = Pick<Room, 'name' | 'listed'>

export const getRoomPK = ({ name }: Pick<Room, 'name'>) => name

export const getRoomSK = ({ listed }: Pick<Room, 'listed'>) =>
  `##${listed ? 'LISTED' : 'UNLISTED'}`

export const getRoomKeys = (room: Pick<Room, 'name' | 'listed'>) => ({
  PK: getRoomPK(room),
  SK: getRoomSK(room),
})

export const newRoom = ({ name, listed = true }: RoomCreation): Room => {
  return {
    type: 'Room',
    uuid: nanoid(10),
    name,
    state: 'Idle',
    listed,
  }
}
