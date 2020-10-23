import * as t from "io-ts";
import { Game } from "./Game";

const NewGameProps = {
  roomId: t.string
};

export const NewGameType = t.type(NewGameProps);
export type NewGame = t.TypeOf<typeof NewGameType>;

export default function newGame({ roomId }: NewGame): Game {
  return {
    type: "Game",
    roomId,
    state: "Idle",
    questionCount: 10
  };
}
