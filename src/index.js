import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";

import Shapes from "./shapes";

const mainImage =
  "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/large-2479-s-classsaloon.jpg";

function App() {
  return (
    <div className="App">
      <Shapes baseImageUrl={mainImage}/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
