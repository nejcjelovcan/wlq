import { Button, Center, Flex, Heading, HStack } from '@chakra-ui/core'
import React from 'react'
import UserBadge from '../../../components/UserBadge'
import { useOvermind } from '../../../overmind'

const RoomQuestion = () => {
  const {
    state: {
      // user: { details },
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
        if (revealed) {
          color =
            currentAnswer?.name === option.name
              ? 'green'
              : participantAnswer === option.name
              ? 'red'
              : undefined
        }
        return (
          <Flex key={option.name} direction="column">
            <Button
              // flexGrow={answered ? 0 : 1}
              isDisabled={answered}
              borderRadius="full"
              variant={color ? 'solid' : 'outline'}
              colorScheme={color}
              onClick={() => answerQuestion(option.name)}
            >
              {option.name}
            </Button>
            {revealed && (
              <Center>
                <HStack spacing={1}>
                  {getParticipantsForAnswer(option.name).map(p => (
                    <UserBadge userDetails={p.details} showAlias={false} />
                  ))}
                </HStack>
              </Center>
            )}
          </Flex>
        )
      })}
    </>
  )
}
export default RoomQuestion
