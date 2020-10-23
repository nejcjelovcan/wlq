import * as t from "io-ts";
import { GameCodec } from "../game/Game";

const RoomKeyProps = {
  roomId: t.string
};

const RoomProps = {
  type: t.literal("Room"),
  listed: t.boolean,
  participantCount: t.number
};

const RoomIdleProps = {
  state: t.literal("Idle")
};

const RoomGameProps = {
  state: t.literal("Game"),
  game: GameCodec
};

export const RoomKeyCodec = t.type(RoomKeyProps);
export type RoomKey = t.TypeOf<typeof RoomKeyCodec>;

export const RoomCodec = t.intersection([
  RoomKeyCodec,
  t.type(RoomProps),
  t.union([t.type(RoomIdleProps), t.type(RoomGameProps)])
]);

export type Room = t.TypeOf<typeof RoomCodec>;

export function getQuestionTokenIfEverybodyAnswered(
  room: Room
): string | undefined {
  if (room.state === "Game" && room.game.state === "Question") {
    return room.game.questionToken;
  }
  return undefined;
}
