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
import React, { useCallback, useState } from "react";
import { useOvermind } from "../../overmind";
import ColorPicker from "./ColorPicker";
import EmojiPicker from "./EmojiPicker";

export type UserDetailsProps = {
  onDone?: () => void;
};

const UserDetailsForm = ({ onDone }: UserDetailsProps) => {
  const {
    state: { user },
    actions: {
      user: { setUserDetails, throttledSetAlias }
    }
  } = useOvermind();

  const details: Partial<UserDetails> =
    user.state === "Init" ? { type: "UserDetails" } : user.details;

  const [alias, setAlias] = useState(details.alias || "");

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (user.state === "Valid") {
        onDone && onDone();
      }
    },
    [user.state, onDone]
  );

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Skeleton isLoaded={true}>
          <FormControl isInvalid={!alias}>
            <FormLabel>Nickname</FormLabel>
            <Input
              placeholder="Enter your nickname"
              value={alias}
              onChange={event => {
                setAlias(event.target.value);
                throttledSetAlias(event.target.value);
              }}
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
              setColor={color => setUserDetails({ ...details, color })}
            />
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <FormControl>
            <FormLabel>Icon</FormLabel>
            <EmojiPicker
              color={details.color}
              emoji={details.emoji}
              setEmoji={emoji => setUserDetails({ ...details, emoji })}
            />
          </FormControl>
        </Skeleton>

        <Skeleton isLoaded={true}>
          <Flex justifyContent="flex-end" pt={4}>
            <Button type="submit" size="lg" isDisabled={user.state !== "Valid"}>
              {onDone ? "Continue" : "Save"}
            </Button>
          </Flex>
        </Skeleton>
      </Stack>
    </form>
  );
};
export default UserDetailsForm;
