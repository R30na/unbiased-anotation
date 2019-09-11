import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";

import Shapes from "./stage";

const mainImage =
  "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/large-2479-s-classsaloon.jpg";
const mainImage1 =
  "https://www.twentyonepilots.com/sites/g/files/g2000004896/f/Sample-image10-highres.jpg";
const mainImage2 = "https://www.easyhdr.com/examples/notredame/notredame.jpg";

function App() {
  return (
    <div className="App m-3">
      <Shapes baseImageUrl={mainImage1} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
