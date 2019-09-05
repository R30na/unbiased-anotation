import React from "react";
import { Circle, Transformer } from "react-konva";

const CircleShape = ({ shapeProps, isSelected, onSelect, onChange, onRemove }) => {
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
      <Circle
        onClick={onSelect}
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
        onTransformEnd={e => {
          const node = shapeRef.current;
          if (node.rotation() === shapeProps.rotation) {
            // transformer is changing scale
            const scale = node.scaleX();
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              radius: node.radius() * scale
            });
          } else {
            onChange({
              ...shapeProps,
              rotation: node.rotation()
            });
          }
        }}
        onDblClick={() => onRemove()}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

export default CircleShape;
