import { Button, Stack } from "@chakra-ui/core";
import { ParticipantPublic } from "@wlq/wlq-core/lib/model";
import React from "react";
import ColumnFlex from "../../../components/ColumnFlex";
import { useActions } from "../../../overmind";
import InviteYourFiends from "./idleRoomView/InviteYourFriends";

export type IdleRoomViewProps = { participants: ParticipantPublic[] };

export default function IdleRoomView({ participants }: IdleRoomViewProps) {
  const {
    roomSession: { startGame }
  } = useActions();
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
