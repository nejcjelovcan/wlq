import * as t from "io-ts";
import { GameCodec, GamePublicCodec, getGamePublic } from "../game/Game";

const RoomKeyProps = {
  roomId: t.string
};

const RoomProps = {
  type: t.literal("Room"),
  listed: t.boolean,
  participantCount: t.number
};

export const RoomKeyCodec = t.type(RoomKeyProps);
export type RoomKey = t.TypeOf<typeof RoomKeyCodec>;

export const RoomCodec = t.intersection([
  RoomKeyCodec,
  t.type(RoomProps),
  t.union([
    t.type({ state: t.literal("Idle") }),
    t.type({
      state: t.literal("Game"),
      game: GameCodec
    })
  ])
]);

export type Room = t.TypeOf<typeof RoomCodec>;

export const RoomPublicCodec = t.intersection([
  RoomKeyCodec,
  t.type(RoomProps),
  t.union([
    t.type({ state: t.literal("Idle") }),
    t.type({
      state: t.literal("Game"),
      game: GamePublicCodec
    })
  ])
]);

export type RoomPublic = t.TypeOf<typeof RoomPublicCodec>;

export function getQuestionTokenIfEverybodyAnswered(
  room: Room
): string | undefined {
  if (room.state === "Game" && room.game.state === "Question") {
    return room.game.questionToken;
  }
  return undefined;
}

export function getRoomPublic(room: Room): RoomPublic {
  if (room.state === "Game") {
    return { ...room, game: getGamePublic(room.game) };
  } else {
    return room;
  }
}
