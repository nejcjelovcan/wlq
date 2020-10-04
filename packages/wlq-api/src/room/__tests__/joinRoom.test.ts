import {
  Room,
  RoomParticipant,
  RoomParticipantPublic,
} from '@wlq/wlq-model/src/room'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { RoomJoinProps } from '..'
import { newWsMessageEvent, WsMessageEvent } from '../../ws'
import joinRoom from '../joinRoom'
import {
  roomFixture,
  roomParticipantFixture,
  userDetailsFixture,
} from '@wlq/wlq-model/src/room/__tests__/room.fixtures'

const verifyTokenStub = async () => 'uid'
const roomGetterStub = async () => roomFixture()
const roomAndParticipantsGetterStub = async (): Promise<[
  Room | undefined,
  RoomParticipant[],
]> => [roomFixture(), []]
const addParticipantStub = async (participant: RoomParticipantPublic) =>
  participant
export const incomingEventFixture = (
  props: Partial<RoomJoinProps> = {},
): WsMessageEvent<RoomJoinProps> =>
  newWsMessageEvent<RoomJoinProps>('connectionId', 'joinRoom', {
    token: 'token',
    roomId: 'roomId',
    userDetails: userDetailsFixture(),
    ...props,
  })

describe('joinRoom', () => {
  it('responds with 403 if token not valid', async () => {
    await expect(
      joinRoom(
        async _ => {
          throw new Error('test')
        },
        roomGetterStub,
        roomAndParticipantsGetterStub,
        addParticipantStub,
      )(incomingEventFixture())
        [Symbol.asyncIterator]()
        .next(),
    ).rejects.toMatchObject({ statusCode: 403 })
  })
  it('responds with 400 if room does not exist', async () => {
    await expect(
      joinRoom(
        verifyTokenStub,
        async () => undefined,
        roomAndParticipantsGetterStub,
        addParticipantStub,
      )(incomingEventFixture())
        [Symbol.asyncIterator]()
        .next(),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
  it('throws ValidationError if userDetails are not valid', async () => {
    await expect(
      joinRoom(
        verifyTokenStub,
        roomGetterStub,
        roomAndParticipantsGetterStub,
        addParticipantStub,
      )(incomingEventFixture({ userDetails: { alias: '' } }))
        [Symbol.asyncIterator]()
        .next(),
    ).rejects.toBeInstanceOf(ValidationError)
  })
  it('calls addParticipant', async () => {
    const addParticipant = jest.fn()
    await expect(
      joinRoom(
        verifyTokenStub,
        roomGetterStub,
        roomAndParticipantsGetterStub,
        addParticipant,
      )(incomingEventFixture())
        [Symbol.asyncIterator]()
        .next(),
    ).resolves.toMatchObject({})
    expect(addParticipant.mock.calls.length).toBe(1)
  })
  it('calls addParticipant', async () => {
    const addParticipant = jest.fn()
    await expect(
      joinRoom(
        verifyTokenStub,
        roomGetterStub,
        roomAndParticipantsGetterStub,
        addParticipant,
      )(incomingEventFixture())
        [Symbol.asyncIterator]()
        .next(),
    ).resolves.toMatchObject({})
    expect(addParticipant.mock.calls.length).toBe(1)
  })
  it('yields setParticipants event for first participant', async () => {
    await expect(
      joinRoom(
        verifyTokenStub,
        roomGetterStub,
        roomAndParticipantsGetterStub,
        addParticipantStub,
      )(incomingEventFixture())
        [Symbol.asyncIterator]()
        .next(),
    ).resolves.toMatchObject({
      value: { message: { action: 'setParticipants' } },
    })
  })
  it('yields setParticipants and userJoined events if more than one participant', async () => {
    const roomAndParticipantsGetter = async (): Promise<[
      Room | undefined,
      RoomParticipant[],
    ]> => [roomFixture(), [roomParticipantFixture()]]

    const iterator = joinRoom(
      verifyTokenStub,
      roomGetterStub,
      roomAndParticipantsGetter,
      addParticipantStub,
    )(incomingEventFixture())[Symbol.asyncIterator]()

    await expect(iterator.next()).resolves.toMatchObject({
      value: { message: { action: 'setParticipants' } },
    })

    await expect(iterator.next()).resolves.toMatchObject({
      value: [{ message: { action: 'userJoined' } }],
    })
  })
})
