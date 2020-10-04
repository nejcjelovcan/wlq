import { Button, Heading, Skeleton, Stack } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import UserBadge from '../../components/UserBadge'
import { useOvermind } from '../../overmind'

const RoomDetails = () => {
  const {
    state: {
      room: {
        currentRoom,
        socket: { loading, connected, error },
        roomSession: { participants },
      },
    },
    actions: {
      room: { joinRoom, leaveRoom, startGame },
    },
  } = useOvermind()

  useEffect(() => {
    if (currentRoom && !loading && !connected && !error) {
      joinRoom()
      return () => {
        leaveRoom()
      }
    }
    return () => {}
  }, [currentRoom, loading, connected, error, joinRoom, leaveRoom])

  return (
    <Stack spacing={4}>
      <Skeleton isLoaded={connected || !!error}>
        {connected ? 'User connected' : `Something happened: ${error}`}
      </Skeleton>
      <Skeleton isLoaded={connected}>
        <Heading as="h2">Participants</Heading>
        {participants.map(p => (
          <UserBadge key={p.pid} userDetails={p.details} />
        ))}
      </Skeleton>
      {currentRoom?.state === 'Idle' && (
        <Button size="lg" onClick={() => startGame()}>
          Start game
        </Button>
      )}
    </Stack>
  )
}
export default RoomDetails
