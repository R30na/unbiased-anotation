import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import 'bootstrap/dist/css/bootstrap.css';

import Shapes from "./shapes";

function App() {
  return (
    <div className="App">
      <Shapes />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
