import React from 'react'
import {
  Box,
  Flex,
  SystemStyleObject,
  useStyleConfig,
  useTheme,
} from '@chakra-ui/core'
import { getColor } from '@chakra-ui/theme-tools'

export interface EmojiIconProps {
  emoji: string
  colorScheme: string
  variant: string
  fontSize?: string
}

const EmojiIcon = ({
  emoji,
  colorScheme,
  variant,
  fontSize,
}: EmojiIconProps) => {
  const buttonStyle = useStyleConfig('Button', {
    colorScheme,
    variant,
  }) as SystemStyleObject
  const theme = useTheme()
  const textColor = getColor(theme, buttonStyle['color'] || 'gray.800')
  // TODO this only works icon hover, not parent button
  const textHoverColor = getColor(
    theme,
    buttonStyle['_hover']['color'] || 'gray.800',
  )

  return (
    <Flex justifyContent="center" alignItems="center" userSelect="none">
      <Box
        fontSize={fontSize ?? '4xl'}
        textShadow={`0 0 1px ${textColor}`}
        _hover={{ textShadow: `0 0 1px ${textHoverColor}` }}
      >
        {emoji}
      </Box>
    </Flex>
  )
}
export default EmojiIcon
