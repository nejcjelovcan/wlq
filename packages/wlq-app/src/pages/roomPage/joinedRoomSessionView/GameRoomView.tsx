import {
  GamePublic,
  getParticipantAnswer,
  getParticipantsByAnswer,
  ParticipantPublic
} from "@wlq/wlq-core/lib/model";
import React from "react";
import ColumnFlex from "../../../components/ColumnFlex";
import QuestionView from "./gameRoomView/QuestionView";

export default function GameRoomView({
  participants,
  game,
  pid,
  answerQuestion
}: {
  participants: ParticipantPublic[];
  game: GamePublic;
  pid: string;
  answerQuestion: (answer: string) => void;
}) {
  const userAnswer = getParticipantAnswer(game, pid);
  return (
    <ColumnFlex flexGrow={0} height="70vh">
      {(game.current === "Question" || game.current === "Answer") && (
        <QuestionView
          current={game.current}
          question={game.question}
          userAnswer={userAnswer?.answer}
          revealedAnswer={game.current === "Answer" ? game.answer : undefined}
          participantsByAnswer={getParticipantsByAnswer(game, participants)}
          answerQuestion={answerQuestion}
        />
      )}
    </ColumnFlex>
  );
}
