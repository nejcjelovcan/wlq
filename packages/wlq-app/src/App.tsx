import React from "react";
import "./App.css";
import { useOvermind } from "./overmind";

function App() {
  const {
    state: {
      router: { currentPage }
    }
  } = useOvermind();

  if (currentPage.name === "Index") {
    return (
      <div>
        Index <a href="/settings">Settings</a>
      </div>
    );
  } else if (currentPage.name === "Settings") {
    return <div>Settings</div>;
  }
  return <div className="App"></div>;
}

export default App;
