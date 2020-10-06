import { Box, Button, Flex, Heading } from '@chakra-ui/core'
import React from 'react'
import UserBadge from '../../../components/UserBadge'
import { useOvermind } from '../../../overmind'

const RoomQuestion = () => {
  const {
    state: {
      user: { details },
      room: {
        currentRoom,
        roomSession: { currentQuestion, participantAnswer },
      },
    },
    actions: {
      room: { answerQuestion },
    },
  } = useOvermind()
  const answered = currentRoom?.state === 'Answer' || !!participantAnswer

  return (
    <>
      <Heading as="h2" size="lg">
        {currentQuestion?.questionText}
      </Heading>
      {currentQuestion?.options.map(option => (
        <Flex key={option.name} direction="row" justifyContent="space-between">
          <Button
            flexGrow={answered ? 0 : 1}
            borderRadius="full"
            onClick={() => answerQuestion(option.name)}
          >
            {option.name}
          </Button>
          <Box>
            {answered && participantAnswer === option.name && details && (
              <UserBadge userDetails={details} showAlias={false} />
            )}
          </Box>
        </Flex>
      ))}
    </>
  )
}
export default RoomQuestion
