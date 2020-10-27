import { ChakraProvider } from "@chakra-ui/core";
import { createOvermind } from "overmind";
import { Provider } from "overmind-react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { config } from "./overmind";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

const overmind = createOvermind(config, { strict: true });

ReactDOM.render(
  <React.StrictMode>
    <Provider value={overmind}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
