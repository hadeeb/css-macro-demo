import React from "react";
import logo from "./logo.svg";
import { css } from "./css.macro";

function App() {
  return (
    <div
      className={css`
        text-align: center;
        a {
          color: #61dafb;
        }
      `}
    >
      <header
        className={css({
          backgroundColor: "#282c34",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "calc(10px + 2vmin)",
          color: "white"
        })}
      >
        <img
          src={logo}
          className={css`
            height: 40vmin;
            pointer-events: none;
            @media (prefers-reduced-motion: no-preference) {
              animation: App-logo-spin infinite 20s linear;
            }
            @keyframes App-logo-spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
          alt="logo"
        />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
