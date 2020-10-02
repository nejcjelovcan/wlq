import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@chakra-ui/core'
import { useThrottleCallback } from '@react-hook/throttle'
import {
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS,
} from '@wlq/wlq-model/src/user/UserDetails'
import React, { useCallback, useEffect, useState } from 'react'
import EmojiIcon from '../../components/EmojiIcon'
import { useOvermind } from '../../overmind'

const UserDetailsForm = ({ onDone }: { onDone?: () => void }) => {
  const {
    state: {
      user: { details, detailsValid },
    },
    actions: {
      user: { getUserDetails, setUserDetails },
    },
  } = useOvermind()

  const [touched, setTouched] = useState(false)
  const [alias, setAlias] = useState(details?.alias ?? '')
  const throttledSetUserDetails = useThrottleCallback(setUserDetails, 10, true)

  // There are two issue we are solving here
  // 1. userDetails come from localStorage, so static/ssr doesn't know about it
  // (which can cause a render mismatch)
  // 2. if no userDetails are present, we set a random emoji/color, which again
  // could cause render mismatch
  // Therefore all logic is done on frontend with getUserDetails action
  // This approach does cause a slight flash, though (form is empty before
  // interactive)
  useEffect(() => {
    setAlias(getUserDetails()?.alias || '')
  }, [getUserDetails])

  const onSubmit = useCallback(
    event => {
      event.preventDefault()
      if (detailsValid) {
        onDone && onDone()
      }
    },
    [detailsValid, onDone],
  )

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Skeleton isLoaded={true}>
          <FormControl isInvalid={touched && !alias}>
            <FormLabel>Nickname</FormLabel>
            <Input
              placeholder="choose a name or nickname"
              value={alias}
              onChange={event => {
                setAlias(event.target.value)
                throttledSetUserDetails({
                  ...details,
                  alias: event.target.value,
                })
                setTouched(true)
              }}
            />
            {!alias && (
              <FormErrorMessage>Please enter a nickname</FormErrorMessage>
            )}
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <FormControl>
            <FormLabel>Color</FormLabel>
            <SimpleGrid columns={{ base: 5, sm: 9 }} spacing={2}>
              {USER_DETAILS_COLORS.map(col => (
                <Button
                  key={col}
                  fontSize="4xl"
                  colorScheme={col}
                  variant="vibrant"
                  onClick={() => setUserDetails({ ...details, color: col })}
                  aria-label={`Color ${col}`}
                >
                  {col === details?.color ? '•' : ''}
                </Button>
              ))}
            </SimpleGrid>
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <FormControl>
            <FormLabel>Icon</FormLabel>
            <SimpleGrid columns={{ base: 5, sm: 7 }} spacingY={2} spacingX={2}>
              {USER_DETAILS_EMOJIS.map(emo => {
                const variant =
                  emo === details?.emoji ? 'vibrant' : 'vibrantHover'
                return (
                  <Button
                    key={`${details?.color}${emo}`}
                    colorScheme={details?.color}
                    variant={variant}
                    onClick={() => setUserDetails({ ...details, emoji: emo })}
                    p={2}
                    maxWidth="3.5rem"
                    height="3.5rem"
                    borderRadius="full"
                  >
                    <EmojiIcon
                      emoji={emo}
                      colorScheme={details?.color ?? 'yellow'}
                      variant={variant}
                    />
                  </Button>
                )
              })}
            </SimpleGrid>
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <Flex justifyContent="flex-end" pt={4}>
            <Button type="submit" size="lg" isDisabled={!alias}>
              {onDone ? 'Continue' : 'Save'}
            </Button>
          </Flex>
        </Skeleton>
      </Stack>
    </form>
  )
}
export default UserDetailsForm
