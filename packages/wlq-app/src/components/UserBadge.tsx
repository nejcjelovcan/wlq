import { Box, Button, ButtonProps } from '@chakra-ui/core'
import React from 'react'
import UserDetails from '@wlq/wlq-model/src/user/UserDetails'
import EmojiIcon from './EmojiIcon'

export type UserBadgeProps = {
  userDetails: Partial<UserDetails>
} & ButtonProps

const UserBadge = ({
  userDetails,
  variant = 'vibrant',
  ...props
}: UserBadgeProps) => {
  const colorScheme = userDetails?.color ?? 'gray'

  return (
    <Button
      as="div"
      colorScheme={colorScheme}
      variant={variant}
      pl={2}
      pr={4}
      size="lg"
      borderRadius="full"
      textTransform="uppercase"
      fontWeight="bold"
      fontSize="xl"
      {...props}
    >
      <EmojiIcon
        emoji={userDetails?.emoji ?? '🧑🏾'}
        colorScheme={colorScheme}
        variant={variant}
      />

      <Box pl={2}>{userDetails?.alias ?? 'Alias'}</Box>
    </Button>
  )
}
export default UserBadge
