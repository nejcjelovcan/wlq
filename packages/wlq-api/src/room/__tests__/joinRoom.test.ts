import {
  roomFixture,
  userDetailsFixture,
} from '@wlq/wlq-model/src/room/__tests__/room.fixtures'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import {
  GetRoomCallback,
  GetRoomParticipantsCallback,
  JoinRoomPayload,
  PutParticipantCallback,
} from '..'
import { WebsocketEvent } from '../../websocket'
import joinRoom from '../joinRoom'

const verifyTokenStub = async () => 'uid'
const getRoomStub: GetRoomCallback = async () => roomFixture()
const putParticipantStub: PutParticipantCallback = async participant =>
  participant
const getRoomParticipantsStub: GetRoomParticipantsCallback = async () => []
export const incomingEventFixture = (
  props: Partial<JoinRoomPayload['data']> = {},
): WebsocketEvent<JoinRoomPayload> => ({
  connectionId: 'connectionId',
  action: 'joinRoom',
  data: {
    token: 'token',
    roomId: 'roomId',
    userDetails: userDetailsFixture(),
    ...props,
  },
})

describe('joinRoom', () => {
  it('responds with 403 if token not valid', async () => {
    await expect(
      joinRoom(
        getRoomStub,
        async _ => {
          throw new Error('test')
        },
        putParticipantStub,
        getRoomParticipantsStub,
      )(incomingEventFixture()),
    ).rejects.toMatchObject({ statusCode: 403 })
  })
  it('responds with 400 if room does not exist', async () => {
    await expect(
      joinRoom(
        async () => undefined,
        verifyTokenStub,
        putParticipantStub,
        getRoomParticipantsStub,
      )(incomingEventFixture()),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
  it('throws ValidationError if userDetails are not valid', async () => {
    await expect(
      joinRoom(
        getRoomStub,
        verifyTokenStub,
        putParticipantStub,
        getRoomParticipantsStub,
      )(incomingEventFixture({ userDetails: { alias: '' } })),
    ).rejects.toBeInstanceOf(ValidationError)
  })
  it('calls putParticipant', async () => {
    const putParticipant = jest.fn()
    await expect(
      joinRoom(
        getRoomStub,
        verifyTokenStub,
        putParticipant,
        getRoomParticipantsStub,
      )(incomingEventFixture()),
    ).resolves.toMatchObject({})
    expect(putParticipant.mock.calls.length).toBe(1)
  })
  it('returns setParticipants event for first participant', async () => {
    await expect(
      joinRoom(
        getRoomStub,
        verifyTokenStub,
        putParticipantStub,
        getRoomParticipantsStub,
      )(incomingEventFixture()),
    ).resolves.toMatchObject([{ action: 'setParticipants' }, {}])
  })
  it('returns userJoined broadcast', async () => {
    await expect(
      joinRoom(
        getRoomStub,
        verifyTokenStub,
        putParticipantStub,
        getRoomParticipantsStub,
      )(incomingEventFixture()),
    ).resolves.toMatchObject([{}, { action: 'userJoined' }])
  })
})
