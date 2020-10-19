import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Skeleton,
  Spinner,
  Stack,
  Switch,
} from '@chakra-ui/core'
import React, { useCallback, useState } from 'react'
import { useOvermind } from '../../overmind'

const RoomCreationForm = ({
  userDetailsReady,
}: {
  userDetailsReady: boolean
}) => {
  const {
    state: {
      room: {
        roomCreation,
        roomCreationError,
        roomCreationValid,
        roomCreationRequest: { loading, error },
      },
    },
    actions: {
      room: { setRoomCreation, createRoom },
    },
  } = useOvermind()

  const [listed, setListed] = useState(roomCreation?.listed ?? true)

  const onSubmit = useCallback(
    event => {
      event.preventDefault()
      if (roomCreationValid) {
        createRoom()
      } else {
        setRoomCreation({ ...roomCreation, listed })
      }
    },
    [roomCreation, roomCreationValid, listed, setRoomCreation, createRoom],
  )

  return (
    <form action="?" onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Skeleton isLoaded={userDetailsReady}>
          <FormControl
            isInvalid={roomCreationError?.field === 'listed'}
            isReadOnly={loading}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="listed">Listed</FormLabel>
              <Switch
                size="lg"
                id="listed"
                isChecked={listed}
                onChange={event => {
                  setListed(event.target.checked)
                  setRoomCreation({
                    ...roomCreation,
                    listed: event.target.checked,
                  })
                }}
              />
            </Flex>

            <FormHelperText display="block">
              Listed rooms will be visible to everybody. Turn this off if you
              only want to share links with friends.
            </FormHelperText>
          </FormControl>
        </Skeleton>
        <Skeleton isLoaded={userDetailsReady}>
          <FormControl isInvalid={!!error}>
            <FormErrorMessage>{error}</FormErrorMessage>
            <Flex justifyContent="flex-end" pt={4}>
              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                spinner={<Spinner />}
              >
                Continue
              </Button>
            </Flex>
          </FormControl>
        </Skeleton>
      </Stack>
    </form>
  )
}
export default RoomCreationForm
