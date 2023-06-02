import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";

const container = document.getElementById("app");

const Init = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container!);
  root.render(Init);
} else {
  hydrateRoot(container!, <FullApp />);
}
