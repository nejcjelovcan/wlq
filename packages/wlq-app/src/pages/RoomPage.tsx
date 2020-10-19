import { Alert, Stack } from '@chakra-ui/core'
import { useRouter } from 'next/dist/client/router'
import React, { useEffect } from 'react'
import PageHead from '../components/PageHead'
import useToken from '../hooks/useToken'
import useUserDetails from '../hooks/useUserDetails'
import { useOvermind } from '../overmind'
import RoomCreationForm from './roomPage/RoomCreationForm'
import RoomDetails from './roomPage/RoomDetails'

const RoomPage = () => {
  const token = useToken()
  const ready = !!useUserDetails(true)

  const {
    state: {
      room: {
        currentRoom,
        getRoomRequest: { error: getRoomError },
      },
    },
    actions: {
      room: { getRoom },
    },
  } = useOvermind()

  const router = useRouter()
  const hasRoomId = typeof router.query.r === 'string'
  const rid = typeof router.query.r === 'string' ? router.query.r : undefined
  const roomLoaded = hasRoomId && currentRoom?.roomId === rid

  // redirect to /room/? if currentRoom changed
  useEffect(() => {
    if (currentRoom?.roomId && !rid) {
      router.replace(`/room/?r=${currentRoom.roomId}`, undefined, {
        shallow: true,
      })
    }
  }, [currentRoom, rid, router])

  // fetch room if rid is set but no currentRoom
  useEffect(() => {
    if (!roomLoaded && token && !getRoomError && rid) {
      getRoom(rid)
    }
  }, [roomLoaded, token, getRoom, rid, getRoomError])

  const error = getRoomError
  const loading = !ready || (hasRoomId && !error && !roomLoaded)
  const title = !hasRoomId ? 'New Game' : error ? 'Error' : 'Geography'

  return (
    <Stack spacing={4} flexGrow={1}>
      <PageHead
        loading={loading}
        title={title}
        showAlias={currentRoom ? currentRoom.state === 'Idle' : true}
      />
      {!hasRoomId && <RoomCreationForm userDetailsReady={ready} />}
      {hasRoomId && !error && <RoomDetails />}
      {error && <Alert status="error">{error}</Alert>}
    </Stack>
  )
}
export default RoomPage
