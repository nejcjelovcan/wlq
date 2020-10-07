import { Button, Flex, Heading, HStack } from '@chakra-ui/core'
import React from 'react'
import UserBadge from '../../../components/UserBadge'
import { useOvermind } from '../../../overmind'

const RoomQuestion = () => {
  const {
    state: {
      room: {
        currentRoom,
        roomSession: {
          currentQuestion,
          currentAnswer,
          participantAnswer,
          participants,
        },
      },
    },
    actions: {
      room: { answerQuestion },
    },
  } = useOvermind()

  const revealed = !!currentAnswer
  const answered =
    currentRoom?.state === 'Answer' || !!participantAnswer || revealed

  const getParticipantsForAnswer = (answer: string) =>
    participants.filter(p => (currentRoom?.answers ?? {})[p.pid] === answer)

  return (
    <>
      <Heading as="h2" size="lg">
        {currentQuestion?.questionText}
      </Heading>
      {currentQuestion?.options.map(option => {
        let color: string | undefined = undefined
        const correct = currentAnswer?.name === option.name
        if (revealed) {
          color = correct
            ? 'green'
            : participantAnswer === option.name
            ? 'red'
            : undefined
        }
        return (
          <Flex
            key={option.name}
            direction="row"
            justifyContent="space-between"
          >
            <Button
              flexGrow={revealed ? 0 : 1}
              isDisabled={revealed}
              borderRadius="full"
              variant={
                color || participantAnswer === option.name ? 'solid' : 'outline'
              }
              colorScheme={color}
              onClick={() => answerQuestion(option.name)}
            >
              {option.name}
            </Button>
            {revealed && (
              <Flex>
                <HStack spacing={1}>
                  {getParticipantsForAnswer(option.name).map(p => (
                    <UserBadge
                      key={p.pid}
                      userDetails={p.details}
                      showAlias={false}
                      grayscale={!correct}
                    />
                  ))}
                </HStack>
              </Flex>
            )}
          </Flex>
        )
      })}
    </>
  )
}
export default RoomQuestion
