import { Flex } from "@chakra-ui/core";
import {
  GamePublic,
  getParticipantAnswer,
  getParticipantsByAnswer,
  ParticipantPublic
} from "@wlq/wlq-core/lib/model";
import React from "react";
import QuestionView from "./gameRoomView/QuestionView";

export default function GameRoomView({
  participants,
  game,
  pid
}: {
  participants: ParticipantPublic[];
  game: GamePublic;
  pid: string;
}) {
  const userAnswer = getParticipantAnswer(game, pid);
  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      alignItems="stretch"
      height="70vh"
    >
      {(game.current === "Question" || game.current === "Answer") && (
        <QuestionView
          current={game.current}
          question={game.question}
          userAnswer={userAnswer?.answer}
          revealedAnswer={game.current === "Answer" ? game.answer : undefined}
          participantsByAnswer={getParticipantsByAnswer(game, participants)}
        />
      )}
      {game.current === "Idle" && <div>Idle</div>}
      {game.current === "Finished" && <div>Finished</div>}
    </Flex>
  );
}
