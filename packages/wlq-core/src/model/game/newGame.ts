import { Game } from "./Game";

export default function newGame(): Game {
  return {
    type: "Game",

    current: "Idle",
    questionCount: 10,
    questionIndex: 0
  };
}
