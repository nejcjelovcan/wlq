import { Stack } from "@chakra-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useOvermind } from "../overmind";
import RoomCreationForm from "./roomPage/RoomCreationForm";

const NewRoomPage = () => {
  const {
    state: {
      newRoom,
      router: { currentPage }
    },
    actions: {
      newRoom: { updateNewRoomData, submitNewRoom }
    }
  } = useOvermind();

  if (currentPage.name !== "New") return null;

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead title="New Room" />
        <RoomCreationForm
          {...newRoom}
          updateNewRoomData={updateNewRoomData}
          submitNewRoom={submitNewRoom}
        />
      </Stack>
    </Layout>
  );
};
export default NewRoomPage;
