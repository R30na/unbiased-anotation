import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { mainImage } from "./staticContent.module";
import Shapes from "./stage";

function App() {
  return (
    <div className="App m-3">
      <Shapes baseImageUrl={mainImage} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
