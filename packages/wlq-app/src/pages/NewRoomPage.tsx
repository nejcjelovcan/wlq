import { Stack } from "@chakra-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useActions } from "../overmind";
import {
  getNewRoom,
  NewRoomMachine
} from "../overmind/newRoom/newRoom.statemachine";
import RoomCreationForm from "./newRoomPage/RoomCreationForm";

const NewRoomPage = ({ newRoom }: { newRoom: NewRoomMachine }) => {
  const {
    newRoom: { updateNewRoom, submitNewRoom }
  } = useActions();

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead title="New Room" />
        <RoomCreationForm
          newRoom={getNewRoom(newRoom)}
          request={newRoom.request}
          updateNewRoom={updateNewRoom}
          submitNewRoom={submitNewRoom}
        />
      </Stack>
    </Layout>
  );
};
export default NewRoomPage;
