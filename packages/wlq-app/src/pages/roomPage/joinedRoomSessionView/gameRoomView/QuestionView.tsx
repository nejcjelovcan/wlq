import { Button, Flex, Heading, HStack, Stack } from "@chakra-ui/core";
import {
  GamePublic,
  ParticipantsByAnswer,
  PosedQuestionPublic
} from "@wlq/wlq-core/lib/model";
import React, { useContext } from "react";
import UserBadge from "../../../../components/UserBadge";
import UserDetailsContext from "../../../../contexts/UserDetailsContext";
import { useActions } from "../../../../overmind";

export default function QuestionView({
  current,
  question: { questionText, options },
  userAnswer,
  revealedAnswer,
  participantsByAnswer
}: {
  current: GamePublic["current"];
  question: PosedQuestionPublic;
  userAnswer?: string;
  revealedAnswer?: string;
  participantsByAnswer: ParticipantsByAnswer;
}) {
  const {
    roomSession: { answerQuestion }
  } = useActions();
  const userDetails = useContext(UserDetailsContext);

  return (
    <Stack spacing={3}>
      <Heading as="h2" size="lg">
        {questionText}
      </Heading>
      {options.map(option => {
        let color: string | undefined = undefined;
        const correct = revealedAnswer === option;
        if (current === "Answer" && userAnswer) {
          color =
            userAnswer === option ? (correct ? "green" : "red") : undefined;
        }
        return (
          <Flex
            key={`${questionText}-${option}`}
            direction="row"
            justifyContent="space-between"
          >
            <Button
              flexGrow={current === "Answer" ? 0 : 1}
              disabled={Boolean(userAnswer) || current === "Answer"}
              borderRadius="full"
              variant={color ? "solid" : "outline"}
              colorScheme={color}
              onClick={
                !userAnswer && current === "Question"
                  ? () => answerQuestion(option)
                  : undefined
              }
            >
              {option}
            </Button>
            {current === "Answer" && (
              <Flex>
                <HStack spacing={1}>
                  {(participantsByAnswer[option] || []).map(p => (
                    <UserBadge
                      key={p.pid}
                      userDetails={p.details}
                      showAlias={false}
                      grayscale={!correct}
                    />
                  ))}
                  {userAnswer === option && (
                    <UserBadge
                      key="user"
                      userDetails={userDetails!}
                      showAlias={false}
                      grayscale={!correct}
                    />
                  )}
                </HStack>
              </Flex>
            )}
          </Flex>
        );
      })}
    </Stack>
  );
}
