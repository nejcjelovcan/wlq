import { Flex, Slide } from "@chakra-ui/core";
import { GamePublic, ParticipantPublic } from "@wlq/wlq-core/lib/model";
import React from "react";
import Bounce from "../../../components/Bounce";
import UserBadge from "../../../components/UserBadge";

export default function ParticipantList({
  participants,
  game
}: {
  participants: ParticipantPublic[];
  game?: GamePublic;
}) {
  const inQuestion = Boolean(game && game.current === "Question");
  const answeredParticipants =
    game && game.current === "Question" ? game.answeredParticipants : [];

  return (
    <Slide direction="bottom" in={participants.length > 0}>
      <Flex justifyContent="center" flexWrap="wrap">
        {participants.map(({ pid, details }) => (
          <Bounce
            key={pid}
            animate={inQuestion && answeredParticipants.includes(pid)}
          >
            <UserBadge
              grayscale={inQuestion && !answeredParticipants.includes(pid)}
              data-testid={pid}
              userDetails={details}
              mr={4}
              mb={4}
            />
          </Bounce>
        ))}
      </Flex>
    </Slide>
  );
}
