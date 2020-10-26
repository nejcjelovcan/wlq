import React from "react";
import { Button, SimpleGrid } from "@chakra-ui/core";
import {
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS
} from "@wlq/wlq-core/lib/model";
import EmojiIcon from "../../components/EmojiIcon";

export type EmojiPickerProps = {
  color?: typeof USER_DETAILS_COLORS[number];
  emoji?: typeof USER_DETAILS_EMOJIS[number];
  setEmoji: (emoji: typeof USER_DETAILS_EMOJIS[number]) => void;
};

export default function EmojiPicker({
  color,
  emoji,
  setEmoji
}: EmojiPickerProps) {
  return (
    <SimpleGrid columns={{ base: 5, sm: 7 }} spacingY={2} spacingX={2}>
      {USER_DETAILS_EMOJIS.map(emo => {
        const variant = emo === emoji ? "vibrant" : "vibrantHover";
        return (
          <Button
            key={`${color}${emo}`}
            colorScheme={color ?? "red"}
            variant={variant}
            onClick={() => setEmoji(emo)}
            p={2}
            maxWidth="3.5rem"
            height="3.5rem"
            borderRadius="full"
          >
            <EmojiIcon emoji={emo} variant={variant} />
          </Button>
        );
      })}
    </SimpleGrid>
  );
}
