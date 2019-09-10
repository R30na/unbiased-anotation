import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Group } from "react-konva";
import useImage from "use-image";
import Rectangle from "./shapes/rectangle";
import CircleShape from "./shapes/circle";
import LineShape from "./shapes/line";
import {
  squareButton,
  circleButton,
  polygonButton,
  linesButton,
  zoomInButton,
  zoomOutButton,
  maximizeButton,
  undoButton,
  redoButton,
  closeButton
} from "./staticContent.module";

const Shapes = ({ baseImageUrl }) => {
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(history.length - 1);
  const [lineDrawingMode, setLineDrawingMode] = useState(false);
  const [closedMode, setClosedMode] = useState(false);
  const [currentLine, setCurrentline] = useState("");
  const [selectedId, selectShape] = useState(null);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const stageParentRef = React.createRef();

  useEffect(() => {
    const _shapes = JSON.parse(localStorage.getItem("shapes"));
    const _history = JSON.parse(localStorage.getItem("history"));
    const _currentHistoryIndex = JSON.parse(localStorage.getItem("currentHistoryIndex"));
    setShapes(_shapes);
    setHistory(_history);
    setCurrentHistoryIndex(_currentHistoryIndex);
    setStageSize({ w: stageParentRef.current.clientWidth, h: stageParentRef.current.clientHeight });
  }, []);

  useEffect(() => {
    localStorage.setItem("shapes", JSON.stringify(shapes));
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("currentHistoryIndex", JSON.stringify(currentHistoryIndex));
    console.log(shapes);
  }, [shapes]);

  const [mainImage] = useImage(baseImageUrl);

  const addToHistory = shapesToAdd => {
    // const _history = [...history];
    // _history.push(shapesToAdd);
    // setHistory(_history);
    // setCurrentHistoryIndex(history.length);
  };

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
    addToHistory(_shapes);
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
    addToHistory(_shapes);
  };

  const lineDrawing = type => {
    setLineDrawingMode(!lineDrawingMode);
    const date = Date.now();
    setCurrentline("line" + date);
    setClosedMode(type);
  };

  const addDotsToLine = (x, y) => {
    const date = Date.now();
    const dot = {
      type: "dot",
      radius: 3,
      x,
      y,
      stroke: "red",
      fill: "rgba(255,0,0,0.8)",
      id: "dot" + date,
      rotation: 0,
      parentId: currentLine
    };
    const _shapes = [...shapes];
    const index = _shapes.findIndex(item => item.id === currentLine);
    _shapes.push(dot);
    addToHistory(_shapes);

    if (index !== -1) {
      _shapes[index].points.push(x, y);
      setShapes(_shapes);
      addToHistory(_shapes);

      selectShape(_shapes[index].id);
      selectShape(null);
    } else if (index === -1) {
      const line = {
        type: "line",
        closed: closedMode,
        points: [x, y],
        stroke: "red",
        fill: "rgba(255,0,0,0.3)",
        tension: 0,
        id: currentLine,
        rotation: 0
      };
      _shapes.push(line);
      addToHistory(_shapes);
      setShapes(_shapes);
    }
  };

  const removeShape = shapeToDelete => {
    const _shapes = [...shapes];
    const index = _shapes.findIndex(item => item.id === shapeToDelete.id);
    if (index !== -1 && shapeToDelete.type !== "line") {
      _shapes.splice(index, 1);
      setShapes(_shapes);
      addToHistory(_shapes);
    } else if (index !== -1 && shapeToDelete.type === "line") {
      _shapes.splice(index, 1);
      const _filtered = _shapes.filter(item => item.parentId !== shapeToDelete.id);
      setShapes(_filtered);
      addToHistory(_filtered);
    }
  };

  const undo = () => {
    const _index = currentHistoryIndex;
    setShapes(history[_index - 1]);
    setCurrentHistoryIndex(_index - 1);
  };

  const redo = () => {
    const _index = currentHistoryIndex;
    setShapes(history[_index + 1]);
    setCurrentHistoryIndex(_index + 1);
  };

  const removeAllShapes = () => {
    setShapes([]);
    addToHistory([]);
  };

  return (
    <div style={{ flex: 1, width: "100%", height: "100%" }} ref={stageParentRef}>
      <Stage width={stageSize.w} height={stageSize.h}>
        <Layer
          x={stagePosition.x}
          y={stagePosition.y}
          stroke="red"
          draggable={!lineDrawingMode}
          scaleX={stageScale}
          scaleY={stageScale}
          onMouseUp={e => {
            selectShape(null);
            if (lineDrawingMode) {
              const position = e.target.parent.parent.getPointerPosition();
              addDotsToLine(
                (position.x - stagePosition.x) / stageScale,
                (position.y - stagePosition.y) / stageScale
              );
            }
          }}
          onTouchStart={e => {
            selectShape(null);
            if (lineDrawingMode) {
              const position = e.target.parent.parent.getPointerPosition();
              addDotsToLine(position.x, position.y);
            }
          }}
          onDragEnd={e => {
            if (e.target.attrs.type !== "circle" && e.target.attrs.type !== "rectangle") {
              setStagePosition({
                x: e.target.attrs.x,
                y: e.target.attrs.y
              });
            }
          }}
        >
          <Image image={mainImage} width={stageSize.w} height={stageSize.h} />

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
                    addToHistory(_shapes);
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
                          addToHistory(_shapesArray);
                        }
                      }
                    }
                    const _shapes = shapes.slice();
                    delete newAttrs.previousPosition;
                    _shapes[i] = newAttrs;
                    setShapes(_shapes);
                    addToHistory(_shapes);
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
            style={lineDrawingMode && closedMode ? { backgroundColor: "orange" } : null}
            onClick={() => lineDrawing(true)}
          >
            <img src={polygonButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            style={lineDrawingMode && !closedMode ? { backgroundColor: "orange" } : null}
            onClick={() => lineDrawing(false)}
          >
            <img src={linesButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-info" onClick={() => setStageScale(stageScale * 1.3)}>
            <img src={zoomInButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-info" onClick={() => setStageScale(stageScale * 0.85)}>
            <img src={zoomOutButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            onClick={() => {
              setStageScale(1);
              setStagePosition({ x: 0, y: 0 });
            }}
          >
            <img src={maximizeButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            disabled={currentHistoryIndex === 0 || history.length < 1}
            onClick={() => undo()}
          >
            <img src={undoButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            disabled={currentHistoryIndex === history.length - 1 || history.length < 1}
            onClick={() => redo()}
          >
            <img src={redoButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-info"
            onClick={() =>
              window.confirm("Are you sure you want to dlete all the shapes?") && removeAllShapes()
            }
          >
            <img src={closeButton} alt="polygon" style={{ width: "1rem" }} />
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col" style={{ color: "gray" }}>
          <h6>Double tap on a shape to remove</h6>
          <h6>
            Tap on a <b>Circle</b> or <b>Rectangle</b> to <b>resize</b> or <b>rotate</b>
          </h6>
          <h6>
            You can not <b>drag</b> the Stage when drawing a <b>Polygon</b> or <b>Line</b>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Shapes;
