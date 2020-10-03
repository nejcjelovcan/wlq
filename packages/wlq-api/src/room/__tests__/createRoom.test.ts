import { ValidationError } from '@wlq/wlq-model/src/validation'
import { Room } from '@wlq/wlq-model/src/room'
import createRoom from '../createRoom'

const addRoomStub = async (room: Room) => room

describe('createRoom', () => {
  it('validates room creation data', async () => {
    await expect(
      createRoom({ data: { name: '' } }, addRoomStub),
    ).rejects.toBeInstanceOf(ValidationError)
  })
  it('returns passed room from addRoom in response', async () => {
    await expect(
      createRoom({ data: { name: 'Name' } }, async room => ({
        ...room,
        name: 'TEST',
      })),
    ).resolves.toMatchObject({ data: { room: { name: 'TEST' } } })
  })
})
