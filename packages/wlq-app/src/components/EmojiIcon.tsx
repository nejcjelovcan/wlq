import {
  Box,
  BoxProps,
  Flex,
  SystemStyleObject,
  useStyleConfig,
  useTheme,
} from '@chakra-ui/core'
import { getColor } from '@chakra-ui/theme-tools'
import React from 'react'

export type EmojiIconProps = {
  emoji: string
  colorScheme: string
  variant: string
  fontSize?: string
  size?: string
} & BoxProps

const EmojiIcon = ({
  emoji,
  colorScheme,
  variant,
  fontSize = '35xl',
  size = '13',
  ...props
}: EmojiIconProps) => {
  const buttonStyle = useStyleConfig('Button', {
    colorScheme,
    variant,
  }) as SystemStyleObject
  const theme = useTheme()
  const textColor = getColor(theme, buttonStyle['color'] || 'gray.800')
  // TODO this only works for icon hover, not parent button
  const textHoverColor = getColor(
    theme,
    buttonStyle['_hover']['color'] || 'gray.800',
  )

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      userSelect="none"
      {...props}
    >
      <Box
        fontSize={fontSize}
        textShadow={`0 0 1px ${textColor}`}
        width={size}
        height={size}
        verticalAlign="middle"
        lineHeight={size}
        textAlign="center"
        _hover={{ textShadow: `0 0 1px ${textHoverColor}` }}
      >
        {emoji}
      </Box>
    </Flex>
  )
}
export default EmojiIcon
