import * as t from "io-ts";
import { setEquals } from "../../helpers";
import { GameCodec, GamePublicCodec, getGamePublic } from "../game/Game";
import { Participant } from "./participant/Participant";

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
    t.type({ current: t.literal("Idle") }),
    t.type({
      current: t.literal("Game"),
      game: GameCodec
    })
  ])
]);

export type Room = t.TypeOf<typeof RoomCodec>;

export const RoomPublicCodec = t.intersection([
  RoomKeyCodec,
  t.type({ ...RoomProps, websocket: t.string }),
  t.union([
    t.type({ current: t.literal("Idle") }),
    t.type({
      current: t.literal("Game"),
      game: GamePublicCodec
    })
  ])
]);

export type RoomPublic = t.TypeOf<typeof RoomPublicCodec>;

export function getQuestionTokenIfEverybodyAnswered(
  room: Room,
  participants: Participant[]
): string | undefined {
  if (room.current === "Game" && room.game.current === "Question") {
    const answers = new Set(room.game.answers.map(a => a.pid));
    const pids = new Set(participants.map(p => p.pid));
    if (setEquals(answers, pids)) {
      return room.game.questionToken;
    }
    return undefined;
  }
  return undefined;
}

export function getRoomPublic(room: Room): RoomPublic {
  if (room.current === "Game") {
    return {
      ...room,
      game: getGamePublic(room.game),
      websocket: process.env.WEBSOCKET_ENDPOINT!
    };
  } else {
    return {
      ...room,
      websocket: `${process.env.WEBSOCKET_PROTOCOL}://${process.env.WEBSOCKET_ENDPOINT}`
    };
  }
}
