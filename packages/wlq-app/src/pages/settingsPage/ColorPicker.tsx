import React from "react";
import { Button, SimpleGrid } from "@chakra-ui/core";
import { USER_DETAILS_COLORS } from "@wlq/wlq-core/lib/model";

export type ColorPickerProps = {
  color?: typeof USER_DETAILS_COLORS[number];
  setColor: (color: typeof USER_DETAILS_COLORS[number]) => void;
};

export default function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <SimpleGrid columns={{ base: 5, sm: 9 }} spacing={2}>
      {USER_DETAILS_COLORS.map(col => (
        <Button
          key={col}
          fontSize="4xl"
          colorScheme={col}
          variant="vibrant"
          onClick={() => setColor(col)}
          aria-label={`Color ${col}`}
        >
          {col === color ? "•" : ""}
        </Button>
      ))}
    </SimpleGrid>
  );
}
