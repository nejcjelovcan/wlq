import {
  newRoom,
  newRoomParticipant,
  Room,
  RoomParticipant,
  UserDetails,
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
  color: 'red',
  emoji: '🦄',
  ...props,
})
