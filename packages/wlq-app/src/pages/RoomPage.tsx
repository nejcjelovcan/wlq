import { Alert, Stack } from "@chakra-ui/core";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import PageHead from "../components/PageHead";
import useUserDetails from "../hooks/useUserDetails";
import { useOvermind } from "../overmind";
import RoomCreationForm from "./roomPage/RoomCreationForm";

const RoomPage = () => {
  const {
    state: { room: roomState },
    actions: {
      room: { requestRoom, startNewRoom, requestCreateRoom }
    }
  } = useOvermind();

  const router = useRouter();
  const routerRoomId =
    typeof router.query.r === "string" ? router.query.r : undefined;

  const newRoom = roomState.matches("New") || roomState.matches("Submitted");

  const userDetails = useUserDetails();
  const loading =
    !userDetails ||
    roomState.matches("Init") ||
    roomState.matches("Requested") ||
    roomState.matches("Submitted");

  useEffect(() => {
    if (routerRoomId) {
      requestRoom({ roomId: routerRoomId });
    } else {
      startNewRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (!rid) {
  //     router.replace(`/room/?r=${currentRoom.roomId}`, undefined, {
  //       shallow: true
  //     });
  //   }
  // }, [currentRoom, rid, router]);

  // const hasRoomId = typeof router.query.r === "string";
  // const roomLoaded = hasRoomId && currentRoom?.roomId === rid;

  // redirect to /room/? if currentRoom changed
  // useEffect(() => {
  //   if (currentRoom?.roomId && !rid) {
  //     router.replace(`/room/?r=${currentRoom.roomId}`, undefined, {
  //       shallow: true
  //     });
  //   }
  // }, [currentRoom, rid, router]);

  // // fetch room if rid is set but no currentRoom
  // useEffect(() => {
  //   if (!roomLoaded && token && !getRoomError && rid) {
  //     getRoom(rid);
  //   }
  // }, [roomLoaded, token, getRoom, rid, getRoomError]);

  // const loading = !ready || (hasRoomId && !error && !roomLoaded);
  const title =
    newRoom || roomState.matches("Init")
      ? "New Game"
      : roomState.matches("Error")
      ? "Error"
      : "Geography";

  return (
    <Stack spacing={4} flexGrow={1}>
      <PageHead
        loading={loading}
        title={title}
        showAlias={
          !(
            (roomState.matches("Joined") || roomState.matches("Room")) &&
            roomState.room.state === "Game"
          )
        }
      />
      {(roomState.matches("New") || roomState.matches("Submitted")) && (
        <RoomCreationForm
          newRoom={roomState.newRoom}
          valid={roomState.valid}
          state={roomState.state}
          onSubmit={() => requestCreateRoom()}
        />
      )}
      {/* {hasRoomId && !error && <RoomDetails />} */}
      {roomState.matches("Error") && (
        <Alert status="error">{roomState.error}</Alert>
      )}
    </Stack>
  );
};
export default RoomPage;
