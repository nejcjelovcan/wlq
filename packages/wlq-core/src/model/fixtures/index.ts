import { newRoom } from "..";
import { UserDetails } from "../room/participant/UserDetails";
import { getRoomPublic, Room, RoomPublic } from "../room/Room";
import deepExtend from "deep-extend";
import {
  getParticipantPublic,
  newParticipant,
  Participant,
  ParticipantPublic
} from "../room/participant/Participant";

export const userDetailsFixture = (
  override: Partial<UserDetails> = {}
): UserDetails =>
  deepExtend(
    {
      type: "UserDetails",
      emoji: "🐭",
      color: "red",
      alias: "Alias"
    },
    override
  );

// watch out though, Room has different states and this can return an invalid
// Room with certain overrides
export const roomFixture = (override: Partial<Room> = {}): Room =>
  deepExtend(newRoom({ listed: true }), override);

export const roomPublicFixture = (override: Partial<RoomPublic> = {}) =>
  deepExtend(getRoomPublic(roomFixture()), override);

export const participantFixture = (override: Partial<Participant> = {}) =>
  deepExtend(
    newParticipant({
      uid: "uid",
      details: userDetailsFixture(),
      connectionId: "connectionId",
      roomId: "roomId"
    }),
    override
  );

export const participantPublicFixture = (
  override: Partial<ParticipantPublic> = {}
) => deepExtend(getParticipantPublic(participantFixture()), override);
