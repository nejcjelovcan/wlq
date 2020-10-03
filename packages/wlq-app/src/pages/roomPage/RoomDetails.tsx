import { Heading, Skeleton, Stack } from '@chakra-ui/core'

import React, { useEffect } from 'react'
import { useOvermind } from '../../overmind'

const RoomDetails = () => {
  const {
    state: {
      room: {
        currentRoom,
        socket: { loading, connected, error },
      },
    },
    actions: {
      room: { joinRoom, leaveRoom },
    },
  } = useOvermind()

  useEffect(() => {
    if (currentRoom && !loading && !connected) {
      joinRoom()
      return () => {
        leaveRoom()
      }
    }
    return () => {}
  }, [currentRoom, loading, connected, joinRoom, leaveRoom])

  return (
    <Stack spacing={4}>
      <Skeleton isLoaded={connected}>
        {connected ? 'User connected' : `Something happened: ${error}`}
      </Skeleton>
      <Skeleton isLoaded={connected}>
        <Heading as="h2">Participants</Heading>
      </Skeleton>
    </Stack>
  )
}
export default RoomDetails
