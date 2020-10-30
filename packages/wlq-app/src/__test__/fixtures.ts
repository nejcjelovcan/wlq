import {
  getParticipantPublic,
  getRoomPublic,
  newParticipant,
  newRoom,
  ParticipantPublic,
  UserDetails
} from "@wlq/wlq-core/lib/model";

export const userDetails: UserDetails = {
  type: "UserDetails",
  emoji: "🐭",
  color: "red",
  alias: "Alias"
};

export const room = getRoomPublic(newRoom({ listed: true }));

export const participant = (override: Partial<ParticipantPublic> = {}) => ({
  ...getParticipantPublic(
    newParticipant({
      uid: "uid",
      details: userDetails,
      roomId: room.roomId,
      connectionId: "connectionId"
    })
  ),
  ...override
});
