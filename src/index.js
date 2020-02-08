import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Code split => small chunk => easy to inspect
const App = lazy(() => import("./App"));

ReactDOM.render(
  <Suspense fallback={null}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
