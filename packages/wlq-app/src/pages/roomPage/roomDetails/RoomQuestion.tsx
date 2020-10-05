import { Button, Flex, Heading } from '@chakra-ui/core'
import React from 'react'
import UserBadge from '../../../components/UserBadge'
import { useOvermind } from '../../../overmind'

const RoomQuestion = () => {
  const {
    state: {
      user: { details },
      room: {
        currentRoom,
        roomSession: { currentQuestion, currentAnswer },
      },
    },
    actions: {
      room: { answerQuestion },
    },
  } = useOvermind()
  const answered = currentRoom?.state === 'Answer' || !!currentAnswer

  return (
    <>
      <Heading as="h2" size="lg" textAlign="center">
        {currentQuestion?.questionText}
      </Heading>
      {currentQuestion?.options.map(option => (
        <Flex direction="row" justifyContent="space-between">
          <Button
            flexGrow={answered ? 0 : 1}
            borderRadius="full"
            key={option.name}
            onClick={() => answerQuestion(option.name)}
          >
            {option.name}
          </Button>
          {answered && currentAnswer === option.name && details && (
            <UserBadge userDetails={details} showAlias={false} />
          )}
        </Flex>
      ))}
    </>
  )
}
export default RoomQuestion
