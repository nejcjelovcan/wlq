import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Skeleton,
  Spinner,
  Stack,
  Switch
} from "@chakra-ui/core";
import { NewRoom } from "@wlq/wlq-core/lib/model";
import React from "react";
import { NewRoomStates } from "../../overmind/newRoom/newRoom.statemachine";

export type RoomCreationFormProps = {
  current: NewRoomStates["current"];
  valid?: boolean;
  newRoomData: Partial<NewRoom>;
  error?: string;
  updateNewRoomData: (data: Partial<NewRoom>) => void;
  submitNewRoom: () => void;
};

const RoomCreationForm = ({
  current,
  newRoomData,
  valid,
  error,
  updateNewRoomData,
  submitNewRoom
}: RoomCreationFormProps) => {
  return (
    <form
      action="?"
      onSubmit={event => {
        event.preventDefault();
        submitNewRoom();
      }}
    >
      <Stack spacing={4}>
        <Skeleton isLoaded>
          <FormControl isReadOnly={current === "Submitting"}>
            <Flex justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="listed">Listed</FormLabel>
              <Switch
                size="lg"
                id="listed"
                isChecked={newRoomData.listed}
                onChange={event => {
                  updateNewRoomData({
                    listed: event.target.checked
                  });
                }}
              />
            </Flex>

            <FormHelperText display="block">
              Listed rooms will be visible to everybody. Turn this off if you
              only want to share links with friends.
            </FormHelperText>
          </FormControl>
        </Skeleton>
        <Skeleton isLoaded>
          <FormControl isInvalid={!!error}>
            <FormErrorMessage>{error}</FormErrorMessage>
            <Flex justifyContent="flex-end" pt={4}>
              <Button
                disabled={current === "Editing" && !valid}
                type="submit"
                size="lg"
                isLoading={current === "Submitting"}
                spinner={<Spinner />}
              >
                Continue
              </Button>
            </Flex>
          </FormControl>
        </Skeleton>
      </Stack>
    </form>
  );
};
export default RoomCreationForm;
