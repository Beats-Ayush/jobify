import React from "react";
// import * as ReactDOMClient from "react-dom/client";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/appContext";

const root = document.getElementById("root");
render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  root
);
