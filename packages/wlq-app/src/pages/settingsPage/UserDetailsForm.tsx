import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Skeleton,
  Stack
} from "@chakra-ui/core";
import { UserDetails } from "@wlq/wlq-core/lib/model";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import EmojiPicker from "./EmojiPicker";

export type UserDetailsProps = {
  current: string;
  details: Partial<UserDetails>;
  updateDetails: (details: Partial<UserDetails>) => void;
  onDone: () => void;
};

const UserDetailsForm = ({
  current,
  details,
  updateDetails,
  onDone
}: UserDetailsProps) => {
  const [alias, setAlias] = useState(details.alias ?? "");
  const didMount = useRef(false);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (current === "Valid") onDone();
    },
    [onDone, current]
  );

  useEffect(() => {
    if (didMount.current) {
      updateDetails({ alias: alias || undefined });
    }
    didMount.current = true;
  }, [alias, updateDetails]);

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Skeleton isLoaded={true}>
          <FormControl isInvalid={!alias}>
            <FormLabel>Nickname</FormLabel>
            <Input
              placeholder="Enter your nickname"
              value={alias}
              onChange={event => setAlias(event.target.value)}
            />
            {!details.alias && (
              <FormErrorMessage>Please enter a nickname</FormErrorMessage>
            )}
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <FormControl>
            <FormLabel>Color</FormLabel>
            <ColorPicker
              color={details.color}
              setColor={color => updateDetails({ color })}
            />
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <FormControl>
            <FormLabel>Icon</FormLabel>
            <EmojiPicker
              color={details.color}
              emoji={details.emoji}
              setEmoji={emoji => updateDetails({ emoji })}
            />
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <Flex justifyContent="flex-end" pt={4}>
            <Button type="submit" size="lg" isDisabled={current !== "Valid"}>
              Save
            </Button>
          </Flex>
        </Skeleton>
      </Stack>
    </form>
  );
};
export default UserDetailsForm;
