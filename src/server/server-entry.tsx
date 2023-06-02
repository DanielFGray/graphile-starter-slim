import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "../client/App";
import "../client/index.css";

export function render(url: string) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
}
