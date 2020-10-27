import { Stack } from "@chakra-ui/core";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useOvermind } from "../overmind";

const RoomPage = () => {
  const {
    state: {
      roomSession: { current },
      router: { currentPage }
    },
    actions: {
      roomSession: { requestRoom }
    }
  } = useOvermind();

  useEffect(() => {
    if (currentPage.name === "Room") {
      requestRoom(currentPage);
    }
  }, [currentPage, requestRoom]);

  if (currentPage.name !== "Room") return null;

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead
          title="Geography"
          loading={current === "Init" || current === "Requesting"}
        />
        <div>{currentPage.roomId}</div>
      </Stack>
    </Layout>
  );
};
export default RoomPage;
