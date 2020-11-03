import React from "react";
import "./App.css";
import { useOvermindState } from "./overmind";
import IndexPage from "./pages/IndexPage";
import NewRoomPage from "./pages/NewRoomPage";
import RoomPage from "./pages/RoomPage";
import SettingsPage from "./pages/SettingsPage";

export default function Page() {
  const state = useOvermindState();

  if (state.current === "Index") {
    return <IndexPage />;
  } else if (state.current === "Settings") {
    return <SettingsPage user={state.user} params={state.params} />;
  } else if (state.current === "New") {
    return <NewRoomPage newRoom={state.newRoom} />;
  } else if (state.current === "Room") {
    return <RoomPage roomSession={state.roomSession} />;
  }

  return <>404</>;
}
