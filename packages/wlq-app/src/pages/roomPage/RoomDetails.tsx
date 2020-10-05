import {
  Alert,
  Box,
  Button,
  Flex,
  Skeleton,
  Stack,
  useDisclosure,
} from '@chakra-ui/core'
import React, { useCallback, useEffect } from 'react'
import UserBadge from '../../components/UserBadge'
import { useOvermind } from '../../overmind'
import InviteYourFiends from './roomDetails/InviteYourFriends'
import RoomQuestion from './roomDetails/RoomQuestion'
import StartGameModal from './roomDetails/StartGameModal'

const RoomDetails = () => {
  const {
    state: {
      room: {
        currentRoom,
        socket: { loading, connected, error },
        roomSession: { participants, pid, currentQuestion, usersAnswered },
      },
    },
    actions: {
      room: { joinRoom, leaveRoom, startGame, cleanRoomData },
    },
  } = useOvermind()

  // When currentRoom/connected changes we call joinRoom()
  useEffect(() => {
    if (currentRoom && !loading && !connected && !error) {
      joinRoom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, connected])

  // Leave room
  useEffect(() => {
    if (currentRoom) {
      return () => {
        cleanRoomData()
        leaveRoom()
      }
    }
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom?.roomId])

  const otherUsers = participants.filter(p => p.pid !== pid)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onStartGame = useCallback(() => {
    if (otherUsers.length === 0) {
      onOpen()
    } else {
      startGame()
    }
  }, [otherUsers, onOpen, startGame])

  const loaded = connected || !!error

  return (
    <Flex direction="column" flexGrow={1}>
      <Flex
        as={Flex}
        justifyContent={error ? 'flex-start' : 'center'}
        flexDirection="column"
        alignItems="stretch"
        height="70vh"
      >
        <Skeleton isLoaded={loaded}>
          {error && <Alert status="error">{error}</Alert>}
          {connected && (
            <Stack spacing={4}>
              {currentRoom?.state === 'Idle' && (
                <>
                  {otherUsers.length === 0 && (
                    <InviteYourFiends text="There's no one here." />
                  )}

                  <Button size="lg" onClick={onStartGame}>
                    Start game
                  </Button>
                </>
              )}
              {currentRoom?.state === 'Question' && currentQuestion && (
                <RoomQuestion />
              )}
            </Stack>
          )}
        </Skeleton>
      </Flex>

      {!error && (
        <Box position="fixed" bottom={0} width={{ base: '100%', sm: '30em' }}>
          <Flex justifyContent="center" flexWrap="wrap">
            {otherUsers.map(({ pid, details }) => (
              <UserBadge
                grayscale={
                  currentRoom?.state === 'Question' &&
                  !usersAnswered.includes(pid)
                }
                key={pid}
                userDetails={details}
                showAlias={currentRoom?.state === 'Idle'}
                mr={4}
                mb={4}
              />
            ))}
          </Flex>
        </Box>
      )}
      <StartGameModal isOpen={isOpen} onClose={onClose} startGame={startGame} />
    </Flex>
  )
}
export default RoomDetails
