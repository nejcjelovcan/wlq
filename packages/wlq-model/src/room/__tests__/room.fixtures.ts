import {
  newRoom,
  newRoomParticipant,
  Room,
  RoomParticipant,
  sample,
  UserDetails,
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS,
} from '@wlq/wlq-model/src'

export const roomFixture = (props: Partial<Room> = {}): Room => ({
  ...newRoom({ name: 'Room', listed: true }),
  ...props,
})

export const roomParticipantFixture = (
  props: Partial<RoomParticipant> = {},
): RoomParticipant => ({
  ...newRoomParticipant({
    roomId: 'roomId',
    details: userDetailsFixture(),
    uid: 'uid',
    connectionId: 'cid',
  }),
  ...props,
})

export const userDetailsFixture = (props: Partial<UserDetails> = {}) => ({
  alias: 'Test',
  color: sample(USER_DETAILS_COLORS),
  emoji: sample(USER_DETAILS_EMOJIS),
  ...props,
})

export const roomParticipantWithAliasFixture = (
  alias: string,
  props: Partial<RoomParticipant> = {},
) =>
  roomParticipantFixture({
    details: userDetailsFixture({ alias }),
    uid: `uid${alias}`,
    pid: `pid${alias}`,
    connectionId: `connectionId${alias}`,
    ...props,
  })
