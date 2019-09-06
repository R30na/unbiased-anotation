import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Group } from "react-konva";
import useImage from "use-image";
import Rectangle from "./shapes/rectangle";
import CircleShape from "./shapes/circle";
import LineShape from "./shapes/line";

const Shapes = ({ baseImageUrl }) => {
  const [shapes, setShapes] = useState([]);
  const [LineDrawingMode, setLineDrawingMode] = useState(false);
  const [currentLine, setCurrentline] = useState("");
  const [selectedId, selectShape] = useState(null);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });

  const stageParentRef = React.createRef();

  useEffect(() => {
    const _shapes = JSON.parse(localStorage.getItem("shapes"));
    setShapes(_shapes);
    setStageSize({ w: stageParentRef.current.clientWidth, h: stageParentRef.current.clientHeight });
  }, []);

  useEffect(() => {
    // console.log(stageSize);
    localStorage.setItem("shapes", JSON.stringify(shapes));
    // console.log(JSON.stringify(shapes, null, 1));
  }, [shapes, stageSize]);

  const [mainImage] = useImage(baseImageUrl);

  const closeButton =
    "https://firebasestorage.googleapis.com/v0/b/data-marketplace-bb1fa.appspot.com/o/staticImages%2Fproject%2Fcancel.svg?alt=media&token=2168342f-b8f6-45f4-baea-0701f74ea927";

  const circleButton =
    "https://firebasestorage.googleapis.com/v0/b/data-marketplace-bb1fa.appspot.com/o/staticImages%2Fproject%2Fcircle.svg?alt=media&token=b3103a98-f927-415b-b6ef-ef712c42ab99";

  const squareButton =
    "https://firebasestorage.googleapis.com/v0/b/data-marketplace-bb1fa.appspot.com/o/staticImages%2Fproject%2Fsquare.svg?alt=media&token=524f916a-1e3c-4acd-a988-695581af1a47";

  const polygonButton =
    "https://firebasestorage.googleapis.com/v0/b/data-marketplace-bb1fa.appspot.com/o/staticImages%2Fproject%2Fpolygon.svg?alt=media&token=4d1bfe65-a4e9-4018-bcea-61a2e40e0566";

  const zoomInButton =
    "https://firebasestorage.googleapis.com/v0/b/data-marketplace-bb1fa.appspot.com/o/staticImages%2Fproject%2Fzoom-in.svg?alt=media&token=b6af3296-b029-4af7-b89e-396111acd8f2";

  const zoomOutButton =
    "https://firebasestorage.googleapis.com/v0/b/data-marketplace-bb1fa.appspot.com/o/staticImages%2Fproject%2Fzoom-out.svg?alt=media&token=ff7a5c62-a9cf-4859-a7b7-cc96f428e29e";

  const addRectangle = () => {
    const date = Date.now();
    const rect = {
      type: "rectangle",
      x: stageSize.w / 2 - stageSize.w * 0.1 + shapes.length * 10,
      y: stageSize.h / 2 - stageSize.h * 0.1 + shapes.length * 10,
      width: stageSize.w * 0.1,
      height: stageSize.h * 0.1,
      stroke: "red",
      fill: "rgba(255,0,0,0.3)",
      id: "rect" + date,
      rotation: 0
    };
    const _shapes = [...shapes];
    _shapes.push(rect);
    setShapes(_shapes);
  };

  const addCircle = () => {
    const date = Date.now();
    const circle = {
      type: "circle",
      x: stageSize.w / 2 - stageSize.w * 0.1 + shapes.length * 10,
      y: stageSize.h / 2 - stageSize.h * 0.1 + shapes.length * 10,
      radius: stageSize.w * 0.05,
      stroke: "red",
      fill: "rgba(255,0,0,0.3)",
      id: "circle" + date,
      rotation: 0
    };
    const _shapes = [...shapes];
    _shapes.push(circle);
    setShapes(_shapes);
  };

  const lineDrawing = () => {
    setLineDrawingMode(!LineDrawingMode);
    const date = Date.now();
    setCurrentline("line" + date);
  };

  const addDotsToLine = (x, y) => {
    const date = Date.now();
    const dot = {
      type: "dot",
      radius: 10,
      x,
      y,
      stroke: "red",
      fill: "rgba(255,0,0,0.3)",
      id: "dot" + date,
      rotation: 0,
      parentId: currentLine
    };

    const _shapes = [...shapes];
    const index = _shapes.findIndex(item => item.id === currentLine);
    _shapes.push(dot);

    if (index !== -1) {
      _shapes[index].points.push(x, y);
      setShapes(_shapes);
      selectShape(_shapes[index].id);
      selectShape(null);
    } else if (index === -1) {
      const line = {
        type: "line",
        closed: true,
        points: [x, y],
        stroke: "red",
        fill: "rgba(255,0,0,0.3)",
        tension: 0,
        id: currentLine,
        rotation: 0
      };
      _shapes.push(line);
      setShapes(_shapes);
    }
  };

  const removeShape = shapeToDelete => {
    const _shapes = [...shapes];
    const index = _shapes.findIndex(item => item.id === shapeToDelete.id);
    if (index !== -1 && shapeToDelete.type !== "line") {
      _shapes.splice(index, 1);
      setShapes(_shapes);
    } else if (index !== -1 && shapeToDelete.type === "line") {
      _shapes.splice(index, 1);
      const _filtered = _shapes.filter(item => item.parentId !== shapeToDelete.id);
      setShapes(_filtered);
    }
  };

  return (
    <div style={{ flex: 1, width: "100%", height: "100%" }} ref={stageParentRef}>
      <Stage width={stageSize.w} height={stageSize.h}>
        <Layer>
          <Image
            image={mainImage}
            width={stageSize.w}
            height={stageSize.h}
            onMouseUp={e => {
              selectShape(null);
              if (LineDrawingMode) {
                const position = e.target.parent.parent.getPointerPosition();
                addDotsToLine(position.x, position.y);
              }
            }}
            onTouchStart={e => {
              selectShape(null);
              if (LineDrawingMode) {
                const position = e.target.parent.parent.getPointerPosition();
                addDotsToLine(position.x, position.y);
              }
            }}
          />
        </Layer>
        <Layer>
          {shapes.map((shape, i) =>
            shape.type === "rectangle" ? (
              <Group key={i}>
                <Rectangle
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => {
                    selectShape(shape.id);
                  }}
                  onChange={newAttrs => {
                    const _shapes = shapes.slice();
                    _shapes[i] = newAttrs;
                    setShapes(_shapes);
                  }}
                  onRemove={() => removeShape(shape)}
                />
              </Group>
            ) : shape.type === "circle" || shape.type === "dot" ? (
              <Group key={i}>
                <CircleShape
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => {
                    if (shape.type !== "dot") selectShape(shape.id);
                  }}
                  onChange={newAttrs => {
                    if (newAttrs.type === "dot" && newAttrs.eventType === "dragend") {
                      const _shapesArray = [...shapes];
                      const index = _shapesArray.findIndex(
                        item =>
                          item.type === "line" && item.points.includes(newAttrs.previousPosition.x)
                      );
                      if (index !== -1) {
                        const foundPoint = _shapesArray[index];
                        const xIndex = foundPoint.points.findIndex(
                          item => item === newAttrs.previousPosition.x
                        );
                        if (
                          xIndex !== -1 &&
                          foundPoint.points[xIndex + 1] === newAttrs.previousPosition.y
                        ) {
                          _shapesArray[index].points[xIndex] = newAttrs.x;
                          _shapesArray[index].points[xIndex + 1] = newAttrs.y;
                          setShapes(_shapesArray);
                        }
                      }
                    }
                    const _shapes = shapes.slice();
                    delete newAttrs.previousPosition;
                    _shapes[i] = newAttrs;
                    setShapes(_shapes);
                  }}
                  onRemove={() => {
                    if (shape.type !== "dot") removeShape(shape);
                  }}
                />
              </Group>
            ) : (
              shape.type === "line" && (
                <Group key={i}>
                  <LineShape
                    key={i}
                    shapeProps={shape}
                    onChange={newAttrs => {
                      const _shapes = shapes.slice();

                      _shapes[i].points.map((item, index) => {
                        if (index % 2 === 0) {
                          _shapes[i].points[index] = item + newAttrs.x;
                        } else if (index % 2 === 1) {
                          _shapes[i].points[index] = item + newAttrs.y;
                        }
                        return true;
                      });
                      _shapes.map(item => {
                        if (item.type === "dot") {
                          item.x = item.x + newAttrs.x;
                          item.y = item.y + newAttrs.y;
                        }
                        return true;
                      });

                      delete newAttrs.x;
                      delete newAttrs.y;
                      _shapes[i] = newAttrs;
                      setShapes(_shapes);
                    }}
                    onRemove={() => {
                      removeShape(shape);
                    }}
                  />
                </Group>
              )
            )
          )}
        </Layer>
      </Stage>
      <div className="row my-3">
        <div className="col">
          <button className="btn btn-info" onClick={() => addRectangle()}>
            <img src={squareButton} alt="square" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-info" onClick={() => addCircle()}>
            <img src={circleButton} alt="circle" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            style={LineDrawingMode ? { backgroundColor: "orange" } : null}
            onClick={() => lineDrawing()}
          >
            <img src={polygonButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-info">
            <img src={zoomInButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-info">
            <img src={zoomOutButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            onClick={() =>
              window.confirm("Are you sure you want to dlete all the shapes?") && setShapes([])
            }
          >
            <img src={closeButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shapes;
