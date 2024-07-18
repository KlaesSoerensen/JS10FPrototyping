import { createSignal, createEffect, JSX } from "solid-js";
import { v4 as uuidv4 } from "uuid";

// Define the properties (props) expected by the Node component
interface NodeProps {
  id: string; // Unique identifier for the node
  x: number; // x-coordinate of the node
  y: number; // y-coordinate of the node
  onPositionChange: (id: string, x: number, y: number) => void; // Callback for when the node position changes
  onStartEdgeCreation: (id: string) => void; // Callback for when starting edge creation
  onCompleteEdgeCreation: (id: string) => void; // Callback for when completing edge creation
  isActive: boolean; // Indicates if the node is active
  isEdgeStart: boolean; // Indicates if the node is the starting node for edge creation
}

const Node = ({ id, x, y, onPositionChange, onStartEdgeCreation, onCompleteEdgeCreation, isActive, isEdgeStart }: NodeProps): JSX.Element => {
  const [isDragging, setIsDragging] = createSignal(false);

  const handleMouseDown = (event: MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (isDragging()) {
      setIsDragging(false);
      if (isEdgeStart) {
        onCompleteEdgeCreation(id);
      } else {
        onStartEdgeCreation(id);
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging()) {
      setIsDragging(true)
      const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
      const newX = event.clientX - rect.left;
      const newY = event.clientY - rect.top;
      onPositionChange(id, newX, newY);
    }
  };

  createEffect(() => {
    const nodeElement = document.getElementById(`node-${id}`);
    if (nodeElement) {
      if (isActive || isDragging()) {
        nodeElement.setAttribute("fill", "red");
        nodeElement.setAttribute("style", "cursor: pointer; filter: url(#glow);");
      } else {
        nodeElement.setAttribute("fill", "blue");
        nodeElement.setAttribute("style", "cursor: pointer; filter: none;");
      }
    }
  });

  return (
    <>
      <circle
        id={`node-${id}`}
        cx={x}
        cy={y}
        r="10"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style="cursor: pointer;"
      />
      <svg width="0" height="0">
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>
    </>
  );
};

export default Node;
