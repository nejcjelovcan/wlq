import { Stack } from "@chakra-ui/core";
import React from "react";
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

  return (
    <Stack spacing={4} flexGrow={1}>
      {!isGame && <IdleRoomView participants={participants} />}
      {room.current === "Game" && isGame && (
        <GameRoomView game={room.game} pid={pid} participants={participants} />
      )}
      <ParticipantList
        game={room.current === "Game" ? room.game : undefined}
        participants={participants}
      />
    </Stack>
  );
}
