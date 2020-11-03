import { Center, Spinner } from "@chakra-ui/core";
import React, { useEffect } from "react";
import ColumnFlex from "../components/ColumnFlex";
import Layout from "../components/Layout";
import PageHead from "../components/PageHead";
import { useActions } from "../overmind";
import { RoomSessionMachine } from "../overmind/roomSession/roomSession.statemachine";
import JoinedRoomSessionView from "./roomPage/JoinedRoomSessionView";

const RoomPage = ({ roomSession }: { roomSession: RoomSessionMachine }) => {
  const { room, participants, request } = roomSession;
  const {
    roomSession: { closeWebsocket }
  } = useActions();

  useEffect(() => {
    return () => {
      closeWebsocket();
    };
  }, [closeWebsocket]);

  return (
    <Layout>
      <PageHead title="Geography" loading={room.current === "Empty"} />
      <ColumnFlex>
        {roomSession.current === "Joining" && (
          <Center>
            <Spinner size="xl" />
          </Center>
        )}
        {roomSession.current === "Joined" && (
          <JoinedRoomSessionView
            participants={participants}
            room={room}
            pid={roomSession.pid}
            request={request}
          />
        )}
      </ColumnFlex>
    </Layout>
  );
};
export default RoomPage;
