import React from "react";
import { Rect, Transformer } from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, onRemove }) => {
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
      <Rect
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          const node = shapeRef.current;
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y()
          });
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          if (node.rotation() === shapeProps.rotation) {
            // transformer is changing scale
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY
            });
          } else {
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation()
            });
          }
        }}
        onDblClick={() => onRemove()}
        onDblTap={()=>onRemove()}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

export default Rectangle;
