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
import { sample } from '@wlq/wlq-model/src/helpers'
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
      user: { setUserDetails },
    },
  } = useOvermind()

  const [alias, setAlias] = useState(details?.alias ?? '')
  useEffect(() => {
    if (!details) {
      setUserDetails({
        color: sample(USER_DETAILS_COLORS),
        emoji: sample(USER_DETAILS_EMOJIS),
      })
    }
  }, [details, setUserDetails])

  return (
    <Stack spacing={4}>
      <FormControl isInvalid={!alias}>
        <FormLabel>Nickname</FormLabel>
        <Input
          placeholder="choose a name or nickname"
          value={alias}
          onChange={event => setAlias(event.target.value)}
          onBlur={() => {
            if (alias) {
              setUserDetails({ ...details, alias })
            }
          }}
        />
        {!alias && <FormErrorMessage>Please enter a nickname</FormErrorMessage>}
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
            const variant = emo === details?.emoji ? 'vibrant' : 'vibrantHover'
            return (
              <Button
                key={emo}
                colorScheme={details?.color ?? 'yellow'}
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

      <Flex justifyContent="space-between" pt={4}>
        <Button
          size="lg"
          onClick={() => onDone && onDone()}
          isDisabled={!alias}
        >
          {onDone ? 'Continue' : 'Save'}
        </Button>
      </Flex>
    </Stack>
  )
}
export default UserDetailsForm
