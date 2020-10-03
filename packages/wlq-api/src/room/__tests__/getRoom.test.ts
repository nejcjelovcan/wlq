import { newRoom } from '@wlq/wlq-model/src/room'
import { RestResponseError } from '../../rest'
import getRoom from '../getRoom'

describe('getRoom', () => {
  it('responds with room from roomGetter', async () => {
    await expect(
      getRoom({ data: { roomId: 'test' } }, async () => ({
        ...newRoom({ name: 'TEST', listed: true }),
      })),
    ).resolves.toMatchObject({ data: { room: { name: 'TEST' } } })
  })
  it('throws ResponseError if roomGetter returns undefined', async () => {
    const promise = expect(
      getRoom({ data: { roomId: 'test' } }, async () => undefined),
    )
    await promise.rejects.toMatchObject({ statusCode: 404 })
    await promise.rejects.toBeInstanceOf(RestResponseError)
  })
})
