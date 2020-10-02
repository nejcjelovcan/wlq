import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
} from '@chakra-ui/core'
import {
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS,
} from '@wlq/wlq-model/src/user/UserDetails'
import React, { useEffect, useState } from 'react'
import EmojiIcon from '../../components/EmojiIcon'
import { useOvermind } from '../../overmind'

const UserDetailsForm = ({ onDone }: { onDone?: () => void }) => {
  const {
    state: {
      user: { details },
    },
    actions: {
      user: { getUserDetails, setUserDetails },
    },
  } = useOvermind()

  const [touched, setTouched] = useState(false)
  const [alias, setAlias] = useState(details?.alias ?? '')

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

  return (
    <form onSubmit={() => false}>
      <Stack spacing={4}>
        <FormControl isInvalid={touched && !alias}>
          <FormLabel>Nickname</FormLabel>
          <Input
            placeholder="choose a name or nickname"
            value={alias}
            onChange={event => setAlias(event.target.value)}
            onBlur={() => {
              if (alias) {
                setUserDetails({ ...details, alias })
              }
              setTouched(true)
            }}
          />
          {!alias && (
            <FormErrorMessage>Please enter a nickname</FormErrorMessage>
          )}
        </FormControl>

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

        <Flex justifyContent="flex-end" pt={4}>
          <Button
            type="submit"
            size="lg"
            onClick={() => onDone && onDone()}
            isDisabled={!alias}
          >
            {onDone ? 'Continue' : 'Save'}
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}
export default UserDetailsForm
