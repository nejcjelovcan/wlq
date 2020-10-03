import { Stack } from '@chakra-ui/core'
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
      room: { currentRoom },
    },
    actions: {
      room: { getRoom },
    },
  } = useOvermind()

  const router = useRouter()
  const rid = typeof router.query.r === 'string' ? router.query.r : undefined
  const roomNotLoaded = !!(rid && currentRoom?.roomId !== rid)

  // redirect to /room/? if currentRoom changed
  useEffect(() => {
    if (currentRoom?.roomId && !rid) {
      router.push(`/room/?r=${currentRoom.roomId}`, undefined, {
        shallow: true,
      })
    }
  }, [currentRoom, rid, router])

  // fetch room if rid is set but no currentRoom
  useEffect(() => {
    if (roomNotLoaded && token && rid) {
      getRoom(rid)
    }
  }, [roomNotLoaded, token, getRoom, rid])

  return (
    <Stack spacing={4}>
      <PageHead
        loading={!ready || roomNotLoaded}
        title={roomNotLoaded ? 'Room name' : currentRoom?.name ?? 'New room'}
      />
      {!rid && <RoomCreationForm userDetailsReady={ready} />}
      {rid && <RoomDetails />}
    </Stack>
  )
}
export default RoomPage
