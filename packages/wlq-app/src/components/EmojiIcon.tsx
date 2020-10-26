import { Box, BoxProps, Flex, useTheme } from "@chakra-ui/core";
import { getColor } from "@chakra-ui/theme-tools";
import React from "react";

export type EmojiIconProps = {
  emoji: string;
  variant: string;
  fontSize?: string;
  size?: string;
} & BoxProps;

const EmojiIcon = ({
  emoji,
  variant,
  fontSize = "35xl",
  size = "13",
  ...props
}: EmojiIconProps) => {
  const theme = useTheme();

  const textColor = getColor(theme, "gray.800");
  const textColorHover = getColor(theme, "gray.800");

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
        _hover={{ textShadow: `0 0 1px ${textColorHover}` }}
      >
        {emoji}
      </Box>
    </Flex>
  );
};
export default EmojiIcon;
