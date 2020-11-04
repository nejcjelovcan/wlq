import { Button, Flex, Heading, HStack, Stack } from "@chakra-ui/core";
import {
  GamePublic,
  ParticipantsByAnswer,
  PosedQuestionPublic
} from "@wlq/wlq-core/lib/model";
import React, { useContext } from "react";
import CountdownProgress from "../../../../components/CountdownProgress";
import UserBadge from "../../../../components/UserBadge";
import UserDetailsContext from "../../../../contexts/UserDetailsContext";

export default function QuestionView({
  current,
  question: { questionText, options, time },
  userAnswer,
  revealedAnswer,
  participantsByAnswer,
  answerQuestion
}: {
  current: GamePublic["current"];
  question: PosedQuestionPublic;
  userAnswer?: string;
  revealedAnswer?: string;
  participantsByAnswer: ParticipantsByAnswer;
  answerQuestion: (answer: string) => void;
}) {
  const userDetails = useContext(UserDetailsContext);

  return (
    <Stack spacing={3}>
      <HStack justify="space-between">
        <Heading as="h2" size="lg">
          {questionText}
        </Heading>
        <CountdownProgress
          visible={current === "Question"}
          time={current === "Question" ? time : undefined}
        />
      </HStack>

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
              variant={color || correct ? "solid" : "outline"}
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
                      data-testid={`${option}-${p.pid}`}
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
