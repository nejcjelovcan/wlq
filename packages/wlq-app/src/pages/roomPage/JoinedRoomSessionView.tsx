import { Stack } from "@chakra-ui/core";
import React from "react";
import { useActions } from "../../overmind";
import { RoomSessionBaseState } from "../../overmind/roomSession/roomSession.statemachine";
import GameRoomView from "./joinedRoomSessionView/GameRoomView";
import IdleRoomView from "./joinedRoomSessionView/IdleRoomView";
import ParticipantList from "./joinedRoomSessionView/ParticipantList";

export type JoinedRoomSessionViewProps = RoomSessionBaseState & { pid: string };

export default function JoinedRoomSessionView({
  participants,
  room,
  pid
}: JoinedRoomSessionViewProps) {
  const isGame =
    room.current === "Game" &&
    (room.game.current === "Answer" || room.game.current === "Question");

  const {
    roomSession: { startGame, answerQuestion }
  } = useActions();

  return (
    <Stack spacing={4} flexGrow={1}>
      {!isGame && (
        <IdleRoomView startGame={startGame} participants={participants} />
      )}
      {room.current === "Game" && isGame && (
        <GameRoomView
          game={room.game}
          pid={pid}
          participants={participants}
          answerQuestion={answerQuestion}
        />
      )}
      <ParticipantList
        game={room.current === "Game" ? room.game : undefined}
        participants={participants}
      />
    </Stack>
  );
}
