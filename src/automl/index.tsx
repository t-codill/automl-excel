// tslint:disable: file-name-casing
// tslint:disable-next-line:no-submodule-imports
import "react-app-polyfill/ie11";

import { initializeIcons } from "@uifabric/icons";
import "abortcontroller-polyfill";
import "core-js";
import * as React from "react";
import ReactDOM from "react-dom";
import "url-polyfill";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";

import "./index.scss";

initializeIcons();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
