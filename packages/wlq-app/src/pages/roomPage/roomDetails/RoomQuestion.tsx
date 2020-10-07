import { Box, Button, Flex, Heading } from '@chakra-ui/core'
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
  const correct = participantAnswer === currentAnswer?.name

  const getParticipantsForAnswer = (answer: string) =>
    participants.filter(p => (currentRoom?.answers ?? {})[p.pid] === answer)

  return (
    <>
      <Heading as="h2" size="lg">
        {currentQuestion?.questionText}
      </Heading>
      {currentQuestion?.options.map(option => (
        <Flex key={option.name} direction="column">
          <Button
            // flexGrow={answered ? 0 : 1}
            isDisabled={answered}
            borderRadius="full"
            variant={participantAnswer === option.name ? 'solid' : 'outline'}
            colorScheme={
              participantAnswer === option.name && revealed
                ? correct
                  ? 'green'
                  : 'red'
                : undefined
            }
            onClick={() => answerQuestion(option.name)}
          >
            {option.name}
          </Button>
          {revealed && (
            <Box>
              {getParticipantsForAnswer(option.name).map(p => (
                <UserBadge userDetails={p.details} showAlias={false} />
              ))}
            </Box>
          )}
        </Flex>
      ))}
    </>
  )
}
export default RoomQuestion
