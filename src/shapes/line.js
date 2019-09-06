import React from "react";
import { Line, Transformer } from "react-konva";

const LineShape = ({ shapeProps, isSelected, onSelect, onChange, onRemove }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Line
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onDblClick={() => onRemove()}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

export default LineShape;
