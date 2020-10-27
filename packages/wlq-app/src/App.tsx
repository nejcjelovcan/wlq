import React from "react";
import "./App.css";
import { useOvermind } from "./overmind";
import IndexPage from "./pages/IndexPage";
import NewRoomPage from "./pages/NewRoomPage";
import RoomPage from "./pages/RoomPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const {
    state: {
      router: { currentPage }
    }
  } = useOvermind();

  if (currentPage.name === "Index") {
    return <IndexPage />;
  } else if (currentPage.name === "Settings") {
    return <SettingsPage />;
  } else if (currentPage.name === "New") {
    return <NewRoomPage />;
  } else if (currentPage.name === "Room") {
    return <RoomPage />;
  }
  return <div className="App"></div>;
}

export default App;
