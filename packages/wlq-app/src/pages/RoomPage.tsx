import { Stack } from "@chakra-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useOvermind } from "../overmind";

const RoomPage = () => {
  const {
    state: {
      router: { currentPage }
    }
  } = useOvermind();

  if (currentPage.name !== "Room") return null;

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead title="Room" />
        <div>{currentPage.roomId}</div>
      </Stack>
    </Layout>
  );
};
export default RoomPage;
