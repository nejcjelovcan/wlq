import { Button, Stack } from "@chakra-ui/core";
import { ParticipantPublic } from "@wlq/wlq-core/lib/model";
import React from "react";
import ColumnFlex from "../../../components/ColumnFlex";
import InviteYourFiends from "./idleRoomView/InviteYourFriends";

export type IdleRoomViewProps = {
  participants: ParticipantPublic[];
  startGame: () => void;
};

export default function IdleRoomView({
  startGame,
  participants
}: IdleRoomViewProps) {
  return (
    <ColumnFlex>
      <Stack spacing={2}>
        <InviteYourFiends
          text={participants.length === 0 ? "There's no one here." : undefined}
        />

        <Button size="lg" onClick={() => startGame()}>
          Start game
        </Button>
      </Stack>
    </ColumnFlex>
  );
}
