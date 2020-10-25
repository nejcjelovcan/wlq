import { Box, BoxProps, Flex, useTheme } from "@chakra-ui/core";
import { getColor } from "@chakra-ui/theme-tools";
import React from "react";

export type EmojiIconProps = {
  emoji: string;
  light: boolean;
  variant: string;
  fontSize?: string;
  size?: string;
} & BoxProps;

const EmojiIcon = ({
  emoji,
  light,
  variant,
  fontSize = "35xl",
  size = "13",
  ...props
}: EmojiIconProps) => {
  const theme = useTheme();

  const textColor = light
    ? getColor(theme, "gray.800")
    : getColor(theme, "gray.100");

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
        _hover={{ textShadow: `0 0 1px ${textColor}` }}
      >
        {emoji}
      </Box>
    </Flex>
  );
};
export default EmojiIcon;
