import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Skeleton,
  Spinner,
  Stack,
  Switch
} from "@chakra-ui/core";
import { NewRoom } from "@wlq/wlq-core/lib/model";
import React from "react";
import { useActions } from "../../overmind";

export type RoomCreationFormProps = {
  state: "New" | "Submitted";
  newRoom: Partial<NewRoom>;
  valid: boolean;
  onSubmit: () => void;
};

const RoomCreationForm = ({
  state,
  newRoom,
  valid,
  onSubmit
}: RoomCreationFormProps) => {
  const {
    room: { setNewRoomData }
  } = useActions();

  return (
    <form
      action="?"
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Stack spacing={4}>
        <Skeleton isLoaded>
          <FormControl isReadOnly={state === "Submitted"}>
            <Flex justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="listed">Listed</FormLabel>
              <Switch
                size="lg"
                id="listed"
                isChecked={newRoom.listed}
                onChange={event => {
                  setNewRoomData({
                    ...newRoom,
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
          <FormControl>
            <Flex justifyContent="flex-end" pt={4}>
              <Button
                disabled={!valid}
                type="submit"
                size="lg"
                isLoading={state === "Submitted"}
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
