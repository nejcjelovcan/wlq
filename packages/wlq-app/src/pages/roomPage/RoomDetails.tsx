import { Button, Flex, Skeleton, Stack, useDisclosure } from '@chakra-ui/core'
import React, { useCallback, useEffect } from 'react'
import UserBadge from '../../components/UserBadge'
import { useOvermind } from '../../overmind'
import InviteYourFiends from './roomDetails/InviteYourFriends'
import StartGameModal from './roomDetails/StartGameModal'

const RoomDetails = () => {
  const {
    state: {
      room: {
        currentRoom,
        socket: { loading, connected, error },
        roomSession: { participants, pid },
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

  const otherUsers = participants.filter(p => p.pid !== pid)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onStartGame = useCallback(() => {
    if (otherUsers.length === 0) {
      onOpen()
    } else {
      startGame()
    }
  }, [otherUsers, onOpen, startGame])

  return (
    <Flex direction="column" justifyContent="space-between" flexGrow={1}>
      <Stack spacing={4}>
        <Skeleton isLoaded={connected}>
          {otherUsers.map(p => (
            <UserBadge key={p.pid} userDetails={p.details} mr={4} />
          ))}
          {otherUsers.length === 0 && (
            <InviteYourFiends text="There's no one here." />
          )}
        </Skeleton>
      </Stack>
      {currentRoom?.state === 'Idle' && (
        <Button size="lg" onClick={onStartGame}>
          Start game
        </Button>
      )}
      <StartGameModal isOpen={isOpen} onClose={onClose} startGame={startGame} />
    </Flex>
  )
}
export default RoomDetails
