import {
  Box,
  BoxProps,
  Flex,
  SystemStyleObject,
  useStyleConfig
} from "@chakra-ui/core";
import { UserDetails } from "@wlq/wlq-core/lib/model";
import React from "react";
import EmojiIcon from "./EmojiIcon";

export type UserBadgeProps = {
  userDetails: Partial<UserDetails>;
  showAlias?: boolean;
  grayscale?: boolean;
} & BoxProps;

const UserBadge = ({
  userDetails,
  showAlias = true,
  grayscale = false,
  ...props
}: UserBadgeProps) => {
  const colorScheme = userDetails?.color ?? "gray";
  const variant = "vibrant";

  const userBadgeStyle = useStyleConfig("UserBadge", {
    colorScheme,
    variant
  }) as SystemStyleObject;

  return (
    <Flex
      alignItems="center"
      minWidth={showAlias ? "4rem" : "3.2rem"}
      maxWidth={showAlias ? "12rem" : "3.2rem"}
      pr={showAlias ? "4" : "0"}
      sx={userBadgeStyle}
      style={{ filter: grayscale ? "grayscale(100%)" : undefined }}
      {...props}
    >
      <EmojiIcon
        emoji={userDetails?.emoji ?? "🧑🏾"}
        variant="vibrant"
        zIndex="3"
      />

      <Box
        zIndex="1"
        // px="0.5rem"
        transition="all 0.3s ease"
        position="relative"
        opacity={showAlias ? "100" : "0"}
        display="inline-block"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {userDetails?.alias ?? "Alias"}
      </Box>
    </Flex>
  );
};
export default UserBadge;
