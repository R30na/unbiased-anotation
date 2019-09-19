import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { mainImage } from "./staticContent.module";
import Stage from "./stage";

function App() {
  return (
    <div className="App m-3">
      <div className="row" style={{ height: "40rem" }}>
        <div className="col-md-8">
          <Stage baseImageUrl={mainImage} />
        </div>
        <div className="col-md-4">Description</div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
