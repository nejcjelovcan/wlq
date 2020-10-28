import { Stack } from "@chakra-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { RoomSessionMachine } from "../overmind/roomSession/roomSession.statemachine";

const RoomPage = ({
  roomSession: { current, room }
}: {
  roomSession: RoomSessionMachine;
}) => {
  // const {
  //   state: {},
  //   actions: {
  //     roomSession: { requestRoom }
  //   }
  // } = useOvermind();

  // useEffect(() => {
  //   if (currentPage.name === "Room") {
  //     requestRoom(currentPage);
  //   }
  // }, [currentPage, requestRoom]);

  // if (currentPage.name !== "Room") return null;

  return (
    <Layout>
      <Stack spacing={4}>
        <PageHead
          title="Geography"
          loading={current === "Init" || room.current === "Empty"}
        />
        <div>{room.current !== "Empty" && room.roomId}</div>
      </Stack>
    </Layout>
  );
};
export default RoomPage;
