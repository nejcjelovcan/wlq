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
import { RequestMachine } from "../../overmind/request.statemachine";

export type RoomCreationFormProps = {
  newRoom: Partial<NewRoom>;
  request: RequestMachine;
  updateNewRoom: (data: Partial<NewRoom>) => void;
  submitNewRoom: () => void;
};

const RoomCreationForm = ({
  newRoom,
  request,
  updateNewRoom,
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
          <FormControl isReadOnly={request.current === "Requested"}>
            <Flex justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="listed">Listed</FormLabel>
              <Switch
                size="lg"
                id="listed"
                isChecked={newRoom.listed}
                onChange={event =>
                  updateNewRoom({
                    listed: event.target.checked
                  })
                }
              />
            </Flex>

            <FormHelperText display="block">
              Listed rooms will be visible to everybody. Turn this off if you
              only want to share links with friends.
            </FormHelperText>
          </FormControl>
        </Skeleton>
        <Skeleton isLoaded>
          <FormControl isInvalid={request.current === "Error"}>
            <FormErrorMessage>
              {request.current === "Error" ? request.error : ""}
            </FormErrorMessage>
            <Flex justifyContent="flex-end" pt={4}>
              <Button
                disabled={request.current === "Requested"}
                type="submit"
                size="lg"
                isLoading={request.current === "Requested"}
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
