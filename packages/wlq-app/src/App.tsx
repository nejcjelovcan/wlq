import { ChakraProvider } from "@chakra-ui/core";
import React from "react";
import "./App.css";
import UserDetailsContext from "./contexts/UserDetailsContext";
import { useOvermindState } from "./overmind";
import Page from "./Page";
import theme from "./theme";

export default function App() {
  const { user } = useOvermindState();
  return (
    <ChakraProvider theme={theme}>
      <UserDetailsContext.Provider
        value={user.current === "Valid" ? user.validDetails : null}
      >
        <Page />
      </UserDetailsContext.Provider>
    </ChakraProvider>
  );
}
