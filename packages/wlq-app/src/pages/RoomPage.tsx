import { Stack } from '@chakra-ui/core'
import { useRouter } from 'next/dist/client/router'
import React, { useEffect } from 'react'
import PageHead from '../components/PageHead'
import useToken from '../hooks/useToken'
import { useOvermind } from '../overmind'
import RoomCreationForm from './roomPage/RoomCreationForm'

const RoomPage = () => {
  const token = useToken()

  const {
    state: {
      room: { currentRoom },
    },
    actions: {
      room: { getRoom },
    },
  } = useOvermind()

  const router = useRouter()
  const rid = router.query.r
  const notLoaded = !!(rid && currentRoom?.roomId !== rid)

  // redirect to /room/? if currentRoom changed
  useEffect(() => {
    if (currentRoom?.roomId && !rid) {
      console.log('ROUTER PUSH')
      router.push(`/room/?r=${currentRoom.roomId}`, undefined, {
        shallow: true,
      })
    }
  }, [currentRoom, rid, router])

  // fetch room if rid is set but no currentRoom
  useEffect(() => {
    if (notLoaded && token) {
      console.log('GET ROOM')
      // getRoom()
    }
  }, [notLoaded, token, getRoom])

  return (
    <Stack spacing={4}>
      <PageHead
        loading={notLoaded}
        title={notLoaded ? 'Room name' : currentRoom?.name ?? 'New room'}
      />
      {!rid && <RoomCreationForm />}
    </Stack>
  )
}
export default RoomPage
